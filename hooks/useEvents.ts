"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, EventStatus } from '@/types/database';

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addEvent = async (event: Omit<Event, 'id' | 'created_at'>) => {
        try {
            const { data, error } = await supabase
                .from('events')
                .insert([event])
                .select();

            if (error) throw error;
            setEvents([data[0], ...events]);
            return data[0];
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateEvent = async (id: string, updates: Partial<Event>) => {
        try {
            const { error } = await supabase
                .from('events')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setEvents(events.filter(e => e.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return { events, loading, error, addEvent, updateEvent, deleteEvent, refresh: fetchEvents };
}
