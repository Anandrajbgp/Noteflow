import { motion } from "framer-motion";
import { Check, Star, MoreVertical, Edit2, Trash2 } from "lucide-react";
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
  onStar: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onStar, onEdit, onDelete }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-all group",
        task.completed && "opacity-60"
      )}
      data-testid={`task-item-${task.id}`}
    >
      <button
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
          task.completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        )}
        data-testid={`button-toggle-task-${task.id}`}
      >
        {task.completed && <Check className="h-3.5 w-3.5" />}
      </button>
      
      <div className="flex-1 min-w-0" onClick={onEdit}>
        <p className={cn(
          "text-sm transition-all cursor-pointer",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onStar}
          className="p-1.5 transition-colors"
          data-testid={`button-star-task-${task.id}`}
        >
          <Star 
            className={cn(
              "h-5 w-5 transition-colors",
              task.starred 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-muted-foreground/40 hover:text-muted-foreground"
            )} 
          />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
      </div>
    </motion.div>
  );
}
