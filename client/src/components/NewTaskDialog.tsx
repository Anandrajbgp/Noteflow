import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { OfflineTask } from "@/lib/offlineStorage";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Partial<OfflineTask>) => void;
  editTask?: OfflineTask | null;
}

export function NewTaskDialog({ open, onOpenChange, onSave, editTask }: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"once" | "daily" | "weekly" | "monthly">("once");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [enableNotification, setEnableNotification] = useState(false);
  const [reminderOffset, setReminderOffset] = useState("15");

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setFrequency(editTask.frequency);
      setDate(editTask.date || "");
      setTime(editTask.time || "");
      setEnableNotification(editTask.reminderEnabled);
      setReminderOffset(editTask.reminderOffset || "15");
    } else {
      resetForm();
    }
  }, [editTask, open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFrequency("once");
    setDate("");
    setTime("");
    setEnableNotification(false);
    setReminderOffset("15");
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave({ 
        title, 
        description: description || undefined,
        frequency,
        date: date || undefined,
        time: time || undefined,
        reminderEnabled: enableNotification,
        reminderOffset: enableNotification ? reminderOffset : undefined
      });
      
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editTask ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Task Name</Label>
            <Input
              id="task-title"
              placeholder="e.g. Morning Meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-task-title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Description (optional)</Label>
            <Textarea
              id="task-description"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
              data-testid="input-task-description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
                <SelectTrigger data-testid="select-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
               <Label htmlFor="date">Date</Label>
               <Input 
                 id="date" 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 data-testid="input-task-date"
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
               <Label htmlFor="time">Time</Label>
               <Input 
                 id="time" 
                 type="time" 
                 value={time}
                 onChange={(e) => setTime(e.target.value)}
                 data-testid="input-task-time"
               />
            </div>
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <div className="text-xs text-muted-foreground">
                Get reminded at a specific time
              </div>
            </div>
            <Switch 
              id="notifications" 
              checked={enableNotification}
              onCheckedChange={setEnableNotification}
              data-testid="switch-notifications"
            />
          </div>

          {enableNotification && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
               <Label htmlFor="reminder-offset">Remind me</Label>
               <Select value={reminderOffset} onValueChange={setReminderOffset}>
                <SelectTrigger data-testid="select-reminder-offset">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">At time of event</SelectItem>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-task">
            {editTask ? 'Update' : 'Add'} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
