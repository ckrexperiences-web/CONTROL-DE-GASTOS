"use client";

import { useState } from 'react';
import { useMasterData } from '@/hooks/useMasterData';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export default function MastersPage() {
    const [activeTab, setActiveTab] = useState<'categories' | 'responsibles' | 'payment_methods'>('categories');

    return (
        <div className="container">
            <header className="page-header">
                <div>
                    <h1>Configuración de Maestros</h1>
                    <p className="text-secondary">Administra las listas desplegables de tu sistema</p>
                </div>
            </header>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categorías
                </button>
                <button
                    className={`tab-btn ${activeTab === 'responsibles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('responsibles')}
                >
                    Responsables
                </button>
                <button
                    className={`tab-btn ${activeTab === 'payment_methods' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payment_methods')}
                >
                    Métodos de Pago
                </button>
            </div>

            <div className="tab-content card">
                <MasterTable key={activeTab} tableName={activeTab} />
            </div>

            <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }

        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }

        .tab-btn {
          padding: 0.5rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--secondary);
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius);
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: var(--border);
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
        }

        .tab-content {
          min-height: 400px;
        }
      `}</style>
        </div>
    );
}

function MasterTable({ tableName }: { tableName: 'categories' | 'responsibles' | 'payment_methods' }) {
    const { items, loading, addItem, updateItem, deleteItem } = useMasterData(tableName);
    const [newItemName, setNewItemName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const titles = {
        categories: 'Categoría',
        responsibles: 'Responsable',
        payment_methods: 'Método de Pago'
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        try {
            await addItem(newItemName);
            setNewItemName('');
        } catch (err: any) {
            alert(`Error al agregar ${titles[tableName]}: ${err.message || 'Error desconocido'}`);
        }
    };

    const handleEditStart = (item: { id: string; name: string }) => {
        setEditingId(item.id);
        setEditingName(item.name);
    };

    const handleEditSave = async () => {
        if (!editingId || !editingName.trim()) return;
        try {
            await updateItem(editingId, editingName);
            setEditingId(null);
        } catch (err: any) {
            alert(`Error al actualizar ${titles[tableName]}: ${err.message || 'Error desconocido'}`);
        }
    };

    return (
        <div className="master-table-container">
            <form onSubmit={handleAdd} className="add-form">
                <input
                    type="text"
                    placeholder={`Nueva ${titles[tableName]}...`}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="form-input"
                />
                <button type="submit" className="btn btn-primary">
                    <Plus size={20} />
                    <span>Agregar</span>
                </button>
            </form>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="master-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th align="right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {editingId === item.id ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="form-input small"
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </td>
                                <td align="right">
                                    <div className="action-btns">
                                        {editingId === item.id ? (
                                            <>
                                                <button className="btn-icon success" onClick={handleEditSave}>
                                                    <Check size={18} />
                                                </button>
                                                <button className="btn-icon danger" onClick={() => setEditingId(null)}>
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn-icon secondary" onClick={() => handleEditStart(item)}>
                                                    <Edit2 size={18} />
                                                </button>
                                                <button className="btn-icon danger" onClick={() => deleteItem(item.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <style jsx>{`
        .add-form {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .form-input {
          flex: 1;
          max-width: 300px;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--background);
          font-family: inherit;
        }

        .form-input.small {
          padding: 0.4rem;
        }

        .master-table {
          width: 100%;
          border-collapse: collapse;
        }

        .master-table th {
          text-align: left;
          padding: 1rem;
          border-bottom: 2px solid var(--border);
          color: var(--secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .master-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .action-btns {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.4rem;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-icon.secondary { color: var(--secondary); }
        .btn-icon.danger { color: var(--danger); }
        .btn-icon.success { color: var(--success); }

        .btn-icon:hover {
          background: rgba(0,0,0,0.05);
        }
      `}</style>
        </div>
    );
}
