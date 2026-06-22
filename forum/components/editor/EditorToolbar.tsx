import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@forum/lib/cn";

interface ToolButton {
  icon: LucideIcon;
  label: string;
  isActive: (e: Editor) => boolean;
  run: (e: Editor) => void;
}

const BUTTONS: ToolButton[][] = [
  [
    {
      icon: Bold,
      label: "Bold",
      isActive: (e) => e.isActive("bold"),
      run: (e) => e.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Italic",
      isActive: (e) => e.isActive("italic"),
      run: (e) => e.chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      isActive: (e) => e.isActive("strike"),
      run: (e) => e.chain().focus().toggleStrike().run(),
    },
  ],
  [
    {
      icon: Heading2,
      label: "Heading",
      isActive: (e) => e.isActive("heading", { level: 2 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      label: "Bullet list",
      isActive: (e) => e.isActive("bulletList"),
      run: (e) => e.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      isActive: (e) => e.isActive("orderedList"),
      run: (e) => e.chain().focus().toggleOrderedList().run(),
    },
  ],
  [
    {
      icon: Quote,
      label: "Quote",
      isActive: (e) => e.isActive("blockquote"),
      run: (e) => e.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: Code,
      label: "Code block",
      isActive: (e) => e.isActive("codeBlock"),
      run: (e) => e.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: Minus,
      label: "Divider",
      isActive: () => false,
      run: (e) => e.chain().focus().setHorizontalRule().run(),
    },
  ],
];

export function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-divider bg-surface px-2 py-1.5">
      {BUTTONS.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && (
            <span className="mx-1 h-5 w-px bg-divider" aria-hidden />
          )}
          {group.map(({ icon: Icon, label, isActive, run }) => {
            const active = isActive(editor);
            return (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => run(editor)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xs transition-colors duration-150 cursor-pointer",
                  active
                    ? "bg-brand-soft text-brand-variant"
                    : "text-on-background-secondary hover:bg-background-warm hover:text-on-background",
                )}
              >
                <Icon size={16} strokeWidth={2} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
