import { useState } from "react";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewNoteDialog } from "@/components/NewNoteDialog";
import { Search, FileText, Archive, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotes } from "@/hooks/useNotes";
import { Skeleton } from "@/components/ui/skeleton";
import type { OfflineNote } from "@/lib/offlineStorage";
import { AnimatePresence } from "framer-motion";

export default function Notes() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<OfflineNote | null>(null);
  const [tab, setTab] = useState<"active" | "archived">("active");
  
  const { 
    activeNotes, 
    archivedNotes, 
    loading,
    syncing,
    createNote,
    updateNote,
    removeNote,
    togglePin,
    toggleArchive,
    lockNote,
    unlockNote,
    syncWithCloud
  } = useNotes();
  
  const notesToShow = tab === "active" ? activeNotes : archivedNotes;
  const filteredNotes = notesToShow.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveNote = async (noteData: Partial<OfflineNote>) => {
    if (editNote) {
      await updateNote(editNote.id, noteData);
    } else {
      await createNote(noteData);
    }
    setEditNote(null);
  };

  const handleEditNote = (note: OfflineNote) => {
    setEditNote(note);
    setIsDialogOpen(true);
  };

  const handleOpenNewNote = () => {
    setEditNote(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Notes" />
      
      {/* Tabs and Search */}
      <div className="px-6 space-y-4 sticky top-[88px] z-20 bg-background/95 backdrop-blur py-2">
        <div className="flex items-center gap-2">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "active" | "archived")} className="flex-1">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="active" className="gap-2" data-testid="tab-active-notes">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="archived" className="gap-2" data-testid="tab-archived-notes">
                <Archive className="h-4 w-4" />
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={syncWithCloud}
            disabled={syncing}
            data-testid="button-sync"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {notesToShow.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-9 bg-secondary border-none h-11 rounded-xl text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-notes"
            />
          </div>
        )}
      </div>

      <main className="px-6 mt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => removeNote(note.id)}
                  onTogglePin={() => togglePin(note.id)}
                  onToggleArchive={() => toggleArchive(note.id)}
                  onLock={(pin) => lockNote(note.id, pin)}
                  onUnlock={() => unlockNote(note.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 mt-20">
            <div className="h-24 w-24 bg-[#FFF8E1] dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-4 text-[#FFB74D]">
              {tab === "active" ? (
                <FileText className="h-10 w-10" />
              ) : (
                <Archive className="h-10 w-10" />
              )}
            </div>
            <p className="text-muted-foreground text-base">
              {tab === "active" ? "No notes here yet" : "No archived notes"}
            </p>
          </div>
        )}
      </main>

      <FloatingActionButton onClick={handleOpenNewNote} />

      <NewNoteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSave={handleSaveNote}
        editNote={editNote}
      />
    </div>
  );
}
