
export interface Call {
  id: string;
  date: string;
  agent: string;
  customer: string;
  duration: string;
  qaScore: number;
  status: 'reviewed' | 'pending' | 'flagged';
  tags: string[];
  transcript?: string;
  aiAnalysis?: string;
}

export interface PromptContext {
  id: string;
  prompt: string;
  notes: string;
  dateAdded: string;
  status: 'active' | 'archived';
}

export interface TrainingData {
  id: string;
  callReference: string;
  correctDisposition: string;
  notes: string;
  dateAdded: string;
}
