import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Pin, 
  Archive, 
  Lock, 
  Trash2, 
  Edit2,
  Unlock,
  PinOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { OfflineNote } from '@/lib/offlineStorage';
import { verifyPin } from '@/lib/offlineStorage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: OfflineNote;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onLock: (pin: string) => void;
  onUnlock: () => void;
}

export function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  onTogglePin, 
  onToggleArchive,
  onLock,
  onUnlock 
}: NoteCardProps) {
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [unlockPin, setUnlockPin] = useState('');
  const [unlockError, setUnlockError] = useState(false);
  const [pinMismatch, setPinMismatch] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleLock = () => {
    if (pin.length >= 4 && pin === confirmPin) {
      onLock(pin);
      setPin('');
      setConfirmPin('');
      setShowLockDialog(false);
      setPinMismatch(false);
    } else if (pin !== confirmPin) {
      setPinMismatch(true);
    }
  };

  const handleUnlock = async () => {
    if (!note.lockPinHash) return;
    
    setVerifying(true);
    try {
      const isValid = await verifyPin(unlockPin, note.lockPinHash);
      if (isValid) {
        onUnlock();
        setUnlockPin('');
        setShowUnlockDialog(false);
        setUnlockError(false);
      } else {
        setUnlockError(true);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleCardClick = () => {
    if (note.isLocked) {
      setShowUnlockDialog(true);
    } else {
      onEdit();
    }
  };

  // Strip HTML for preview
  const previewContent = note.content.replace(/<[^>]*>/g, '').slice(0, 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all duration-200 hover:shadow-md relative group",
            note.isPinned && "ring-2 ring-primary/20"
          )}
          onClick={handleCardClick}
          data-testid={`card-note-${note.id}`}
        >
          {/* Pinned indicator */}
          {note.isPinned && (
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Pin className="h-3 w-3" />
            </div>
          )}

          {/* Lock overlay */}
          {note.isLocked && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Tap to unlock</p>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
              {note.title || 'Untitled'}
            </h3>
            <div className="flex items-center gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(
                  "h-8 w-8 transition-opacity",
                  note.isPinned ? "text-primary" : "sm:opacity-0 sm:group-hover:opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin();
                }}
                data-testid={`button-pin-${note.id}`}
              >
                {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    data-testid={`button-note-menu-${note.id}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {!note.isLocked && (
                  <DropdownMenuItem onClick={onEdit} data-testid="menu-edit-note">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onTogglePin} data-testid="menu-pin-note">
                  {note.isPinned ? (
                    <>
                      <PinOff className="h-4 w-4 mr-2" />
                      Unpin
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleArchive} data-testid="menu-archive-note">
                  <Archive className="h-4 w-4 mr-2" />
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => note.isLocked ? setShowUnlockDialog(true) : setShowLockDialog(true)}
                  data-testid="menu-lock-note"
                >
                  {note.isLocked ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDelete} 
                  className="text-destructive"
                  data-testid="menu-delete-note"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {!note.isLocked && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {previewContent || 'No content'}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {new Date(note.updatedAt).toLocaleDateString()}
            </span>
            {note.labels.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {note.labels.slice(0, 2).map(label => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {note.labels.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{note.labels.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Lock Dialog */}
      <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lock Note</DialogTitle>
            <DialogDescription>
              Enter a 4-digit PIN to protect this note. You'll need this PIN to view or edit the note.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter PIN (min 4 digits)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setPinMismatch(false);
                }}
                maxLength={6}
                data-testid="input-lock-pin"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => {
                  setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setPinMismatch(false);
                }}
                maxLength={6}
                className={pinMismatch ? 'border-destructive' : ''}
                data-testid="input-confirm-pin"
              />
              {pinMismatch && (
                <p className="text-sm text-destructive mt-2">PINs don't match</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLockDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleLock} 
              disabled={pin.length < 4 || confirmPin.length < 4} 
              data-testid="button-confirm-lock"
            >
              Lock Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlock Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Note</DialogTitle>
            <DialogDescription>
              Enter your PIN to unlock this note.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={unlockPin}
              onChange={(e) => {
                setUnlockPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                setUnlockError(false);
              }}
              maxLength={6}
              className={unlockError ? 'border-destructive' : ''}
              data-testid="input-unlock-pin"
            />
            {unlockError && (
              <p className="text-sm text-destructive mt-2">Incorrect PIN</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnlockDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUnlock} 
              disabled={unlockPin.length < 4 || verifying} 
              data-testid="button-confirm-unlock"
            >
              {verifying ? 'Verifying...' : 'Unlock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
