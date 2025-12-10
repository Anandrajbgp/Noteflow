import { useState } from "react";
import { Header } from "@/components/Header";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, RefreshCw, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { Skeleton } from "@/components/ui/skeleton";
import type { OfflineTask } from "@/lib/offlineStorage";
import { AnimatePresence } from "framer-motion";

export default function Tasks() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<OfflineTask | null>(null);

  const {
    tasks,
    todayTasks,
    upcomingTasks,
    completedTasks,
    incompleteTasks,
    loading,
    syncing,
    createTask,
    updateTask,
    removeTask,
    toggleComplete,
    syncWithCloud,
    sortByDate,
    sortByName,
  } = useTasks();

  // Get filtered tasks
  const getFilteredTasks = () => {
    let filtered: OfflineTask[];
    
    switch (filter) {
      case "today":
        filtered = todayTasks;
        break;
      case "upcoming":
        filtered = upcomingTasks;
        break;
      case "completed":
        filtered = completedTasks;
        break;
      case "daily":
        filtered = tasks.filter(t => t.frequency === "daily");
        break;
      case "weekly":
        filtered = tasks.filter(t => t.frequency === "weekly");
        break;
      case "monthly":
        filtered = tasks.filter(t => t.frequency === "monthly");
        break;
      default:
        filtered = tasks;
    }

    // Apply sorting
    return sortBy === "date" ? sortByDate(filtered) : sortByName(filtered);
  };

  const filteredTasks = getFilteredTasks();

  const handleSaveTask = async (taskData: Partial<OfflineTask>) => {
    if (editTask) {
      await updateTask(editTask.id, taskData);
    } else {
      await createTask(taskData);
    }
    setEditTask(null);
  };

  const handleEditTask = (task: OfflineTask) => {
    setEditTask(task);
    setIsDialogOpen(true);
  };

  const handleOpenNewTask = () => {
    setEditTask(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Tasks" />

      <main className="px-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-4">
          <Tabs value={filter} className="flex-1" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50 p-1 h-auto rounded-xl">
              <TabsTrigger value="all" className="rounded-lg py-2" data-testid="tab-all-tasks">
                All
              </TabsTrigger>
              <TabsTrigger value="today" className="rounded-lg py-2 gap-1" data-testid="tab-today-tasks">
                <Calendar className="h-3 w-3" />
                Today
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-lg py-2 gap-1" data-testid="tab-upcoming-tasks">
                <Clock className="h-3 w-3" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg py-2 gap-1" data-testid="tab-completed-tasks">
                <CheckCircle2 className="h-3 w-3" />
                Done
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={syncWithCloud}
            disabled={syncing}
            data-testid="button-sync-tasks"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Frequency filter */}
        <div className="flex items-center gap-2 mb-4">
          <Tabs value={filter === "daily" || filter === "weekly" || filter === "monthly" ? filter : "all"} onValueChange={setFilter}>
            <TabsList className="bg-secondary/30">
              <TabsTrigger value="all" className="text-xs" data-testid="tab-freq-all">All</TabsTrigger>
              <TabsTrigger value="daily" className="text-xs" data-testid="tab-freq-daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs" data-testid="tab-freq-weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs" data-testid="tab-freq-monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "name")}>
            <SelectTrigger className="w-[120px] h-8" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task list */}
        <div className="space-y-3 mt-4">
          {loading ? (
            <>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </>
          ) : filteredTasks.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                  onToggle={() => toggleComplete(task.id)}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => removeTask(task.id)}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 mt-20">
              <div className="h-24 w-24 bg-[#E0F2F1] dark:bg-teal-900/20 rounded-2xl flex items-center justify-center mb-4 text-[#26A69A]">
                <CheckSquare className="h-10 w-10" />
              </div>
              <p className="text-muted-foreground text-base">
                {filter === "completed" ? "No completed tasks" : 
                 filter === "today" ? "No tasks for today" :
                 filter === "upcoming" ? "No upcoming tasks" :
                 "No tasks yet"}
              </p>
            </div>
          )}
        </div>
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
