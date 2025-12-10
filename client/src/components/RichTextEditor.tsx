import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start typing...', 
  className,
  editable = true 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-3',
      },
    },
  });

  // Sync content when it changes externally (e.g., when editing a note)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border border-border rounded-xl overflow-hidden bg-background", className)}>
      {editable && (
        <div className="flex items-center gap-1 p-2 border-b border-border bg-secondary/30">
          <Button
            type="button"
            size="icon"
            variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-testid="button-bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-testid="button-italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-testid="button-underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            size="icon"
            variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-testid="button-bullet-list"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-testid="button-ordered-list"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      )}
      <EditorContent 
        editor={editor} 
        className="text-foreground"
      />
      {!content && editable && (
        <div className="absolute top-12 left-3 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}

// Read-only display component
export function RichTextDisplay({ content, className }: { content: string; className?: string }) {
  return (
    <div 
      className={cn("prose prose-sm max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
