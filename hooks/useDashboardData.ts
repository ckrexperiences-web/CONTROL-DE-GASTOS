"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense, Income } from '@/types/database';

export function useDashboardData(eventId: string = 'all') {
    const [stats, setStats] = useState({
        totalExpenses: 0,
        totalIncome: 0,
        profit: 0,
        expensesByCategory: [] as { name: string; value: number }[],
        incomeVsExpenses: [] as { name: string; income: number; expenses: number }[],
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch Expenses
            let expQuery = supabase.from('expenses').select('*, categories(name)');
            if (eventId !== 'all') expQuery = expQuery.eq('event_id', eventId);
            const { data: expenses } = await expQuery;

            // Fetch Income
            let incQuery = supabase.from('income').select('*');
            if (eventId !== 'all') incQuery = incQuery.eq('event_id', eventId);
            const { data: income } = await incQuery;

            // Aggregate
            const totalExp = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
            const totalInc = income?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

            // By Category
            const byCat: Record<string, number> = {};
            expenses?.forEach(exp => {
                const catName = exp.categories?.name || 'Uncategorized';
                byCat[catName] = (byCat[catName] || 0) + Number(exp.amount);
            });

            setStats({
                totalExpenses: totalExp,
                totalIncome: totalInc,
                profit: totalInc - totalExp,
                expensesByCategory: Object.entries(byCat).map(([name, value]) => ({ name, value })),
                incomeVsExpenses: [
                    { name: 'Total', income: totalInc, expenses: totalExp }
                ]
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [eventId]);

    return { stats, loading, refresh: fetchData };
}
