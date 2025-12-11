import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TaskItem } from "@/components/TaskItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { ArrowUpDown, MoreVertical, Plus, RefreshCw, Pencil, Trash2, CheckCircle, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";
import { useNotifications } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import type { OfflineTask } from "@/lib/offlineStorage";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TaskList } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SortType = "order" | "date" | "name";

export default function Tasks() {
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortType>("order");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<OfflineTask | null>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const { toast } = useToast();

  const {
    tasks,
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
    refresh: refreshTasks,
  } = useTasks();

  const { permissionStatus, requestPermission } = useNotifications(tasks);

  useEffect(() => {
    if (permissionStatus === 'default') {
      requestPermission();
    }
  }, [permissionStatus, requestPermission]);

  const { data: taskLists = [], isLoading: listsLoading } = useQuery<TaskList[]>({
    queryKey: ['/api/task-lists'],
  });

  const createListMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiRequest('POST', '/api/task-lists', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/task-lists'] });
      toast({ title: "List created" });
    },
  });

  const renameListMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      return apiRequest('PATCH', `/api/task-lists/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/task-lists'] });
      toast({ title: "List renamed" });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/task-lists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/task-lists'] });
      setActiveListId(null);
      toast({ title: "List deleted" });
    },
  });

  const deleteCompletedMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/task-lists/${id}/completed`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/task-lists'] });
      refreshTasks();
      toast({ title: "Completed tasks deleted" });
    },
  });

  const activeList = taskLists.find(l => l.id === activeListId);

  const getFilteredTasks = () => {
    let filtered: OfflineTask[];
    
    if (activeListId === null) {
      const today = new Date().toISOString().split('T')[0];
      filtered = tasks.filter(t => t.date === today && !t.completed);
    } else {
      filtered = tasks.filter(t => t.listId === activeListId);
    }

    switch (sortBy) {
      case "date":
        return sortByDate(filtered);
      case "name":
        return sortByName(filtered);
      case "order":
      default:
        return filtered;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getListTitle = () => {
    if (activeListId === null) return "Today Task";
    return activeList?.name || "Tasks";
  };

  const handleSaveTask = async (taskData: Partial<OfflineTask>) => {
    try {
      if (editTask) {
        await updateTask(editTask.id, taskData);
        toast({ title: "Task updated", description: "Your task has been saved" });
      } else {
        await createTask({ ...taskData, listId: activeListId || undefined });
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

  const handleCreateList = () => {
    if (newListName.trim()) {
      createListMutation.mutate(newListName.trim());
      setNewListName("");
      setIsNewListDialogOpen(false);
    }
  };

  const handleRenameList = () => {
    if (activeListId && renameValue.trim()) {
      renameListMutation.mutate({ id: activeListId, name: renameValue.trim() });
      setRenameValue("");
      setIsRenameDialogOpen(false);
    }
  };

  const handleDeleteList = () => {
    if (activeListId) {
      deleteListMutation.mutate(activeListId);
    }
  };

  const handleDeleteCompleted = () => {
    if (activeListId) {
      deleteCompletedMutation.mutate(activeListId);
    }
  };

  const openRenameDialog = () => {
    setRenameValue(activeList?.name || "");
    setIsRenameDialogOpen(true);
  };

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Header title="Tasks" />

      <main className="px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-2 pb-3">
            <button
              onClick={() => setActiveListId(null)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeListId === null
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
              data-testid="tab-today"
            >
              Today Task
            </button>
            
            {taskLists.map((list) => (
              <button
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeListId === list.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
                data-testid={`tab-list-${list.id}`}
              >
                {list.name}
              </button>
            ))}
            
            <button
              onClick={() => setIsNewListDialogOpen(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-primary hover:bg-secondary transition-colors whitespace-nowrap"
              data-testid="button-new-list"
            >
              <Plus className="h-4 w-4" />
              New list
            </button>
            
            <div className="ml-auto flex items-center gap-1 flex-shrink-0">
              {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={requestPermission}
                  className="text-muted-foreground"
                  data-testid="button-enable-notifications"
                  title="Enable notifications"
                >
                  <BellOff className="h-4 w-4" />
                </Button>
              )}
              {permissionStatus === 'granted' && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-primary"
                  data-testid="button-notifications-enabled"
                  title="Notifications enabled"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              )}
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
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Card className="mt-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 py-4 px-4">
            <h2 className="text-lg font-semibold">{getListTitle()}</h2>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" data-testid="button-sort-tasks">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setSortBy("order")}
                    data-testid="menu-sort-order"
                  >
                    My order
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy("date")}
                    data-testid="menu-sort-date"
                  >
                    Date
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy("name")}
                    data-testid="menu-sort-name"
                  >
                    Name
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {activeListId !== null && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" data-testid="button-list-menu">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={openRenameDialog} data-testid="menu-rename-list">
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename list
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteList} data-testid="menu-delete-list">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete list
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDeleteCompleted} data-testid="menu-delete-completed">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Delete completed tasks
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="divide-y divide-border">
              {loading || listsLoading ? (
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
                    {activeListId === null ? "No tasks for today" : "No tasks in this list"}
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

      <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-list-name">List name</Label>
            <Input
              id="new-list-name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list name"
              className="mt-2"
              data-testid="input-new-list-name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={!newListName.trim()} data-testid="button-create-list">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rename-list">List name</Label>
            <Input
              id="rename-list"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Enter new name"
              className="mt-2"
              data-testid="input-rename-list"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameList} disabled={!renameValue.trim()} data-testid="button-rename-list">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
