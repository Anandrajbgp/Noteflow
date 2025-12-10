import { useState } from "react";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  completed: boolean;
}

// Mock Data Initial State
const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Morning Meditation", frequency: "Daily", completed: true },
  { id: "2", title: "Read 30 mins", frequency: "Daily", completed: false },
  { id: "3", title: "Weekly Review", frequency: "Weekly", completed: false },
];

const INITIAL_NOTES = [
  { id: "1", title: "Project Ideas", content: "App for tracking water intake with gamification elements...", date: "2h ago", color: "bg-blue-50 dark:bg-blue-950/20" },
  { id: "2", title: "Grocery List", content: "Milk, Eggs, Bread, Avocados, Coffee beans...", date: "Yesterday", color: "bg-orange-50 dark:bg-orange-950/20" },
];

export default function Home() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (newTask: { title: string; frequency: "Daily" | "Weekly" | "Monthly" }) => {
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      frequency: newTask.frequency,
      completed: false
    };
    setTasks([task, ...tasks]);
  };

  return (
    <div className="pb-24">
      <Header 
        title="Good Morning" 
        subtitle={`You have ${tasks.filter(t => !t.completed).length} pending tasks for today.`}
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
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                No tasks for today. Enjoy your day!
              </div>
            )}
          </div>
        </section>

        {/* Notes Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold font-heading">Recent Notes</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </main>

      <FloatingActionButton onClick={() => setIsTaskDialogOpen(true)} />
      
      <NewTaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
        onSave={handleAddTask}
      />
    </div>
  );
}