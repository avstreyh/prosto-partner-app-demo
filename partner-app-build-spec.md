# ПроСТО Partner App — Build Spec

## Цель

Мобильное приложение партнера для автомоек. MVP без подключения к бэкенду, с моковыми данными.

---

## Стек

| Технология | Версия |
|---|---|
| React Native | latest stable |
| Expo | SDK 51+ |
| TypeScript | 5.x |
| React Navigation | v6 |
| Expo Router | или React Navigation — на выбор |

---

## Экраны

### 1. Splash
- Логотип приложения по центру
- Автоматический переход на Login через 2 сек
- Без взаимодействия пользователя

### 2. Login
**Поля:**
- Телефон или email (text input)
- Пароль (password input)

**Действия:**
- Кнопка «Войти» — переход на Schedule
- Валидация: поля не должны быть пустыми

**Состояния:**
- `idle` — начальное
- `loading` — во время «запроса»
- `error` — неверные данные (мок: показать ошибку при любых данных кроме тестовых)

**Моковые credentials:** `partner@prosto.ru` / `12345`

---

### 3. Schedule (Журнал записей)
**Навигация:** Tab — корневой экран

**Контент:**
- Горизонтальный выбор даты (7 дней вперёд/назад от сегодня)
- Список записей на выбранную дату
- Каждая карточка в списке: время, марка/модель авто, услуга, статус, имя клиента

**Состояния списка:**
- `loading` — скелетон
- `empty` — «Записей на этот день нет»
- `filled` — список карточек

**Действие:** тап на карточку → Booking Details

---

### 4. Booking Details (Карточка записи)
**Открывается:** push поверх Schedule

**Контент:**
- Время и дата
- Имя и телефон клиента
- Марка, модель, цвет, гос. номер авто
- Услуга и цена
- Статус записи
- Заметки (если есть)

**Статусы:**
- `pending` — Ожидает
- `in_progress` — В работе
- `done` — Завершено
- `cancelled` — Отменено

**Действия:**
- Кнопка смены статуса (контекстная: pending → in_progress → done)
- Кнопка «Отсканировать QR» — открывает QR Scanner модально

---

### 5. QR Scanner
**Открывается:** модально (поверх любого экрана)

**Контент:**
- Fullscreen камера с рамкой сканирования
- Кнопка «Закрыть»

**Логика (мок):**
- После 2 сек «сканирования» — показать успешный результат
- Результат: номер записи и имя клиента
- Кнопка «Перейти к записи»

**Разрешения:** запрос доступа к камере через Expo Camera

---

### 6. Payments (Взаиморасчеты)
**Навигация:** отдельный экран, доступный из Profile или боковое меню (на усмотрение)

**Контент:**
- Баланс партнера (большой текст сверху)
- Список транзакций: дата, описание, сумма (+/-)
- Фильтр: Все / Начисления / Списания

**Состояния:**
- `loading`
- `empty`
- `filled`

---

### 7. Profile (Профиль)
**Навигация:** Tab — второй корневой экран

**Контент:**
- Аватар (заглушка-инициалы)
- Имя партнера и название мойки
- Контактный телефон
- Ссылка на Payments
- Кнопка «Выйти» — возврат на Login + сброс состояния

---

## Навигация

Tab bar отсутствует. JournalScreen — единственный root-экран после авторизации.

```
RootNavigator
├── AuthStack
│   ├── SplashScreen
│   ├── PermissionsScreen
│   ├── AuthPhoneScreen
│   └── AuthCodeScreen
│
└── MainStack
    ├── JournalScreen                  ← root после логина
    ├── AppointmentCardScreen          ← push из JournalScreen
    ├── ProfileScreen                  ← push через аватар в header журнала
    ├── SettlementsScreen              ← push из ProfileScreen
    └── ScannerScreen                  ← fullscreen modal из NowBlock / FAB / AppointmentCardScreen
          └── ScanResultSheet          ← bottom sheet поверх ScannerScreen

Поверх JournalScreen:
└── SearchBottomSheet                  ← bottom sheet, не отдельный экран
```

---

## Моковые данные

Создать файл `src/mocks/data.ts` со следующими структурами:

```ts
// Партнер
const mockPartner = {
  id: '1',
  name: 'Алексей Петров',
  washName: 'АвтоМойка Центр',
  phone: '+7 999 123 45 67',
  balance: 18450,
}

// Записи
const mockBookings: Booking[] = [
  {
    id: 'b1',
    date: '2026-06-10',
    time: '10:00',
    clientName: 'Иван Смирнов',
    clientPhone: '+7 900 000 00 01',
    car: { make: 'Toyota', model: 'Camry', color: 'Белый', plate: 'А123ВС77' },
    service: 'Комплексная мойка',
    price: 1200,
    status: 'pending',
    notes: '',
  },
  // ... ещё 4-5 записей на разные дни и статусы
]

// Транзакции
const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-06-09', description: 'Запись #b0', amount: 1200, type: 'credit' },
  { id: 't2', date: '2026-06-08', description: 'Комиссия платформы', amount: -120, type: 'debit' },
  // ...
]
```

---

## Типы (src/types/index.ts)

```ts
type BookingStatus = 'pending' | 'in_progress' | 'done' | 'cancelled'

interface Booking {
  id: string
  date: string        // YYYY-MM-DD
  time: string        // HH:mm
  clientName: string
  clientPhone: string
  car: {
    make: string
    model: string
    color: string
    plate: string
  }
  service: string
  price: number
  status: BookingStatus
  notes?: string
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number      // отрицательный = списание
  type: 'credit' | 'debit'
}

interface Partner {
  id: string
  name: string
  washName: string
  phone: string
  balance: number
}
```

---

## Состояние приложения

Глобальный стейт через React Context или Zustand (на выбор):

- `auth`: `{ isAuthenticated: boolean, partner: Partner | null }`
- `bookings`: `{ items: Booking[], selectedDate: string, loading: boolean }`
- `payments`: `{ transactions: Transaction[], balance: number, loading: boolean }`

Смена статуса записи — мутирует локальный стейт (без персистентности).

---

## Структура проекта

```
src/
├── components/       # переиспользуемые компоненты
│   ├── BookingCard/
│   ├── DatePicker/
│   ├── StatusBadge/
│   └── ...
├── screens/
│   ├── SplashScreen/
│   ├── LoginScreen/
│   ├── ScheduleScreen/
│   ├── BookingDetailsScreen/
│   ├── QRScannerScreen/
│   ├── PaymentsScreen/
│   └── ProfileScreen/
├── navigation/
│   └── RootNavigator.tsx
├── store/            # Context или Zustand
├── mocks/
│   └── data.ts
├── types/
│   └── index.ts
└── constants/
    └── colors.ts     # палитра
```

---

## Definition of Done

- [ ] Все 7 экранов сверстаны
- [ ] Навигация работает (табы, push, модал)
- [ ] Состояния: loading / empty / filled / error на каждом экране где применимо
- [ ] Моковые данные подключены через стейт
- [ ] Смена статуса записи работает локально
- [ ] QR Scanner открывается модально, возвращает мок-результат
- [ ] Login валидирует поля, принимает тестовые credentials
- [ ] Logout сбрасывает стейт и возвращает на Login
- [ ] Приложение запускается через `expo start`
- [ ] Работает на iOS Simulator и Android Emulator без критических ошибок
- [ ] Нет TypeScript ошибок (`tsc --noEmit` проходит)
