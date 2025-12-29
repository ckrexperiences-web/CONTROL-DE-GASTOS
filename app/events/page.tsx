"use client";

import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { EventStatus } from '@/types/database';
import { Plus, Search, Calendar as CalendarIcon, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function EventsPage() {
  const { events, loading, addEvent, deleteEvent, updateEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    status: 'planned' as EventStatus
  });

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await updateEvent(editingEventId, formData);
      } else {
        await addEvent(formData);
      }
      setIsModalOpen(false);
      setEditingEventId(null);
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        status: 'planned'
      });
    } catch (err: any) {
      alert("Error al guardar el evento: " + (err.message || "Error desconocido"));
    }
  };

  const handleEdit = (event: any) => {
    setEditingEventId(event.id);
    setFormData({
      name: event.name,
      date: new Date(event.date).toISOString().split('T')[0],
      status: event.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      status: 'planned'
    });
  };

  const statusColors = {
    planned: 'bg-blue-soft',
    in_execution: 'bg-accent-soft',
    finished: 'bg-success-soft'
  };

  const statusLabels = {
    planned: 'Planificado',
    in_execution: 'En Ejecución',
    finished: 'Finalizado'
  };

  return (
    <div className="container">
      <header className="page-header">
        <div>
          <h1>Gestión de Eventos</h1>
          <p className="text-secondary">Administra y organiza tus eventos de producción</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingEventId(null);
          setFormData({
            name: '',
            date: new Date().toISOString().split('T')[0],
            status: 'planned'
          });
          setIsModalOpen(true);
        }}>
          <Plus size={20} />
          <span>Nuevo Evento</span>
        </button>
      </header>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Cargando eventos...</div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card event-card">
              <div className="event-card-header">
                <span className={`status-badge ${event.status}`}>
                  {statusLabels[event.status]}
                </span>
                <button className="btn-icon" onClick={() => handleEdit(event)}>
                  <MoreVertical size={18} />
                </button>
              </div>
              <h3>{event.name}</h3>
              <div className="event-details">
                <div className="detail-item">
                  <CalendarIcon size={16} />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="event-actions">
                <button className="btn btn-outline" onClick={() => deleteEvent(event.id)}>
                  <Trash2 size={16} />
                </button>
                <button className="btn btn-primary" onClick={() => handleEdit(event)}>Ver Detalles</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h2>{editingEventId ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Evento</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Concierto de Verano"
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
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as EventStatus })}
                >
                  <option value="planned">Planificado</option>
                  <option value="in_execution">En Ejecución</option>
                  <option value="finished">Finalizado</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Evento
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
          margin-bottom: 2rem;
        }

        .search-bar {
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--secondary);
        }

        .search-bar input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--card-bg);
          font-family: inherit;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .event-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .event-card:hover {
          transform: translateY(-4px);
        }

        .event-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.planned { background: #dbeafe; color: #1e40af; }
        .status-badge.in_execution { background: #fef3c7; color: #92400e; }
        .status-badge.finished { background: #d1fae5; color: #065f46; }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: var(--secondary);
          font-size: 0.875rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 1rem;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--secondary);
        }

        .btn-outline:hover {
          background: #fee2e2;
          color: var(--danger);
          border-color: var(--danger);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-group input, 
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--background);
          font-family: inherit;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
