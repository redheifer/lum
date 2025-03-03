
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
      <div className="bg-slate-50 p-6 rounded-full mb-6">
        <FileSearch className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
