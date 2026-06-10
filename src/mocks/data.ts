import type { Booking, Transaction, Partner } from '../types';

export const mockPartner: Partner = {
  id: 'p1',
  name: 'Алексей Петров',
  washName: 'АвтоМойка Центр',
  phone: '+7 999 123 45 67',
  balance: 18450,
  nextPayoutDate: '2026-06-15',
  nextPayoutAmount: 12300,
};

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    date: '2026-06-10',
    time: '09:00',
    duration: 60,
    clientName: 'Иван Смирнов',
    clientPhone: '+7 900 100 20 30',
    car: { make: 'Toyota', model: 'Camry', color: 'Белый', plate: 'А123ВС77' },
    service: 'Комплексная мойка',
    price: 1200,
    status: 'done',
  },
  {
    id: 'b2',
    date: '2026-06-10',
    time: '10:30',
    duration: 45,
    clientName: 'Мария Петрова',
    clientPhone: '+7 900 200 30 40',
    car: { make: 'BMW', model: 'X5', color: 'Чёрный', plate: 'В456МН99' },
    service: 'Экспресс-мойка',
    price: 700,
    status: 'done',
  },
  {
    id: 'b3',
    date: '2026-06-10',
    time: '13:00',
    duration: 90,
    clientName: 'Денис Захаров',
    clientPhone: '+7 900 300 40 50',
    car: { make: 'Mercedes', model: 'GLE', color: 'Серый', plate: 'С789КО77' },
    service: 'Детейлинг + полировка',
    price: 3500,
    status: 'pending',
    notes: 'Клиент просил аккуратнее с зеркалами — есть царапина слева.',
  },
  {
    id: 'b4',
    date: '2026-06-10',
    time: '15:00',
    duration: 60,
    clientName: 'Ольга Фёдорова',
    clientPhone: '+7 900 400 50 60',
    car: { make: 'Kia', model: 'Sportage', color: 'Синий', plate: 'Е321РТ78' },
    service: 'Комплексная мойка',
    price: 1200,
    status: 'pending',
  },
  {
    id: 'b5',
    date: '2026-06-10',
    time: '16:30',
    duration: 45,
    clientName: 'Николай Воронов',
    clientPhone: '+7 900 500 60 70',
    car: { make: 'Hyundai', model: 'Tucson', color: 'Белый', plate: 'М654АВ50' },
    service: 'Экспресс-мойка',
    price: 700,
    status: 'pending',
  },
  {
    id: 'b6',
    date: '2026-06-11',
    time: '10:00',
    duration: 60,
    clientName: 'Светлана Козлова',
    clientPhone: '+7 900 600 70 80',
    car: { make: 'Audi', model: 'Q7', color: 'Бежевый', plate: 'Р987ЕН77' },
    service: 'Комплексная мойка',
    price: 1400,
    status: 'pending',
  },
];

// group demo — two bookings at the same time
export const mockGroupBookings: Booking[] = [
  {
    id: 'g1',
    date: '2026-06-10',
    time: '11:00',
    duration: 60,
    clientName: 'Алексей Козлов',
    clientPhone: '+7 900 700 80 90',
    car: { make: 'Lada', model: 'Vesta', color: 'Красный', plate: 'Т111УФ77' },
    service: 'Экспресс-мойка',
    price: 700,
    status: 'done',
  },
  {
    id: 'g2',
    date: '2026-06-10',
    time: '11:00',
    duration: 60,
    clientName: 'Сергей Волков',
    clientPhone: '+7 900 800 90 00',
    car: { make: 'Skoda', model: 'Octavia', color: 'Серый', plate: 'Х222ЦЧ99' },
    service: 'Комплексная мойка',
    price: 1200,
    status: 'done',
  },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-06-10', description: 'Запись #b3 · Детейлинг', amount: 3500, type: 'credit' },
  { id: 't2', date: '2026-06-10', description: 'Комиссия платформы', amount: -350, type: 'debit' },
  { id: 't3', date: '2026-06-09', description: 'Запись #b2 · Экспресс-мойка', amount: 700, type: 'credit' },
  { id: 't4', date: '2026-06-09', description: 'Запись #b1 · Комплексная мойка', amount: 1200, type: 'credit' },
  { id: 't5', date: '2026-06-09', description: 'Комиссия платформы', amount: -190, type: 'debit' },
  { id: 't6', date: '2026-06-08', description: 'Запись · Комплексная мойка', amount: 1400, type: 'credit' },
  { id: 't7', date: '2026-06-07', description: 'Выплата на карту', amount: -8000, type: 'debit' },
  { id: 't8', date: '2026-06-06', description: 'Запись · Полировка', amount: 2800, type: 'credit' },
];

// active booking for NowBlock — the "current" one
export const NOW_BOOKING_ID = 'b3';
