import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  completed: boolean;
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
        "flex items-center gap-4 p-4 rounded-xl border border-border bg-card transition-all",
        task.completed && "opacity-60 bg-muted/50"
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
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
        <div className="flex items-center gap-1.5 mt-1">
          <RotateCcw className="h-3 w-3 text-accent" />
          <span className="text-xs text-accent font-medium uppercase tracking-wider">
            {task.frequency}
          </span>
        </div>
      </div>
    </motion.div>
  );
}