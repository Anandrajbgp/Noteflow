import { useState } from "react";
import { Header } from "@/components/Header";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare } from "lucide-react";

// Empty initial state
const INITIAL_TASKS: any[] = [];

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (newTask: { 
    title: string; 
    frequency: "Daily" | "Weekly" | "Monthly";
    date?: string;
    time?: string;
    notificationTime?: string;
  }) => {
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      frequency: newTask.frequency,
      completed: false,
      date: newTask.date,
      time: newTask.time,
      notificationTime: newTask.notificationTime
    };
    setTasks([task, ...tasks]);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "all") return true;
    return t.frequency.toLowerCase() === filter;
  });

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Tasks" />

      <main className="px-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-secondary/50 p-1 h-auto rounded-xl">
            <TabsTrigger value="all" className="rounded-lg py-2">All</TabsTrigger>
            <TabsTrigger value="daily" className="rounded-lg py-2">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg py-2">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg py-2">Monthly</TabsTrigger>
          </TabsList>

          <div className="space-y-3 mt-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 -z-0">
                <div className="h-24 w-24 bg-[#E0F2F1] rounded-2xl flex items-center justify-center mb-4 text-[#26A69A]">
                  <CheckSquare className="h-10 w-10" />
                </div>
                <p className="text-muted-foreground text-base">No tasks yet</p>
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