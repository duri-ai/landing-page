import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    // Verify the calling user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const callerRole = user.user_metadata?.role as string | undefined;
    const callerWorkspaceId = user.user_metadata?.workspace_id as string | undefined;
    if (callerRole !== "admin") throw new Error("Only admins can invite members");
    if (!callerWorkspaceId) throw new Error("Admin has no workspace");

    const { email } = await req.json();
    if (!email || typeof email !== "string") throw new Error("Email is required");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check for existing pending invite for this email + workspace
    const { data: existing } = await supabaseAdmin
      .from("invitations")
      .select("id")
      .eq("email", email)
      .eq("workspace_id", parseInt(callerWorkspaceId))
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    // Delete stale/duplicate invite so we issue a fresh one
    if (existing) {
      await supabaseAdmin.from("invitations").delete().eq("id", existing.id);
    }

    // Create the invite record
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("invitations")
      .insert({
        email,
        workspace_id: parseInt(callerWorkspaceId),
        invited_by: user.id,
      })
      .select("token")
      .single();

    if (inviteError || !invite) throw inviteError ?? new Error("Failed to create invite");

    // Send the invite email via Resend
    const origin = req.headers.get("origin") ?? "https://duri-ai.com";
    const inviteUrl = `${origin}/invite-accept?token=${invite.token}`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "Duri <noreply@duri-ai.com>",
        to: email,
        subject: "You've been invited to join a team on Duri",
        html: `
          <p>You've been invited to join a team workspace on Duri.</p>
          <p>
            <a href="${inviteUrl}" style="display:inline-block;padding:10px 20px;background:#00a86b;color:#fff;text-decoration:none;border-radius:4px;">
              Accept invitation
            </a>
          </p>
          <p style="color:#888;font-size:12px;">This invitation expires in 7 days. If you weren't expecting this, you can ignore it.</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const body = await emailRes.text();
      throw new Error(`Failed to send email: ${body}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
