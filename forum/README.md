# Duri Forum

A community space ("Talk with us") where signed-in Duri users post questions,
feature requests, and show what they have built. Comments and nested replies,
reddit-style voting, and a WYSIWYG post composer.

It is **not a separate app**. It is a feature of the landing app, mounted at
the **`/forum`** route (see `src/App.tsx`). The code just lives here in the
top-level `forum/` folder; it is type-checked, built, linted, and served by the
landing app's single Vite setup. There is no separate package.json, dev server,
or build.

## Status

Wired to **Supabase** (tables in `duri-agent/migrations/0010_forum.sql`:
`forum_posts`, `forum_comments`). Reads are public except private posts;
signed-in users post questions, comment, and reply. The landing app talks to
Supabase directly (RLS-enforced); there is no backend in the read/write path.

Comment / reply **email notifications** go through the backend
(`POST /forum/notify-comment` in duri-agent), which emails the post author or
parent-comment author via Resend, deduped by `forum_comments.notified_at`. The
client calls it best-effort after each comment.

## Develop

Everything runs through the landing app at the repo root:

```bash
pnpm install      # installs the whole app (forum deps included)
pnpm dev          # http://localhost:3010  ->  forum at /forum
pnpm build        # tsc -b && vite build (compiles the forum too)
pnpm lint
```

Requires `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (reads
work signed-out; posting needs a signed-in session). `VITE_BACKEND_URL` enables
notification emails. In dev a **Preview as signed-in** button stubs an author so
you can exercise the authoring UI, but writes still hit Supabase and need a real
session.

## Imports

- `@forum/*` -> this folder (alias in `vite.config.ts` + `tsconfig.app.json`).
- `@shared/*` -> the repo-root `supabase/` module (shared client).

Forum navigation is prefixed with `/forum` via the helpers in `config/site.ts`
(`forumHome`, `forumPost`, `forumNew`, `loginWithRedirect`); auth links resolve
to the landing app's own `/login` and `/` routes.

## Layout

```
forum/
  ForumLayout.tsx   route element: AuthProvider + ForumShell (Outlet)
  auth/             AuthContext (shared supabase client, dev preview)
  components/
    ui/             Button, CompanyMark, PrivateChip, PrivateToggle,
                    EmptyState, Skeleton
    layout/         ForumHeader, ForumShell
    post/           PostCard, PostList, RichContent, AuthorLine
    editor/         RichTextEditor (TipTap) + EditorToolbar
    comment/        CommentList, CommentItem (recursive), CommentComposer
    auth/           SignInButton (shared sign-in control)
  data/             types, api (supabase CRUD + notify), commentTree,
                    useForum hooks (async: loading/error/reload)
  lib/              cn, time, sanitize (DOMPurify)
  routes/           FeedPage, PostPage, NewPostPage, NotFoundPage
  config/           site (route helpers + base + intro copy)
```

Posts are ordered newest-first. An author is shown as a company (initial mark
plus company name). Posts and comments can be marked **private** (visible to the
author and the Duri team; faked for now). There is no voting, no categories, and
no sort control. Forum styles live in the landing's `src/index.css`
(class-scoped `.forum-prose`, `.ProseMirror`, etc.) so Tailwind processes them in
one pass. The composer (`RichTextEditor`) is code-split, loaded only on
`/forum/new`.
