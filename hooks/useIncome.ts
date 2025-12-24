"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Income } from '@/types/database';

export function useIncome() {
    const [income, setIncome] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIncome = async (eventId?: string) => {
        try {
            setLoading(true);
            let query = supabase
                .from('income')
                .select(`
          *,
          events ( name ),
          payment_methods ( name )
        `)
                .order('date', { ascending: false });

            if (eventId && eventId !== 'all') {
                query = query.eq('event_id', eventId);
            }

            const { data, error } = await query;

            if (error) throw error;
            setIncome(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addIncome = async (entry: Omit<Income, 'id' | 'created_at'>) => {
        try {
            const { data, error } = await supabase
                .from('income')
                .insert([entry])
                .select(`
          *,
          events ( name ),
          payment_methods ( name )
        `);

            if (error) throw error;
            setIncome(prev => [data[0], ...prev]);
            return data[0];
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteIncome = async (id: string) => {
        try {
            const { error } = await supabase
                .from('income')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setIncome(prev => prev.filter(i => i.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchIncome();
    }, []);

    return { income, loading, error, addIncome, deleteIncome, fetchIncome };
}
