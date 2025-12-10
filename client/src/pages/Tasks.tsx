import { useState } from "react";
import { Header } from "@/components/Header";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INITIAL_TASKS = [
  { id: "1", title: "Morning Meditation", frequency: "Daily" as const, completed: true },
  { id: "2", title: "Read 30 mins", frequency: "Daily" as const, completed: false },
  { id: "3", title: "Weekly Review", frequency: "Weekly" as const, completed: false },
  { id: "4", title: "Water Plants", frequency: "Weekly" as const, completed: true },
  { id: "5", title: "Pay Rent", frequency: "Monthly" as const, completed: false },
  { id: "6", title: "Backup Data", frequency: "Monthly" as const, completed: false },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const filteredTasks = tasks.filter(t => {
    if (filter === "all") return true;
    return t.frequency.toLowerCase() === filter;
  });

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Recurring" subtitle="Manage your habits & routines" />

      <main className="px-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-secondary/50 p-1 h-auto rounded-xl">
            <TabsTrigger value="all" className="rounded-lg py-2">All</TabsTrigger>
            <TabsTrigger value="daily" className="rounded-lg py-2">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg py-2">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg py-2">Monthly</TabsTrigger>
          </TabsList>

          <div className="space-y-3 mt-4">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} />
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                No {filter !== "all" ? filter : ""} tasks found. Add one!
              </div>
            )}
          </div>
        </Tabs>
      </main>

      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />
      
      <NewTaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleAddTask}
      />
    </div>
  );
}