export type EventStatus = 'planned' | 'in_execution' | 'finished';
export type ExpenseStatus = 'paid' | 'pending';

export interface Event {
    id: string;
    name: string;
    date: string;
    status: EventStatus;
    created_at?: string;
}

export interface Category {
    id: string;
    name: string;
    created_at?: string;
}

export interface Responsible {
    id: string;
    name: string;
    created_at?: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    created_at?: string;
}

export interface Expense {
    id: string;
    event_id: string;
    category_id: string;
    responsible_id: string;
    amount: number;
    date: string;
    description: string;
    status: ExpenseStatus;
    observations?: string;
    created_at?: string;

    // Joined fields
    events?: { name: string };
    categories?: { name: string };
    responsibles?: { name: string };
}

export interface Income {
    id: string;
    event_id: string;
    amount: number;
    date: string;
    concept: string;
    payment_method_id: string;
    created_at?: string;

    // Joined fields
    events?: { name: string };
    payment_methods?: { name: string };
}
