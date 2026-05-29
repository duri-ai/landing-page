import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOKENS_PER_RECHARGE = parseInt(Deno.env.get("TOKENS_PER_RECHARGE") ?? "200");

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata ?? {};
        const orgId = meta.organization_id ? parseInt(meta.organization_id) : null;
        const checkoutType = meta.type; // "recharge" | "auto_recharge"

        if (!orgId) break;

        if (checkoutType === "auto_recharge") {
          // Record subscription ID; token grant comes on invoice.payment_succeeded
          const subscriptionId = session.subscription as string;
          await supabase
            .from("organizations")
            .update({ stripe_subscription_id: subscriptionId, subscription_status: "active" })
            .eq("id", orgId);
        } else if (checkoutType === "recharge") {
          // One-time recharge — credit paid_balance immediately
          await supabase.rpc("add_tokens_to_workspace", {
            p_workspace_id: orgId,
            p_amount: TOKENS_PER_RECHARGE,
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason !== "subscription_cycle") break;

        // Look up org by stripe_subscription_id — more reliable than customer metadata
        const subscriptionId = invoice.subscription as string;
        const { data: orgs } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_subscription_id", subscriptionId)
          .limit(1);

        const orgId = orgs?.[0]?.id;
        if (orgId) {
          await supabase.rpc("add_tokens_to_workspace", {
            p_workspace_id: orgId,
            p_amount: TOKENS_PER_RECHARGE,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const { data: orgs } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_subscription_id", sub.id)
          .limit(1);

        const orgId = orgs?.[0]?.id;
        if (orgId) {
          await supabase
            .from("organizations")
            .update({ subscription_status: sub.status })
            .eq("id", orgId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const { data: orgs } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_subscription_id", sub.id)
          .limit(1);

        const orgId = orgs?.[0]?.id;
        if (orgId) {
          await supabase
            .from("organizations")
            .update({ stripe_subscription_id: null, subscription_status: null })
            .eq("id", orgId);
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
