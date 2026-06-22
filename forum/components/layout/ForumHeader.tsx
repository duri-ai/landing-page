import { Link } from "react-router-dom";
import { LogOut, MessagesSquare } from "lucide-react";
import { useAuth } from "@forum/auth/AuthContext";
import { SignInButton } from "@forum/components/auth/SignInButton";
import { CompanyMark } from "@forum/components/ui/CompanyMark";
import { Button } from "@forum/components/ui/Button";
import { HOME_URL } from "@forum/config/site";

export function ForumHeader() {
  const { displayName, canDemo, signInAsDemo, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-divider bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-[840px] items-center gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {/* Only the logo + wordmark navigate, and they go to the site root. */}
          <Link
            to={HOME_URL}
            className="inline-flex items-center gap-2"
            aria-label="Duri home"
          >
            <img
              src="/logos/d.svg"
              alt=""
              aria-hidden
              className="h-7 w-7 rounded-[5px]"
            />
            <span className="text-[1.1rem] font-bold tracking-[-0.03em] leading-none text-on-background">
              Duri
            </span>
          </Link>
          <span
            className="hidden items-center gap-1.5 text-sm font-medium text-on-background-secondary sm:inline-flex"
            aria-hidden
          >
            <span className="text-on-background-secondary-variant">/</span>
            Talk with us
            <MessagesSquare size={15} strokeWidth={1.75} />
          </span>
        </div>

        <div className="flex-1" />

        {displayName ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <CompanyMark company={displayName} size={26} shape="circle" />
              <span className="hidden max-w-40 truncate text-sm font-medium text-on-background sm:inline">
                {displayName}
              </span>
            </span>
            <button
              type="button"
              onClick={signOut}
              title="Sign out"
              aria-label="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-xs text-on-background-secondary transition-colors hover:bg-background-warm hover:text-on-background cursor-pointer"
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {canDemo && (
              <Button variant="ghost" size="sm" onClick={signInAsDemo}>
                Preview
              </Button>
            )}
            <SignInButton showLabelOnMobile={false} />
          </div>
        )}
      </div>
    </header>
  );
}

