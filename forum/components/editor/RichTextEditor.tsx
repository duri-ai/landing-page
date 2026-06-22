import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "@forum/components/editor/EditorToolbar";

interface RichTextEditorProps {
  /** Initial HTML; the editor is otherwise uncontrolled to keep the caret stable. */
  defaultValue?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  defaultValue = "",
  onChange,
  placeholder = "Write your post…",
}: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    autofocus: false,
    editorProps: {
      attributes: {
        class: "forum-prose px-3.5 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getHTML()),
  });

  return (
    <div className="overflow-hidden rounded-xs border border-divider-strong bg-background focus-within:border-on-background-secondary">
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
