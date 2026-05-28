import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOKENS_PER_SUBSCRIPTION = parseInt(Deno.env.get("TOKENS_PER_SUBSCRIPTION") ?? "500");
const TOKENS_PER_REFILL = parseInt(Deno.env.get("TOKENS_PER_REFILL") ?? "200");

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
        const workspaceId = meta.workspace_id ? parseInt(meta.workspace_id) : null;
        const checkoutType = meta.checkout_type;

        if (!workspaceId) break;

        if (checkoutType === "subscription") {
          const subscriptionId = session.subscription as string;
          await supabase
            .from("workspaces")
            .update({ stripe_subscription_id: subscriptionId, subscription_status: "active" })
            .eq("id", workspaceId);
          await supabase.rpc("add_tokens_to_workspace", {
            p_workspace_id: workspaceId,
            p_amount: TOKENS_PER_SUBSCRIPTION,
          });
        } else if (checkoutType === "refill") {
          await supabase.rpc("add_tokens_to_workspace", {
            p_workspace_id: workspaceId,
            p_amount: TOKENS_PER_REFILL,
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason !== "subscription_cycle") break;

        const customerId = invoice.customer as string;
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const workspaceId = customer.metadata.workspace_id
          ? parseInt(customer.metadata.workspace_id)
          : null;

        if (workspaceId) {
          await supabase.rpc("add_tokens_to_workspace", {
            p_workspace_id: workspaceId,
            p_amount: TOKENS_PER_SUBSCRIPTION,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const workspaceId = customer.metadata.workspace_id
          ? parseInt(customer.metadata.workspace_id)
          : null;

        if (workspaceId) {
          await supabase
            .from("workspaces")
            .update({ subscription_status: sub.status })
            .eq("id", workspaceId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const workspaceId = customer.metadata.workspace_id
          ? parseInt(customer.metadata.workspace_id)
          : null;

        if (workspaceId) {
          await supabase
            .from("workspaces")
            .update({ stripe_subscription_id: null, subscription_status: "canceled" })
            .eq("id", workspaceId);
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
