"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense } from '@/types/database';

export function useExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = async (eventId?: string) => {
        try {
            setLoading(true);
            let query = supabase
                .from('expenses')
                .select(`
          *,
          events ( name ),
          categories ( name ),
          responsibles ( name )
        `)
                .order('date', { ascending: false });

            if (eventId && eventId !== 'all') {
                query = query.eq('event_id', eventId);
            }

            const { data, error } = await query;

            if (error) throw error;
            setExpenses(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
        try {
            const { data, error } = await supabase
                .from('expenses')
                .insert([expense])
                .select(`
          *,
          events ( name ),
          categories ( name ),
          responsibles ( name )
        `);

            if (error) throw error;
            setExpenses(prev => [data[0], ...prev]);
            return data[0];
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateExpense = async (id: string, updates: Partial<Expense>) => {
        try {
            const { error } = await supabase
                .from('expenses')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            fetchExpenses(); // Refresh to get joined data
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return { expenses, loading, error, addExpense, updateExpense, deleteExpense, fetchExpenses };
}
