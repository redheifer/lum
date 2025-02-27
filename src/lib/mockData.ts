
import { Call, PromptContext, TrainingData } from './types';

export const mockCalls: Call[] = [
  {
    id: '1',
    date: '2023-05-15',
    agent: 'Sarah Johnson',
    customer: 'John Smith',
    duration: '12:34',
    qaScore: 92,
    status: 'reviewed',
    tags: ['complaint', 'resolved', 'positive'],
    transcript: 'Agent: Thank you for calling customer service. How may I help you today?\nCustomer: I have an issue with my recent order...',
    aiAnalysis: 'The agent demonstrated excellent listening skills and resolved the customer\'s complaint efficiently. Proper protocols were followed and the customer expressed satisfaction with the resolution.'
  },
  {
    id: '2',
    date: '2023-05-14',
    agent: 'Michael Chen',
    customer: 'Emily Davis',
    duration: '8:42',
    qaScore: 78,
    status: 'flagged',
    tags: ['technical issue', 'escalated', 'neutral'],
    transcript: 'Agent: Thank you for calling tech support. How can I assist you?\nCustomer: My software keeps crashing whenever I try to...',
    aiAnalysis: 'The agent could have provided more clear explanations. While they attempted troubleshooting, they missed some key diagnostic steps and should have offered more detailed guidance.'
  },
  {
    id: '3',
    date: '2023-05-14',
    agent: 'Robert Wilson',
    customer: 'Lisa Thompson',
    duration: '5:18',
    qaScore: 95,
    status: 'reviewed',
    tags: ['inquiry', 'resolved', 'positive'],
    transcript: 'Agent: Thank you for calling our product information line. How may I help?\nCustomer: I\'m wondering about the features of your newest model...',
    aiAnalysis: 'Excellent product knowledge demonstrated. The agent provided comprehensive information and asked appropriate follow-up questions to ensure the customer\'s needs were met.'
  },
  {
    id: '4',
    date: '2023-05-13',
    agent: 'Jessica Martinez',
    customer: 'David Brown',
    duration: '15:27',
    qaScore: 65,
    status: 'flagged',
    tags: ['complaint', 'unresolved', 'negative'],
    transcript: 'Agent: Thank you for calling. How can I help today?\nCustomer: I\'ve been trying to get a refund for weeks now and nobody has helped me...',
    aiAnalysis: 'The agent failed to properly acknowledge the customer\'s frustration and didn\'t follow the refund protocol. Better empathy and process adherence needed.'
  },
  {
    id: '5',
    date: '2023-05-13',
    agent: 'Thomas Anderson',
    customer: 'Jennifer Wilson',
    duration: '9:53',
    qaScore: 88,
    status: 'reviewed',
    tags: ['sales', 'completed', 'positive'],
    transcript: 'Agent: Thanks for calling our sales line. How may I assist you?\nCustomer: I\'m interested in upgrading my current plan...',
    aiAnalysis: 'Good sales technique with effective needs assessment. The agent could have better explained the pricing structure but overall handled the call well.'
  },
  {
    id: '6',
    date: '2023-05-12',
    agent: 'Amanda Lewis',
    customer: 'Richard Taylor',
    duration: '6:45',
    qaScore: 82,
    status: 'reviewed',
    tags: ['technical issue', 'resolved', 'neutral'],
    transcript: 'Agent: Welcome to technical support. How can I help you today?\nCustomer: I can\'t seem to connect my device to the internet...',
    aiAnalysis: 'The agent provided correct troubleshooting steps and resolved the issue. More patience could have been shown when explaining complex steps.'
  }
];

export const mockPromptContexts: PromptContext[] = [
  {
    id: '1',
    prompt: 'Analyze call for compliance with greeting protocol and resolution steps',
    notes: 'Need to improve detection of proper greeting and closing statements',
    dateAdded: '2023-04-20',
    status: 'active'
  },
  {
    id: '2',
    prompt: 'Evaluate agent empathy, tone, and customer satisfaction indicators',
    notes: 'Currently missing subtle tone indicators, especially in high-stress situations',
    dateAdded: '2023-04-25',
    status: 'active'
  },
  {
    id: '3',
    prompt: 'Check for proper disclosure statements in financial product discussions',
    notes: 'Need to add more examples of compliant disclosure phrasing',
    dateAdded: '2023-05-01',
    status: 'archived'
  }
];

export const mockTrainingData: TrainingData[] = [
  {
    id: '1',
    callReference: 'call_20230508_142',
    correctDisposition: 'Complaint Resolved - Full Satisfaction',
    notes: 'Agent correctly identified the root cause and provided appropriate compensation',
    dateAdded: '2023-05-10'
  },
  {
    id: '2',
    callReference: 'call_20230507_098',
    correctDisposition: 'Technical Support - Not Resolved',
    notes: 'Issue required escalation to tier 2 support, which was missed by the AI analysis',
    dateAdded: '2023-05-11'
  },
  {
    id: '3',
    callReference: 'call_20230505_215',
    correctDisposition: 'Product Information - Converted to Sale',
    notes: 'AI missed the conversion aspect of this informational call',
    dateAdded: '2023-05-12'
  }
];
