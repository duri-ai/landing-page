-- Add Stripe fields to workspaces table
alter table public.workspaces
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text;

-- RPC: add tokens to a workspace's token_balance
create or replace function public.add_tokens_to_workspace(
  p_workspace_id bigint,
  p_amount real
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance_id bigint;
begin
  select token_balance_id into v_balance_id
  from workspaces
  where id = p_workspace_id;

  if v_balance_id is null then
    raise exception 'Workspace % has no token_balance_id', p_workspace_id;
  end if;

  update token_balances
  set balance = balance + p_amount
  where id = v_balance_id;
end;
$$;

-- RPC: add tokens to a free user's token_balance
create or replace function public.add_tokens_to_balance(
  p_token_balance_id bigint,
  p_amount real
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update token_balances
  set balance = balance + p_amount
  where id = p_token_balance_id;
end;
$$;

-- Update get_workspace_with_members to include subscription_status
create or replace function public.get_workspace_with_members(p_workspace_id bigint)
returns json
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_result json;
begin
  select json_build_object(
    'id', w.id,
    'name', w.name,
    'token_balance', coalesce(tb.balance, 0),
    'subscription_status', w.subscription_status,
    'admin', json_build_object(
      'id', a.id,
      'email', a.email,
      'full_name', a.raw_user_meta_data->>'full_name'
    ),
    'members', coalesce((
      select json_agg(json_build_object(
        'id', u.id,
        'email', u.email,
        'full_name', u.raw_user_meta_data->>'full_name'
      ))
      from auth.users u
      where (u.raw_user_meta_data->>'workspace_id')::bigint = w.id
        and (u.raw_user_meta_data->>'role') = 'member'
    ), '[]'::json)
  )
  into v_result
  from workspaces w
  left join token_balances tb on tb.id = w.token_balance_id
  join auth.users a on a.id = w.admin_user_id
  where w.id = p_workspace_id;

  return v_result;
end;
$$;
