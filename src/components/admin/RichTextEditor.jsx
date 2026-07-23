'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

// Reusable rich-text editor for admin forms. Keeps a hidden input in sync with
// the editor's HTML so the value posts with a normal <form>/Server Action.
export default function RichTextEditor({ name, defaultValue = '', dir = 'ltr' }) {
  const [html, setHtml] = useState(defaultValue || '');

  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue || '',
    immediatelyRender: false, // avoid SSR hydration mismatch in Next.js
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: { attributes: { class: 'rte-content', dir } },
  });

  const btn = (active) => `rte-btn${active ? ' active' : ''}`;

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <button type="button" className={btn(editor?.isActive('bold'))} onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold">
          B
        </button>
        <button type="button" className={btn(editor?.isActive('italic'))} onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic" style={{ fontStyle: 'italic' }}>
          I
        </button>
        <button type="button" className={btn(editor?.isActive('heading', { level: 2 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading">
          H2
        </button>
        <button type="button" className={btn(editor?.isActive('heading', { level: 3 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} title="Subheading">
          H3
        </button>
        <button type="button" className={btn(editor?.isActive('bulletList'))} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet list">
          • List
        </button>
        <button type="button" className={btn(editor?.isActive('orderedList'))} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Numbered list">
          1. List
        </button>
        <button type="button" className={btn(editor?.isActive('blockquote'))} onClick={() => editor?.chain().focus().toggleBlockquote().run()} title="Quote">
          ❝
        </button>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
