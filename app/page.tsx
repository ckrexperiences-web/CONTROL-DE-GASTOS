"use client";

import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEvents } from '@/hooks/useEvents';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TrendingDown, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const [selectedEventId, setSelectedEventId] = useState('all');
  const { events } = useEvents();
  const { stats, loading } = useDashboardData(selectedEventId);

  return (
    <div className="container">
      <header className="page-header">
        <div>
          <h1>Panel de Control</h1>
          <p className="text-secondary">Resumen financiero consolidado de tus eventos</p>
        </div>
        <div className="filter-group dashboard-filter">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los Eventos</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </header>

      {loading ? (
        <p>Cargando datos del panel...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-icon bg-success-soft">
                <TrendingUp className="text-success" />
              </div>
              <div>
                <p className="stat-label">Total Ingresos</p>
                <h3>S/ {stats.totalIncome.toFixed(2)}</h3>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon bg-danger-soft">
                <TrendingDown className="text-danger" />
              </div>
              <div>
                <p className="stat-label">Total Gastos</p>
                <h3>S/ {stats.totalExpenses.toFixed(2)}</h3>
              </div>
            </div>

            <div className="card stat-card">
              <div className={`stat-icon ${stats.profit >= 0 ? 'bg-primary-soft' : 'bg-danger-soft'}`}>
                <DollarSign className={stats.profit >= 0 ? 'text-primary' : 'text-danger'} />
              </div>
              <div>
                <p className="stat-label">Balance Final</p>
                <h3 className={stats.profit < 0 ? 'text-danger' : 'text-success'}>
                  S/ {stats.profit.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>

          {stats.profit < 0 && (
            <div className="alert-banner danger">
              <AlertTriangle size={20} />
              <span><strong>Alerta:</strong> Los gastos superan a los ingresos en este periodo/evento.</span>
            </div>
          )}

          <div className="charts-grid">
            <div className="card chart-card">
              <h4>Gastos por Categoría</h4>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card chart-card">
              <h4>Comparativo Ingresos vs Gastos</h4>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.incomeVsExpenses}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-filter {
          background: var(--card-bg);
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-success-soft { background: #d1fae5; }
        .bg-danger-soft { background: #fee2e2; }
        .bg-primary-soft { background: #dbeafe; }

        .stat-label {
          font-size: 0.875rem;
          color: var(--secondary);
          margin-bottom: 0.25rem;
        }

        .alert-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: var(--radius);
          margin-bottom: 2rem;
        }

        .alert-banner.danger {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .chart-card h4 {
          margin-bottom: 1.5rem;
          color: var(--secondary);
        }

        .chart-container {
          height: 300px;
        }

        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
