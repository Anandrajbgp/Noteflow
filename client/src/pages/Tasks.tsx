import { useState } from "react";
import { Header } from "@/components/Header";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@shared/schema";

export default function Tasks() {
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: { 
      title: string; 
      frequency: string;
      date?: string;
      time?: string;
      reminderOffset?: string;
    }) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: false }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const toggleTask = (id: number, completed: boolean) => {
    updateTaskMutation.mutate({ id, completed: !completed });
  };

  const handleAddTask = (newTask: { 
    title: string; 
    frequency: "Daily" | "Weekly" | "Monthly";
    date?: string;
    time?: string;
    reminderOffset?: string;
  }) => {
    createTaskMutation.mutate(newTask);
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
                <TaskItem 
                  key={task.id} 
                  task={{
                    id: task.id.toString(),
                    title: task.title,
                    frequency: task.frequency as "Daily" | "Weekly" | "Monthly",
                    completed: task.completed,
                    date: task.date || undefined,
                    time: task.time || undefined,
                    reminderOffset: task.reminderOffset || undefined,
                  }} 
                  onToggle={() => toggleTask(task.id, task.completed)} 
                />
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