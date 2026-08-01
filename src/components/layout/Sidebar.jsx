import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  CalendarClock, 
  AlertTriangle, 
  Activity, 
  PlusCircle, 
  ClipboardList,
  ShieldCheck,
  Wrench,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAuth();

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'equipment', label: 'Equipment Register', icon: Cpu },
          { id: 'schedule', label: 'Maintenance Schedule', icon: CalendarClock },
          { id: 'issues', label: 'All Reported Issues', icon: AlertTriangle },
          { id: 'downtime', label: 'Downtime & Analytics', icon: Activity },
        ];
      case 'staff':
        return [
          { id: 'dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
          { id: 'assigned-tasks', label: 'My Maintenance Tasks', icon: CalendarClock },
          { id: 'assigned-issues', label: 'Assigned Repair Issues', icon: Wrench },
          { id: 'equipment', label: 'Equipment Inventory', icon: Cpu },
        ];
      case 'faculty':
      default:
        return [
          { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'report-issue', label: 'Report New Problem', icon: PlusCircle },
          { id: 'my-issues', label: 'My Reported Issues', icon: ClipboardList },
          { id: 'equipment-lookup', label: 'Campus Equipment List', icon: Cpu },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Current Active Role Context Badge */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            currentUser?.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' :
            currentUser?.role === 'staff' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {currentUser?.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> :
             currentUser?.role === 'staff' ? <Wrench className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active User Role</div>
            <div className="text-xs font-bold text-slate-200 capitalize">
              {currentUser?.role === 'admin' ? 'Admin / Manager' : currentUser?.role === 'staff' ? 'Maintenance Staff' : 'Faculty / Staff'}
            </div>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-3 pb-1 tracking-wider">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Logout Button */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log Out Account
        </button>
      </div>
    </aside>
  );
};
