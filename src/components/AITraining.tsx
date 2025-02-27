
import React, { useState } from 'react';
import { TrainingData } from '@/lib/types';
import { mockTrainingData } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AITraining: React.FC = () => {
  const [trainingData, setTrainingData] = useState<TrainingData[]>(mockTrainingData);
  const [newTraining, setNewTraining] = useState<Partial<TrainingData>>({
    callReference: '',
    correctDisposition: '',
    notes: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTraining = () => {
    if (!newTraining.callReference || !newTraining.correctDisposition) {
      toast.error("Please fill in all required fields");
      return;
    }

    const trainingToAdd: TrainingData = {
      id: `${Date.now()}`,
      callReference: newTraining.callReference,
      correctDisposition: newTraining.correctDisposition,
      notes: newTraining.notes || '',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setTrainingData([trainingToAdd, ...trainingData]);
    setNewTraining({ callReference: '', correctDisposition: '', notes: '' });
    setIsAdding(false);
    toast.success("Training data added successfully");
  };

  const handleDelete = (id: string) => {
    setTrainingData(trainingData.filter(item => item.id !== id));
    toast.info("Training data removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">AI Training</h2>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Training Data
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Training Data</CardTitle>
            <CardDescription>
              Provide correct dispositions to improve AI accuracy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="call-reference">Call Reference ID *</Label>
                <Input 
                  id="call-reference"
                  placeholder="e.g., call_20230510_123"
                  value={newTraining.callReference}
                  onChange={(e) => setNewTraining({ ...newTraining, callReference: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disposition">Correct Disposition *</Label>
                <Input 
                  id="disposition"
                  placeholder="e.g., Technical Issue - Resolved"
                  value={newTraining.correctDisposition}
                  onChange={(e) => setNewTraining({ ...newTraining, correctDisposition: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="training-notes">Additional Notes</Label>
              <Textarea 
                id="training-notes"
                placeholder="Explain why this disposition is correct or provide context..."
                value={newTraining.notes}
                onChange={(e) => setNewTraining({ ...newTraining, notes: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleAddTraining}>Save Training Data</Button>
          </CardFooter>
        </Card>
      )}

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-4 pr-4">
          {trainingData.map(item => (
            <Card key={item.id} className="transition-all hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {item.callReference}
                    </CardTitle>
                    <CardDescription>Added on {item.dateAdded}</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Correct Disposition:</h4>
                    <p className="text-sm">{item.correctDisposition}</p>
                  </div>
                  {item.notes && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Notes:</h4>
                      <p className="text-sm text-slate-600">{item.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AITraining;
