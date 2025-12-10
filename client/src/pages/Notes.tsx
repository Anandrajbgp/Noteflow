import { useState } from "react";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewNoteDialog } from "@/components/NewNoteDialog";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

// Start with empty notes to match the screenshot "No notes here yet"
const INITIAL_NOTES: any[] = [];

export default function Notes() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNote = (newNote: { title: string; content: string }) => {
    const note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: "Just now",
      color: "bg-background" // Default color
    };
    setNotes([note, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Notes" />
      
      {notes.length > 0 && (
        <div className="px-6 mb-6 sticky top-[88px] z-20 bg-background/95 backdrop-blur py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-9 bg-secondary border-none h-11 rounded-xl text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <main className="px-6">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 -z-0">
            <div className="h-24 w-24 bg-[#FFF8E1] rounded-2xl flex items-center justify-center mb-4 text-[#FFB74D]">
              <FileText className="h-10 w-10" />
            </div>
            <p className="text-muted-foreground text-base">No notes here yet</p>
          </div>
        )}
      </main>

      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />

      <NewNoteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSave={handleAddNote} 
      />
    </div>
  );
}