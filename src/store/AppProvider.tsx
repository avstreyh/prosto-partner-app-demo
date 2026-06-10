import React, { createContext, useContext, useReducer } from 'react';
import type { Booking, Transaction, Partner } from '../types';
import {
  mockBookings,
  mockGroupBookings,
  mockTransactions,
  mockPartner,
  NOW_BOOKING_ID,
} from '../mocks/data';

// --- Auth ---

interface AuthState {
  isAuthenticated: boolean;
  partner: Partner | null;
}

type AuthAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, partner: mockPartner };
    case 'LOGOUT':
      return { isAuthenticated: false, partner: null };
    default:
      return state;
  }
}

// --- Journal ---

interface JournalState {
  bookings: Booking[];
  selectedDate: string;
  nowBookingId: string | null;
}

type JournalAction =
  | { type: 'SET_DATE'; date: string }
  | { type: 'SET_STATUS'; bookingId: string; status: Booking['status'] }
  | { type: 'SET_NOW_BOOKING'; bookingId: string | null };

function journalReducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, selectedDate: action.date };
    case 'SET_STATUS':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId ? { ...b, status: action.status } : b
        ),
      };
    case 'SET_NOW_BOOKING':
      return { ...state, nowBookingId: action.bookingId };
    default:
      return state;
  }
}

// --- Contexts ---

interface AppContextValue {
  auth: AuthState;
  login: () => void;
  logout: () => void;

  journal: JournalState;
  setDate: (date: string) => void;
  setBookingStatus: (bookingId: string, status: Booking['status']) => void;

  transactions: Transaction[];
}

const AppContext = createContext<AppContextValue | null>(null);

const TODAY = new Date().toISOString().split('T')[0];
const allBookings = [...mockBookings, ...mockGroupBookings];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [auth, authDispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    partner: null,
  });

  const [journal, journalDispatch] = useReducer(journalReducer, {
    bookings: allBookings,
    selectedDate: TODAY,
    nowBookingId: NOW_BOOKING_ID,
  });

  const login = () => authDispatch({ type: 'LOGIN' });
  const logout = () => authDispatch({ type: 'LOGOUT' });
  const setDate = (date: string) => journalDispatch({ type: 'SET_DATE', date });
  const setBookingStatus = (bookingId: string, status: Booking['status']) =>
    journalDispatch({ type: 'SET_STATUS', bookingId, status });

  return (
    <AppContext.Provider
      value={{
        auth,
        login,
        logout,
        journal,
        setDate,
        setBookingStatus,
        transactions: mockTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
