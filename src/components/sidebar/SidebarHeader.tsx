
import React from 'react';
import { Lightbulb } from 'lucide-react';

const SidebarHeader: React.FC = () => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary rotate-12" strokeWidth={2.5} />
        <h2 className="font-semibold text-lg">Lum</h2>
      </div>
      <p className="text-sm text-slate-500">AI-powered call quality analysis</p>
    </div>
  );
};

export default SidebarHeader;
