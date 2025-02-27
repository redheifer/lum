
import React, { useState } from 'react';
import { PromptContext } from '@/lib/types';
import { mockPromptContexts } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, PlusCircle, Archive } from "lucide-react";
import { toast } from "sonner";

const PromptEvolution: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptContext[]>(mockPromptContexts);
  const [newPrompt, setNewPrompt] = useState<Partial<PromptContext>>({
    prompt: '',
    notes: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPrompt = () => {
    if (!newPrompt.prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    const promptToAdd: PromptContext = {
      id: `${Date.now()}`,
      prompt: newPrompt.prompt,
      notes: newPrompt.notes || '',
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setPrompts([promptToAdd, ...prompts]);
    setNewPrompt({ prompt: '', notes: '' });
    setIsAdding(false);
    toast.success("Prompt context added successfully");
  };

  const toggleStatus = (id: string) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === id 
        ? { ...prompt, status: prompt.status === 'active' ? 'archived' : 'active' } 
        : prompt
    ));
    toast.info("Prompt status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Prompt Evolution</h2>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Context
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Prompt Context</CardTitle>
            <CardDescription>
              Provide additional context to improve AI prompt understanding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-prompt">Prompt Instructions</Label>
              <Textarea 
                id="new-prompt"
                placeholder="Enter specific instructions for the AI..."
                value={newPrompt.prompt}
                onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-notes">Additional Notes</Label>
              <Textarea 
                id="new-notes"
                placeholder="Add any additional context or examples..."
                value={newPrompt.notes}
                onChange={(e) => setNewPrompt({ ...newPrompt, notes: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleAddPrompt}>Save Context</Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {prompts.map(prompt => (
          <Card key={prompt.id} className={`transition-all ${prompt.status === 'archived' ? 'opacity-70' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base font-medium">{prompt.prompt}</CardTitle>
                <Badge variant={prompt.status === 'active' ? "default" : "outline"}>
                  {prompt.status}
                </Badge>
              </div>
              <CardDescription>Added on {prompt.dateAdded}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{prompt.notes}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-auto"
                onClick={() => toggleStatus(prompt.id)}
              >
                {prompt.status === 'active' ? (
                  <>
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Activate
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromptEvolution;
