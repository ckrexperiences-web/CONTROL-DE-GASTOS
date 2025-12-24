"use client";

import { useState } from 'react';
import { useIncome } from '@/hooks/useIncome';
import { useEvents } from '@/hooks/useEvents';
import { useMasterData } from '@/hooks/useMasterData';
import { Plus, Filter, Trash2, Wallet, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';

export default function IncomePage() {
    const { income, loading, addIncome, deleteIncome, fetchIncome } = useIncome();
    const { events } = useEvents();
    const { items: paymentMethods } = useMasterData('payment_methods');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState('all');

    const [formData, setFormData] = useState({
        event_id: '',
        concept: '',
        payment_method_id: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
    });

    const handleFilterChange = (id: string) => {
        setSelectedEventId(id);
        fetchIncome(id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addIncome(formData);
        setIsModalOpen(false);
        setFormData({
            event_id: '',
            concept: '',
            payment_method_id: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="container">
            <header className="page-header">
                <div>
                    <h1>Control de Ingresos</h1>
                    <p className="text-secondary">Gestiona las entradas de dinero por evento</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" style={{ marginRight: '0.5rem' }} onClick={() => {
                        const data = income.map(e => ({
                            'Fecha': e.date,
                            'Evento': e.events?.name,
                            'Concepto': e.concept,
                            'Método': e.payment_methods?.name,
                            'Monto': Number(e.amount).toFixed(2)
                        }));
                        exportToExcel(data, 'ingresos_eventos');
                    }}>
                        <FileSpreadsheet size={18} style={{ marginRight: '0.5rem' }} />
                        Excel
                    </button>
                    <button className="btn btn-outline" style={{ marginRight: '1rem' }} onClick={() => {
                        const headers = ['Fecha', 'Evento', 'Concepto', 'Método', 'Monto'];
                        const data = income.map(e => [
                            e.date,
                            e.events?.name,
                            e.concept,
                            e.payment_methods?.name,
                            `S/ ${Number(e.amount).toFixed(2)}`
                        ]);
                        exportToPDF(headers, data, 'reporte_ingresos', 'Reporte Detallado de Ingresos');
                    }}>
                        <FileText size={18} style={{ marginRight: '0.5rem' }} />
                        PDF
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        <span>Registrar Ingreso</span>
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
                <p>Cargando ingresos...</p>
            ) : (
                <div className="card table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Evento</th>
                                <th>Concepto</th>
                                <th>Método</th>
                                <th>Monto</th>
                                <th align="right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {income.map((entry) => (
                                <tr key={entry.id}>
                                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                                    <td>{entry.events?.name}</td>
                                    <td>{entry.concept}</td>
                                    <td>{entry.payment_methods?.name}</td>
                                    <td className="font-bold text-success">
                                        S/ {Number(entry.amount).toFixed(2)}
                                    </td>
                                    <td align="right">
                                        <button className="btn-icon danger" onClick={() => deleteIncome(entry.id)}>
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
                        <h2>Registrar Nuevo Ingreso</h2>
                        <form onSubmit={handleSubmit} className="income-form">
                            <div className="form-grid">
                                <div className="form-group full-width">
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
                                <div className="form-group full-width">
                                    <label>Concepto / Concepto</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: Venta de entradas preventa"
                                        value={formData.concept}
                                        onChange={e => setFormData({ ...formData, concept: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Método de Pago</label>
                                    <select
                                        required
                                        value={formData.payment_method_id}
                                        onChange={e => setFormData({ ...formData, payment_method_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar Método</option>
                                        {paymentMethods.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
                                    </select>
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
                                <div className="form-group">
                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar Ingreso
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

        .income-form .form-grid {
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
        .form-group select {
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
          max-width: 500px;
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
          .income-form .form-grid {
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
