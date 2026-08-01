import React, { useState } from 'react';
import { Bell, Building2, LogOut, ShieldCheck, Wrench, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

export const Header = () => {
  const { currentUser, logout } = useAuth();
  const { notifications } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'admin': return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      case 'staff': return <Wrench className="w-4 h-4 text-amber-400" />;
      default: return <GraduationCap className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 glass-panel border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-slate-100 flex items-center gap-2">
              Campus Maintenance Hub
          
            </h1>
            <p className="text-xs text-slate-400">Equipment Scheduling & Downtime Tracking System</p>
          </div>
        </div>

        {/* User Profile & Notifications */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Role Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            {getRoleIcon()}
            <span className="text-slate-300 font-semibold capitalize">
              {currentUser?.role === 'admin' ? 'Admin / Manager' : currentUser?.role === 'staff' ? 'Maintenance Staff' : 'Faculty / Staff'}
            </span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors"
            title="In-App Notifications"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Info & Logout Button */}
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/40"
            />
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-200">{currentUser?.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{currentUser?.email}</div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all flex items-center gap-1 text-xs font-medium"
              title="Log Out to Login Screen"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Notifications Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
