-- ============================================================
-- Billing overhaul: pay-as-you-go with monthly default credit
-- ============================================================
-- NOTE: DEFAULT_MONTHLY_CREDIT_USD is set to 5.00 below as a
-- placeholder — confirm the amount with Jay before running.
-- ============================================================

-- 1. Split token_balances: add paid_balance + monthly_balance
--    Keep the legacy `balance` column so old code doesn't break
--    until accounting.py is updated to call deduct_tokens().
ALTER TABLE public.token_balances
  ADD COLUMN IF NOT EXISTS paid_balance real NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_balance real NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_reset_at timestamptz NOT NULL DEFAULT now();

-- Migrate existing balance → paid_balance for any rows that have a non-zero balance
UPDATE public.token_balances SET paid_balance = balance WHERE balance > 0;

-- Grant the initial monthly credit to all existing orgs
-- (new signups get it via the updated create_organization RPC)
UPDATE public.token_balances SET monthly_balance = 5.00;

-- 2. Fix add_tokens_to_workspace: workspaces → organizations
--    Old version referenced non-existent `workspaces` table.
CREATE OR REPLACE FUNCTION public.add_tokens_to_workspace(
  p_workspace_id bigint,
  p_amount real
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance_id bigint;
BEGIN
  SELECT token_balance_id INTO v_balance_id
  FROM organizations
  WHERE id = p_workspace_id;

  IF v_balance_id IS NULL THEN
    RAISE EXCEPTION 'Organization % has no token_balance_id', p_workspace_id;
  END IF;

  UPDATE token_balances
  SET paid_balance = paid_balance + p_amount
  WHERE id = v_balance_id;
END;
$$;

-- 3. New function: deduct tokens (monthly first, then paid)
--    Called by accounting.py instead of a raw UPDATE.
CREATE OR REPLACE FUNCTION public.deduct_tokens(
  p_token_balance_id bigint,
  p_amount real
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_monthly real;
  v_monthly_deduct real;
  v_paid_deduct real;
BEGIN
  SELECT monthly_balance INTO v_monthly
  FROM token_balances
  WHERE id = p_token_balance_id
  FOR UPDATE;

  v_monthly_deduct := LEAST(v_monthly, p_amount);
  v_paid_deduct    := GREATEST(0.0, p_amount - v_monthly);

  UPDATE token_balances
  SET
    monthly_balance = monthly_balance - v_monthly_deduct,
    paid_balance    = paid_balance    - v_paid_deduct,
    updated_at      = now()
  WHERE id = p_token_balance_id;
END;
$$;

-- 4. Update create_organization: grant initial monthly credit to new signups
CREATE OR REPLACE FUNCTION public.create_organization(org_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tb_id  bigint;
  org_id bigint;
BEGIN
  INSERT INTO public.token_balances (paid_balance, monthly_balance, monthly_reset_at)
  VALUES (0, 5.00, now())  -- 5.00 = DEFAULT_MONTHLY_CREDIT_USD placeholder
  RETURNING id INTO tb_id;

  INSERT INTO public.organizations (name, token_balance_id)
  VALUES (org_name, tb_id)
  RETURNING id INTO org_id;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (org_id, auth.uid(), 'admin');

  RETURN json_build_object('organization_id', org_id, 'token_balance_id', tb_id);
END;
$$;

-- 5. Allow usage_logs.organization_id to be nullable
--    Required for the invite edge-case cleanup where we nullify
--    usage history when deleting a solo org (preserves audit trail).
ALTER TABLE public.usage_logs
  ALTER COLUMN organization_id DROP NOT NULL;

-- 6. Monthly credit reset cron job
--    Resets monthly_balance to 5.00 on the 1st of each month.
--    Requires pg_cron extension — enable it in Supabase dashboard first
--    (Database → Extensions → pg_cron).
SELECT cron.schedule(
  'monthly-credit-reset',
  '0 0 1 * *',
  $$
    UPDATE public.token_balances
    SET monthly_balance = 5.00, monthly_reset_at = now()
    WHERE monthly_reset_at < date_trunc('month', now());
  $$
);

-- 7. Drop stale functions that reference the old workspaces table.
--    None of these are called by current frontend or backend code.
DROP FUNCTION IF EXISTS public.accept_invite_for_member(uuid, uuid);
DROP FUNCTION IF EXISTS public.add_workspace_member(bigint, uuid);
DROP FUNCTION IF EXISTS public.get_workspace_with_members(bigint);
DROP FUNCTION IF EXISTS public.validate_invite_token(uuid);
