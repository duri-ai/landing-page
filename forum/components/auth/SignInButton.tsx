import { LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@forum/components/ui/Button";
import { loginWithRedirect } from "@forum/config/site";

/**
 * The one sign-in affordance, reused wherever a signed-out user is asked
 * to sign in (header, comment composer, new-post gate) so the control is
 * identical everywhere. Carries the current location so the user returns
 * here after signing in. Size can vary by context.
 */
export function SignInButton({
  size = "sm",
  label = "Sign in",
  showLabelOnMobile = true,
}: {
  size?: "sm" | "md";
  label?: string;
  showLabelOnMobile?: boolean;
}) {
  const location = useLocation();
  const to = loginWithRedirect(location.pathname + location.search);

  return (
    <Link to={to}>
      <Button variant="secondary" size={size}>
        <LogIn size={15} strokeWidth={2} />
        <span className={showLabelOnMobile ? "" : "hidden sm:inline"}>
          {label}
        </span>
      </Button>
    </Link>
  );
}
