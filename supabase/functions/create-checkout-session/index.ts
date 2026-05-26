import Stripe from "https://esm.sh/stripe@14?target=deno";
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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const role = user.user_metadata?.role as string | undefined;
    const workspaceId = user.user_metadata?.workspace_id as string | undefined;
    const tokenBalanceId = user.user_metadata?.token_balance_id as string | undefined;

    if (role !== "admin") throw new Error("Only team admins manage billing");

    const { type } = await req.json() as { type: "subscription" | "refill" };
    if (type !== "subscription" && type !== "refill") throw new Error("Invalid type");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });

    // Get or create Stripe customer
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Look up existing stripe_customer_id
    let stripeCustomerId: string | null = null;

    if (role === "admin" && workspaceId) {
      const { data: ws } = await supabaseAdmin
        .from("workspaces")
        .select("stripe_customer_id")
        .eq("id", parseInt(workspaceId))
        .single();
      stripeCustomerId = ws?.stripe_customer_id ?? null;
    } else {
      // Free user: stored in user metadata
      stripeCustomerId = user.user_metadata?.stripe_customer_id ?? null;
    }

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          user_id: user.id,
          role: "admin",
          workspace_id: workspaceId ?? "",
        },
      });
      stripeCustomerId = customer.id;

      await supabaseAdmin
        .from("workspaces")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", parseInt(workspaceId!));
    }

    const origin = req.headers.get("origin") ?? "https://duri-ai.com";

    if (type === "subscription") {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
        line_items: [{ price: Deno.env.get("STRIPE_MONTHLY_PRICE_ID")!, quantity: 1 }],
        success_url: `${origin}/checkout-return?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing`,
        metadata: {
          user_id: user.id,
          workspace_id: workspaceId ?? "",
          checkout_type: "subscription",
        },
      });
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Refill (one-time payment)
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      line_items: [{ price: Deno.env.get("STRIPE_REFILL_PRICE_ID")!, quantity: 1 }],
      success_url: `${origin}/checkout-return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/account`,
      metadata: {
        user_id: user.id,
        workspace_id: workspaceId ?? "",
        checkout_type: "refill",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
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
