import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface MinimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const MinimalModal: React.FC<MinimalModalProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Simple Dialog Test</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p>This is a test dialog to debug the blank page issue.</p>
        </div>
        
        <DialogFooter>
          <Button onClick={onComplete}>
            Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MinimalModal; 