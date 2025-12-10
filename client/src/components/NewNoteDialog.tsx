import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "./RichTextEditor";
import { X, Plus, Tag } from "lucide-react";
import type { OfflineNote } from "@/lib/offlineStorage";

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (note: Partial<OfflineNote>) => void;
  editNote?: OfflineNote | null;
}

export function NewNoteDialog({ open, onOpenChange, onSave, editNote }: NewNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [showLabelInput, setShowLabelInput] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setLabels(editNote.labels || []);
    } else {
      setTitle("");
      setContent("");
      setLabels([]);
    }
  }, [editNote, open]);

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({ 
        title, 
        content,
        labels,
      });
      setTitle("");
      setContent("");
      setLabels([]);
      setNewLabel("");
      setShowLabelInput(false);
      onOpenChange(false);
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel("");
      setShowLabelInput(false);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(l => l !== labelToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
          <DialogDescription className="sr-only">
            {editNote ? 'Edit your note content and labels' : 'Create a new note with title, content and labels'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-note-title"
            />
          </div>
          <div className="grid gap-2">
            <Label>Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your thoughts..."
            />
          </div>

          {/* Labels */}
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Labels
            </Label>
            <div className="flex flex-wrap gap-2 items-center">
              {labels.map(label => (
                <Badge key={label} variant="secondary" className="gap-1">
                  {label}
                  <button
                    onClick={() => removeLabel(label)}
                    className="ml-1 hover:text-destructive"
                    data-testid={`button-remove-label-${label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {showLabelInput ? (
                <div className="flex gap-1">
                  <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Label name"
                    className="h-7 w-24 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && addLabel()}
                    autoFocus
                    data-testid="input-new-label"
                  />
                  <Button size="sm" variant="ghost" onClick={addLabel} data-testid="button-add-label">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowLabelInput(true)}
                  data-testid="button-show-label-input"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Label
                </Button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-note">
            {editNote ? 'Update' : 'Save'} Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
