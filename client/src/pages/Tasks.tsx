import { useState } from "react";
import { Header } from "@/components/Header";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { ArrowUpDown, MoreVertical, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";
import { Skeleton } from "@/components/ui/skeleton";
import type { OfflineTask } from "@/lib/offlineStorage";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ListType = "today" | "other" | "completed";

export default function Tasks() {
  const [activeList, setActiveList] = useState<ListType>("today");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<OfflineTask | null>(null);
  const { toast } = useToast();

  const {
    tasks,
    todayTasks,
    completedTasks,
    loading,
    syncing,
    createTask,
    updateTask,
    removeTask,
    toggleComplete,
    toggleStar,
    syncWithCloud,
    sortByDate,
    sortByName,
  } = useTasks();

  const otherTasks = tasks.filter(t => !t.completed && !todayTasks.includes(t));

  const getFilteredTasks = () => {
    let filtered: OfflineTask[];
    
    switch (activeList) {
      case "today":
        filtered = todayTasks;
        break;
      case "completed":
        filtered = completedTasks;
        break;
      case "other":
      default:
        filtered = otherTasks;
    }

    return sortBy === "date" ? sortByDate(filtered) : sortByName(filtered);
  };

  const filteredTasks = getFilteredTasks();

  const getListTitle = () => {
    switch (activeList) {
      case "today": return "Today Tasks";
      case "completed": return "Completed";
      case "other": return "Other Work";
      default: return "Tasks";
    }
  };

  const handleSaveTask = async (taskData: Partial<OfflineTask>) => {
    try {
      if (editTask) {
        await updateTask(editTask.id, taskData);
        toast({ title: "Task updated", description: "Your task has been saved" });
      } else {
        await createTask(taskData);
        toast({ title: "Task created", description: "Your new task has been added" });
      }
      setEditTask(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save task" });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await removeTask(taskId);
      toast({ title: "Task deleted", description: "Task has been removed" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete task" });
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await toggleComplete(taskId);
      toast({ title: task?.completed ? "Task marked incomplete" : "Task completed" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update task" });
    }
  };

  const handleToggleStar = async (taskId: string) => {
    try {
      await toggleStar(taskId);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update task" });
    }
  };

  const handleEditTask = (task: OfflineTask) => {
    setEditTask(task);
    setIsDialogOpen(true);
  };

  const handleOpenNewTask = () => {
    setEditTask(null);
    setIsDialogOpen(true);
  };

  const lists: { id: ListType; label: string; count?: number }[] = [
    { id: "today", label: "Today Task", count: todayTasks.length },
    { id: "other", label: "Other Work", count: otherTasks.length },
    { id: "completed", label: "Completed", count: completedTasks.length },
  ];

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Tasks" />

      <main className="px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-2 pb-3">
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeList === list.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
                data-testid={`tab-${list.id}`}
              >
                {list.label}
                {list.count !== undefined && list.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    activeList === list.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {list.count}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleOpenNewTask}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-primary hover:bg-secondary transition-colors whitespace-nowrap"
              data-testid="button-new-list"
            >
              <Plus className="h-4 w-4" />
              New list
            </button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={syncWithCloud}
              disabled={syncing}
              className="ml-auto flex-shrink-0"
              data-testid="button-sync-tasks"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Card className="mt-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 py-4 px-4">
            <h2 className="text-lg font-semibold">{getListTitle()}</h2>
            <div className="flex items-center gap-1">
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => setSortBy(sortBy === "date" ? "name" : "date")}
                data-testid="button-sort-tasks"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" data-testid="button-list-menu">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("date")}>
                    Sort by Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Sort by Name
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="divide-y divide-border">
              {loading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="px-4 py-3">
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </>
              ) : filteredTasks.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task}
                      onToggle={() => handleToggleComplete(task.id)}
                      onStar={() => handleToggleStar(task.id)}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <p className="text-muted-foreground text-sm">
                    {activeList === "completed" ? "No completed tasks" : 
                     activeList === "today" ? "No tasks for today" :
                     "No tasks yet"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <FloatingActionButton onClick={handleOpenNewTask} />
      
      <NewTaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveTask}
        editTask={editTask}
      />
    </div>
  );
}
