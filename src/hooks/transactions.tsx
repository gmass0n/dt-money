import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

export type TransactionType = "withdraw" | "deposit";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  formattedAmount?: string;
  category: string;
  type: TransactionType;
  createdAt: string;
  formattedCreatedAt?: string;
}

export interface CreateTransactionData {
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
}

interface ITransactionsContextData {
  transactions: Transaction[];
  createTransaction(data: CreateTransactionData): Promise<void>;
}

const TransactionsContext = createContext({} as ITransactionsContextData);

const TransactionsProvider: React.FC = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const formatTransaction = (transaction: Transaction) => {
    const formattedAmount = formatCurrency(transaction.amount);

    const formattedCreatedAt = new Intl.DateTimeFormat("pt-BR").format(
      new Date(transaction.amount)
    );

    return {
      ...transaction,
      formattedAmount,
      formattedCreatedAt,
    };
  };

  useEffect(() => {
    (async () => {
      const response = await api.get("/transactions");

      if (response.data && response.data.transactions) {
        const formattedTransactions = response.data.transactions.map(
          (transaction: Transaction) => formatTransaction(transaction)
        );

        setTransactions(formattedTransactions);
      }
    })();
  }, []);

  const createTransaction = useCallback(async (data: CreateTransactionData) => {
    const response = await api.post("/transactions", {
      ...data,
      createdAt: new Date(),
    });

    const { transaction } = response.data;

    if (transaction) {
      const formattedTransaction = formatTransaction(transaction);

      setTransactions((prevState) => [...prevState, formattedTransaction]);
    }
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

const useTransactions = (): ITransactionsContextData => {
  return useContext(TransactionsContext);
};

export { TransactionsProvider, useTransactions };
