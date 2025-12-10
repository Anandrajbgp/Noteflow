import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color?: string;
}

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function NoteCard({ note, onDelete, onClick }: NoteCardProps) {
  return (
    <motion.div
      layoutId={note.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(note.id)}
      className={cn(
        "group relative p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
        note.color
      )}
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(note.id);
          }}
          className="p-2 rounded-full hover:bg-black/5 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-1">{note.title}</h3>
      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
        {note.content}
      </p>
      <div className="mt-4 text-xs text-muted-foreground font-medium">
        {note.date}
      </div>
    </motion.div>
  );
}