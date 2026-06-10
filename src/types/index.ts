export type BookingStatus = 'pending' | 'in_progress' | 'done' | 'cancelled';

export type NowBlockState = 'hidden' | 'waiting' | 'inslot' | 'late' | 'inwork' | 'group';

export interface Car {
  make: string;
  model: string;
  color: string;
  plate: string;
}

export interface Booking {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  duration: number;   // minutes
  clientName: string;
  clientPhone: string;
  car: Car;
  service: string;
  price: number;
  status: BookingStatus;
  notes?: string;
}

export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  postNumber: number;
  washName: string;
  phone: string;
  balance: number;
  nextPayoutDate: string;
  nextPayoutAmount: number;
}

export interface Payout {
  id: string;
  paidDate: string;
  periodLabel: string;
  amount: number;
}
