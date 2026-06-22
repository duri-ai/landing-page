import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@shared/client";
import type { Author } from "@forum/data/types";

const DEMO_KEY = "duri-forum-demo-author";

/** Derive the company name an author posts under. */
function companyFor(user: User): string {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  if (typeof meta.company === "string" && meta.company.trim()) {
    return meta.company.trim();
  }
  if (typeof meta.organization === "string" && meta.organization.trim()) {
    return meta.organization.trim();
  }
  // Fall back to a tidy version of the email domain (acme.com -> Acme).
  const domain = user.email?.split("@")[1]?.split(".")[0];
  if (domain) return domain.charAt(0).toUpperCase() + domain.slice(1);
  return "My Company";
}

function toAuthor(user: User): Author {
  return { id: user.id, company: companyFor(user) };
}

/** The person's display name, for the header (distinct from their company). */
function displayNameFor(user: User): string {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  if (typeof meta.full_name === "string" && meta.full_name.trim()) {
    return meta.full_name.trim();
  }
  if (typeof meta.name === "string" && meta.name.trim()) {
    return meta.name.trim();
  }
  const emailLocal = user.email?.split("@")[0];
  if (emailLocal) return emailLocal;
  return "Member";
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** The viewer as a forum author (company), or null when signed out. */
  currentUser: Author | null;
  /** The viewer's personal display name (header), or null when signed out. */
  displayName: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Dev-only preview of the signed-in experience while on fake data. */
  isDemo: boolean;
  canDemo: boolean;
  signInAsDemo: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  currentUser: null,
  displayName: null,
  loading: true,
  signOut: async () => {},
  isDemo: false,
  canDemo: false,
  signInAsDemo: () => {},
});

function loadDemoAuthor(): Author | null {
  if (!import.meta.env.DEV) return null;
  try {
    const raw = window.localStorage.getItem(DEMO_KEY);
    return raw ? (JSON.parse(raw) as Author) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoAuthor, setDemoAuthor] = useState<Author | null>(loadDemoAuthor);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInAsDemo = useCallback(() => {
    if (!import.meta.env.DEV) return;
    const author: Author = {
      id: `demo-${Math.random().toString(36).slice(2, 8)}`,
      company: "Your Company",
    };
    window.localStorage.setItem(DEMO_KEY, JSON.stringify(author));
    setDemoAuthor(author);
  }, []);

  const signOut = useCallback(async () => {
    window.localStorage.removeItem(DEMO_KEY);
    setDemoAuthor(null);
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const realUser = session?.user ?? null;
    const currentUser = realUser ? toAuthor(realUser) : demoAuthor;
    const displayName = realUser
      ? displayNameFor(realUser)
      : demoAuthor
        ? "You"
        : null;
    return {
      session,
      user: realUser,
      currentUser,
      displayName,
      loading,
      signOut,
      isDemo: !realUser && demoAuthor !== null,
      canDemo: import.meta.env.DEV && !realUser,
      signInAsDemo,
    };
  }, [session, demoAuthor, loading, signOut, signInAsDemo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
