import { Outlet } from "react-router-dom";
import { ForumHeader } from "@forum/components/layout/ForumHeader";

export function ForumShell() {
  return (
    <div className="min-h-screen bg-background-warm text-on-background">
      <ForumHeader />
      <main className="mx-auto w-full max-w-[840px] px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
