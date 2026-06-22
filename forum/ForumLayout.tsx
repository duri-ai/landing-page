import { AuthProvider } from "@forum/auth/AuthContext";
import { ForumShell } from "@forum/components/layout/ForumShell";

/**
 * Layout element for the ``/forum`` route group. Provides the forum's auth
 * context (signed-in author + dev preview) around the shell, whose
 * ``<Outlet/>`` renders the nested forum pages.
 */
export function ForumLayout() {
  return (
    <AuthProvider>
      <ForumShell />
    </AuthProvider>
  );
}
