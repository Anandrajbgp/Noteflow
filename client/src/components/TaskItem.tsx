import { motion } from "framer-motion";
import { Check, RotateCcw, Calendar, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  completed: boolean;
  date?: string;
  time?: string;
  reminderOffset?: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <motion.div
      layout
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border border-border bg-card transition-all",
        task.completed && "opacity-60 bg-muted/50"
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5",
          task.completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary"
        )}
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
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
          <div className="flex items-center gap-1.5">
            <RotateCcw className="h-3 w-3 text-accent" />
            <span className="text-xs text-accent font-medium uppercase tracking-wider">
              {task.frequency}
            </span>
          </div>

          {(task.date || task.time) && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">
                {task.date} {task.time}
              </span>
            </div>
          )}

          {task.reminderOffset && (
            <div className="flex items-center gap-1.5 text-orange-500">
              <Bell className="h-3 w-3" />
              <span className="text-xs font-medium">
                {task.reminderOffset === "0" ? "At time of event" : `${task.reminderOffset} min before`}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}