export interface DebtEntry {
  id: string;
  creditor: string; // Who is owed (or who owes)
  amount: number;
  description: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ChangeType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface HistoryLog {
  id: string;
  debtId: string;
  changeType: ChangeType;
  timestamp: string;
  user: string; // Hardcoded to 'CurrentUser' for now
  details: string; // e.g., "Changed amount from 100 to 200"
}
