"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Calendar,
    Wallet,
    TrendingUp,
    Menu
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';

const navItems = [
    { name: 'Inicio', href: '/', icon: BarChart3 },
    { name: 'Eventos', href: '/events', icon: Calendar },
    { name: 'Gastos', href: '/expenses', icon: TrendingUp },
    { name: 'Ingresos', href: '/income', icon: Wallet },
];

export default function MobileNav() {
    const pathname = usePathname();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <div className="mobile-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
                <button
                    className={`mobile-nav-item ${showMenu ? 'active' : ''}`}
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <Menu size={20} />
                    <span>Menú</span>
                </button>
            </div>

            {showMenu && (
                <div className="mobile-menu-overlay" onClick={() => setShowMenu(false)}>
                    <div className="mobile-sidebar-container" onClick={e => e.stopPropagation()}>
                        <Sidebar />
                    </div>
                </div>
            )}

            <style jsx global>{`
        .mobile-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            border-top: 1px solid var(--border);
            padding: 0.5rem;
            z-index: 50;
            justify-content: space-around;
            align-items: center;
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            color: var(--secondary);
            font-size: 0.7rem;
            text-decoration: none;
            padding: 0.5rem;
            border-radius: 8px;
            border: none;
            background: transparent;
            width: 100%;
        }

        .mobile-nav-item.active {
            color: var(--primary);
            background: var(--primary-light, #eff6ff);
        }

        .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 60px; /* above nav */
            background: rgba(0,0,0,0.5);
            z-index: 49;
            backdrop-filter: blur(2px);
        }
        
        .mobile-sidebar-container {
            height: 100%;
            width: 280px;
            background: white;
            overflow-y: auto;
        }
        
        /* Force sidebar to show in container */
        .mobile-sidebar-container .sidebar {
            position: relative;
            transform: none;
            height: 100%;
            display: flex;
            width: 100%;
        }

        @media (max-width: 768px) {
            .mobile-nav {
                display: flex;
            }
        }
      `}</style>
        </>
    );
}
