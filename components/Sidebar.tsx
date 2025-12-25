"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  Wallet,
  TrendingUp,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthContext } from './AuthProvider';
import { LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Eventos', href: '/events', icon: Calendar },
  { name: 'Gastos', href: '/expenses', icon: TrendingUp },
  { name: 'Ingresos', href: '/income', icon: Wallet },
  { name: 'Maestros', href: '/masters', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Event Finance</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-info p-4 border-b border-sidebar-active mb-4">
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="nav-item w-full text-left border-none bg-transparent cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
          <p className="mt-4 opacity-50 text-[10px]">© 2025 Event Management</p>
        </div>
      </aside>
    </>
  );
}
