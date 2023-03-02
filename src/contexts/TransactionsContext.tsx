import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transactions {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
  }

interface CreateTransactionInput {
    description: string;
    price: number;
    category: string;
    type: 'income' | 'outcome';
  }

interface TransactionContextType {
    transactions: Transactions[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
  }

interface TransactionProviderProps {
    children: ReactNode;
}


export const TransactionContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionProviderProps) {
    const [ transactions , setTransactions ] = useState<Transactions[]>([])

    const fetchTransactions = useCallback(async (query?: string) => {
      const response = await api.get('/transactions', {
        params: {
          _sort: 'createdAt',
          _order: 'desc',
          q: query,
        }
      })

      setTransactions(response.data)
    }, [])

    const createTransaction = useCallback(async (data: CreateTransactionInput) => {
      const { description, price, category, type} = data;

      const response = await api.post('/transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
    })

    setTransactions(state => [ response.data, ...state  ])
  }, [])

    useEffect(() => {
      fetchTransactions()
    }, [])

    return (
        <TransactionContext.Provider value={{ 
          transactions, 
          fetchTransactions, 
          createTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}