import { useState } from "react";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ALL_NOTES = [
  { id: "1", title: "Project Ideas", content: "App for tracking water intake with gamification elements. Need to sketch out the UI flow for the onboarding process.", date: "2h ago", color: "bg-blue-50 dark:bg-blue-950/20" },
  { id: "2", title: "Grocery List", content: "Milk, Eggs, Bread, Avocados, Coffee beans, Oat milk, Bananas.", date: "Yesterday", color: "bg-orange-50 dark:bg-orange-950/20" },
  { id: "3", title: "Meeting Notes", content: "Discussed Q4 roadmap. Key takeaways: Focus on mobile performance, reduce bundle size, implement dark mode.", date: "Dec 8", color: "bg-green-50 dark:bg-green-950/20" },
  { id: "4", title: "Book Recommendations", content: "The Mom Test, atomic Habits, Deep Work, Clean Code.", date: "Dec 5", color: "bg-purple-50 dark:bg-purple-950/20" },
  { id: "5", title: "Gift Ideas", content: "Headphones for brother, Scarf for mom, Coffee mug for dad.", date: "Nov 28" },
];

export default function Notes() {
  const [search, setSearch] = useState("");
  
  const filteredNotes = ALL_NOTES.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Notes" subtitle={`${filteredNotes.length} notes found`} />
      
      <div className="px-6 mb-6 sticky top-[120px] z-20 bg-background/95 backdrop-blur py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your notes..." 
            className="pl-9 bg-secondary border-none h-11 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <main className="px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </main>

      <FloatingActionButton onClick={() => console.log("New Note")} />
    </div>
  );
}