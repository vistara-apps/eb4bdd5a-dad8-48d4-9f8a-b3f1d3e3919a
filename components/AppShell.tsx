'use client';

import { ReactNode } from 'react';
import { Camera, Compass, Crown } from 'lucide-react';
import { UserProfile } from './UserProfile';
import type { User } from '../lib/types';

interface AppShellProps {
  children: ReactNode;
  user?: User;
  activeView: 'discover' | 'ar' | 'tours';
  onViewChange: (view: 'discover' | 'ar' | 'tours') => void;
}

export function AppShell({ children, user, activeView, onViewChange }: AppShellProps) {
  const navItems = [
    { id: 'discover' as const, label: 'Discover', icon: Compass },
    { id: 'ar' as const, label: 'AR View', icon: Camera },
    { id: 'tours' as const, label: 'Premium', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">SculptAR</h1>
        </div>
        
        {user && <UserProfile user={user} variant="compact" />}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors duration-200 ${
                activeView === id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
