import { motion } from "framer-motion";
import { Check, RotateCcw, Calendar, Clock, Bell, Trash2, MoreVertical, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OfflineTask } from "@/lib/offlineStorage";

interface TaskItemProps {
  task: OfflineTask;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'once': return 'Once';
      default: return freq;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border border-border bg-card transition-all group",
        task.completed && "opacity-60 bg-muted/50"
      )}
      data-testid={`task-item-${task.id}`}
    >
      <button
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5",
          task.completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary"
        )}
        data-testid={`button-toggle-task-${task.id}`}
      >
        {task.completed && <Check className="h-3.5 w-3.5" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-medium text-base truncate transition-all",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h4>

        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
          <div className="flex items-center gap-1.5">
            <RotateCcw className="h-3 w-3 text-accent" />
            <span className="text-xs text-accent font-medium uppercase tracking-wider">
              {getFrequencyLabel(task.frequency)}
            </span>
          </div>

          {(task.date || task.time) && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">
                {task.date && new Date(task.date).toLocaleDateString()} {task.time}
              </span>
            </div>
          )}

          {task.reminderEnabled && (
            <div className="flex items-center gap-1.5 text-orange-500">
              <Bell className="h-3 w-3" />
              <span className="text-xs font-medium">
                {task.reminderOffset === "0" ? "At time" : `${task.reminderOffset}m before`}
              </span>
            </div>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            data-testid={`button-task-menu-${task.id}`}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit} data-testid="menu-edit-task">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive" data-testid="menu-delete-task">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
