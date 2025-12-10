import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: { 
    title: string; 
    frequency: "Daily" | "Weekly" | "Monthly";
    date?: string;
    time?: string;
    notificationTime?: string;
  }) => void;
}

export function NewTaskDialog({ open, onOpenChange, onSave }: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");

  const handleSave = () => {
    if (title.trim()) {
      onSave({ 
        title, 
        frequency,
        date: date || undefined,
        time: time || undefined,
        notificationTime: enableNotification ? notificationTime : undefined
      });
      
      // Reset form
      setTitle("");
      setFrequency("Daily");
      setDate("");
      setTime("");
      setEnableNotification(false);
      setNotificationTime("");
      
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Recurring Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Task Name</Label>
            <Input
              id="task-title"
              placeholder="e.g. Morning Meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
               <Label htmlFor="date">Start Date</Label>
               <Input 
                 id="date" 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
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
            />
          </div>

          {enableNotification && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
               <Label htmlFor="notification-time">Notification Time</Label>
               <Input 
                 id="notification-time" 
                 type="time" 
                 value={notificationTime}
                 onChange={(e) => setNotificationTime(e.target.value)}
               />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}