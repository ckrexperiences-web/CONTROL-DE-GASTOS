"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useMasterData(tableName: 'categories' | 'responsibles' | 'payment_methods') {
    const [items, setItems] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from(tableName)
                .select('id, name')
                .order('name');

            if (error) throw error;
            setItems(data || []);
        } catch (err: any) {
            setError(err.message || 'Error desconocido al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (name: string) => {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .insert([{ name }])
                .select();

            if (error) throw error;
            setItems(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
            return data[0];
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateItem = async (id: string, name: string) => {
        try {
            const { error } = await supabase
                .from(tableName)
                .update({ name })
                .eq('id', id);

            if (error) throw error;
            setItems(items.map(i => i.id === id ? { ...i, name } : i));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
            setItems(items.filter(i => i.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchItems();
    }, [tableName]);

    return { items, loading, error, addItem, updateItem, deleteItem, refresh: fetchItems };
}
