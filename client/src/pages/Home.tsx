import { useState } from "react";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { motion } from "framer-motion";

// Mock Data
const RECENT_NOTES = [
  { id: "1", title: "Project Ideas", content: "App for tracking water intake with gamification elements...", date: "2h ago", color: "bg-blue-50 dark:bg-blue-950/20" },
  { id: "2", title: "Grocery List", content: "Milk, Eggs, Bread, Avocados, Coffee beans...", date: "Yesterday", color: "bg-orange-50 dark:bg-orange-950/20" },
];

const TODAY_TASKS = [
  { id: "1", title: "Morning Meditation", frequency: "Daily" as const, completed: true },
  { id: "2", title: "Read 30 mins", frequency: "Daily" as const, completed: false },
  { id: "3", title: "Weekly Review", frequency: "Weekly" as const, completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState(TODAY_TASKS);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="pb-24">
      <Header 
        title="Good Morning" 
        subtitle="You have 2 pending tasks for today."
      />
      
      <main className="px-6 space-y-8">
        {/* Tasks Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold font-heading">Today's Focus</h2>
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {tasks.filter(t => t.completed).length}/{tasks.length} Done
            </span>
          </div>
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </div>
        </section>

        {/* Notes Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold font-heading">Recent Notes</h2>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {RECENT_NOTES.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </main>

      <FloatingActionButton onClick={() => console.log("Add new")} />
    </div>
  );
}