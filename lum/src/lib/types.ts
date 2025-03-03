
export interface Campaign {
  id: string;
  name: string;
  platform: string;
  publisher: string;
  target: string;
  createdAt: string;
  status: 'active' | 'paused' | 'completed';
}

export interface Call {
  id: string;
  inboundCallId: string;
  campaignId: string;
  campaignName?: string;
  platform: string;
  callDate: string;
  callerId: string;
  endCallSource: string;
  publisher: string;
  target: string;
  duration: string;
  revenue: number;
  payout: number;
  recording?: string;
  transcript?: string;
  rating?: number;
  description?: string;
  disposition?: string;
  createdAt: string;
  // Fields needed by CallReviewCard
  status?: string;
  customer?: string;
  agent?: string;
  tags?: string[];
  date?: string;
  qaScore?: number;
  aiAnalysis?: string;
}

export interface OnboardingState {
  id?: string;
  isComplete: boolean;
  currentStep: number;
  businessData?: {
    companyName: string;
    industry: string;
    goals: string;
  };
}

// Add additional types needed by unused components
export interface TrainingData {
  id: string;
  callReference: string;
  correctDisposition: string;
  notes?: string;
  dateAdded: string;
}

export interface PromptContext {
  id: string;
  prompt: string;
  notes?: string;
  dateAdded: string;
  status: 'active' | 'archived';
}

export type ThemeMode = 'light' | 'dark';
