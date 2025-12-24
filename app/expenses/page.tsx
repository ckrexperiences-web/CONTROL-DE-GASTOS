"use client";

import { useState, useEffect } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useEvents } from '@/hooks/useEvents';
import { useMasterData } from '@/hooks/useMasterData';
import { Plus, Search, Filter, Trash2, Edit2, Info, FileSpreadsheet, FileText } from 'lucide-react';
import { ExpenseStatus } from '@/types/database';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';

export default function ExpensesPage() {
    const { expenses, loading, addExpense, deleteExpense, fetchExpenses } = useExpenses();
    const { events } = useEvents();
    const { items: categories } = useMasterData('categories');
    const { items: responsibles } = useMasterData('responsibles');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState('all');

    const [formData, setFormData] = useState({
        event_id: '',
        category_id: '',
        responsible_id: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
        status: 'pending' as ExpenseStatus,
        observations: ''
    });

    const handleFilterChange = (id: string) => {
        setSelectedEventId(id);
        fetchExpenses(id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addExpense(formData);
        setIsModalOpen(false);
        // Reset form
    };

    return (
        <div className="container">
            <header className="page-header">
                <div>
                    <h1>Control de Gastos</h1>
                    <p className="text-secondary">Registra y monitorea los egresos de tus eventos</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" style={{ marginRight: '0.5rem' }} onClick={() => {
                        const data = expenses.map(e => ({
                            'Fecha': e.date,
                            'Evento': e.events?.name,
                            'Categoría': e.categories?.name,
                            'Descripción': e.description,
                            'Responsable': e.responsibles?.name,
                            'Monto': Number(e.amount).toFixed(2),
                            'Estado': e.status === 'paid' ? 'Pagado' : 'Pendiente'
                        }));
                        exportToExcel(data, 'gastos_eventos');
                    }}>
                        <FileSpreadsheet size={18} style={{ marginRight: '0.5rem' }} />
                        Excel
                    </button>
                    <button className="btn btn-outline" style={{ marginRight: '1rem' }} onClick={() => {
                        const headers = ['Fecha', 'Evento', 'Categoría', 'Descripción', 'Monto', 'Estado'];
                        const data = expenses.map(e => [
                            e.date,
                            e.events?.name,
                            e.categories?.name,
                            e.description,
                            `S/ ${Number(e.amount).toFixed(2)}`,
                            e.status === 'paid' ? 'Pagado' : 'Pendiente'
                        ]);
                        exportToPDF(headers, data, 'reporte_gastos', 'Reporte Detallado de Gastos');
                    }}>
                        <FileText size={18} style={{ marginRight: '0.5rem' }} />
                        PDF
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        <span>Registrar Gasto</span>
                    </button>
                </div>
            </header>

            <div className="toolbar">
                <div className="filter-group">
                    <Filter size={18} className="icon" />
                    <select
                        value={selectedEventId}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos los Eventos</option>
                        {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Cargando gastos...</p>
            ) : (
                <div className="card table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Evento</th>
                                <th>Categoría</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th align="right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                                    <td>{expense.events?.name}</td>
                                    <td>{expense.categories?.name}</td>
                                    <td>{expense.description}</td>
                                    <td className="font-bold text-danger">
                                        S/ {Number(expense.amount).toFixed(2)}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${expense.status}`}>
                                            {expense.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td align="right">
                                        <button className="btn-icon danger" onClick={() => deleteExpense(expense.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <h2>Registrar Nuevo Gasto</h2>
                        <form onSubmit={handleSubmit} className="expense-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Evento</label>
                                    <select
                                        required
                                        value={formData.event_id}
                                        onChange={e => setFormData({ ...formData, event_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar Evento</option>
                                        {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar Categoría</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Monto (S/)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Descripción</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: Pago de catering - 50 platos"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Responsable</label>
                                    <select
                                        required
                                        value={formData.responsible_id}
                                        onChange={e => setFormData({ ...formData, responsible_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar Responsable</option>
                                        {responsibles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Estado de Pago</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as ExpenseStatus })}
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="paid">Pagado</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Observaciones (Opcional)</label>
                                    <textarea
                                        rows={2}
                                        value={formData.observations}
                                        onChange={e => setFormData({ ...formData, observations: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar Gasto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .toolbar {
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg);
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }

        .filter-select {
          border: none;
          background: transparent;
          font-family: inherit;
          font-weight: 500;
          color: var(--foreground);
          outline: none;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 1rem;
          background: #f8fafc;
          border-bottom: 1px solid var(--border);
          color: var(--secondary);
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
        }

        .status-pill {
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pill.paid { background: #d1fae5; color: #065f46; }
        .status-pill.pending { background: #fee2e2; color: #991b1b; }

        .expense-form .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--secondary);
        }

        .form-group input, 
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.7rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--background);
          font-family: inherit;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          width: 90%;
          max-width: 600px;
          padding: 2rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .font-bold { font-weight: 700; }
        
        @media (max-width: 600px) {
          .expense-form .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
        }
      `}</style>
        </div>
    );
}
