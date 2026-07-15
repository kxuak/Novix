import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { TransactionFormData, TransactionType } from "../components/TransactionForm";
import type { NewGoalData } from "../components/GoalForm";

/* =========================================================================
   TIPOS
   ========================================================================= */

export interface Transaction {
  id: number;
  description: string;
  value: string;
  category: string;
  type: TransactionType;
  date: string; // yyyy-mm-dd
}

export interface Goal {
  id: number;
  title: string;
  percentage: number;
  currentValue: string;
  targetValue: string;
  icon: string;
  color: string;
}

export interface FinancialEvent {
  id: number;
  title: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  color: string;
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  color: string;
}

interface DataContextValue {
  // Transações
  transactions: Transaction[];
  addTransaction: (data: TransactionFormData) => void;
  updateTransaction: (id: number, data: TransactionFormData) => void;
  deleteTransaction: (id: number) => void;

  // Metas
  goals: Goal[];
  addGoal: (data: NewGoalData) => void;
  updateGoal: (id: number, data: NewGoalData) => void;
  deleteGoal: (id: number) => void;

  // Agenda / calendário financeiro
  events: FinancialEvent[];
  addEvent: (data: EventFormData) => void;
  deleteEvent: (id: number) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

/* =========================================================================
   PERSISTÊNCIA (hoje: localStorage / amanhã: troca por chamadas de API)
   ========================================================================= */

const STORAGE_KEYS = {
  transactions: "novix:transactions",
  goals: "novix:goals",
  events: "novix:events",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage indisponível (modo privado, etc) — segue sem persistir
  }
}

const calculateGoalPercentage = (current: string, target: string) => {
  const t = Number(target);
  const c = Number(current);
  return t > 0 ? Math.min(100, Math.round((c / t) * 100)) : 0;
};

/* =========================================================================
   PROVIDER
   ========================================================================= */

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage(STORAGE_KEYS.transactions, [])
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadFromStorage(STORAGE_KEYS.goals, [])
  );
  const [events, setEvents] = useState<FinancialEvent[]>(() =>
    loadFromStorage(STORAGE_KEYS.events, [])
  );

  // Sempre que os dados mudam, salva. (No dia do backend, isso vira o
  // ponto único onde entra o "sincronizar com o servidor".)
  useEffect(() => saveToStorage(STORAGE_KEYS.transactions, transactions), [transactions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.goals, goals), [goals]);
  useEffect(() => saveToStorage(STORAGE_KEYS.events, events), [events]);

  /* ---------- Transações ---------- */

  const addTransaction = (data: TransactionFormData) => {
    setTransactions((prev) => [...prev, { id: Date.now(), ...data }]);
  };

  const updateTransaction = (id: number, data: TransactionFormData) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  /* ---------- Metas ---------- */

  const addGoal = (data: NewGoalData) => {
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: data.title,
        percentage: calculateGoalPercentage(data.currentValue, data.targetValue),
        currentValue: data.currentValue,
        targetValue: data.targetValue,
        icon: data.icon,
        color: data.color,
      },
    ]);
  };

  const updateGoal = (id: number, data: NewGoalData) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              title: data.title,
              currentValue: data.currentValue,
              targetValue: data.targetValue,
              icon: data.icon,
              color: data.color,
              percentage: calculateGoalPercentage(data.currentValue, data.targetValue),
            }
          : g
      )
    );
  };

  const deleteGoal = (id: number) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  /* ---------- Agenda / eventos financeiros ---------- */

  const addEvent = (data: EventFormData) => {
    setEvents((prev) => [...prev, { id: Date.now(), ...data }]);
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        events,
        addEvent,
        deleteEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData deve ser usado dentro de <DataProvider>");
  return ctx;
};