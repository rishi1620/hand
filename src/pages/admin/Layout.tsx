import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import { LayoutDashboard, Users, ShieldAlert, Settings, LogOut, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const { currentUser, logout, language, setLanguage } = useStore();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'System Health' },
    { to: '/admin/users', icon: Users, label: 'User Provisioning' },
    { to: '/admin/audit', icon: ShieldAlert, label: 'Security & Audit Logs' },
    { to: '/admin/settings', icon: Settings, label: 'Platform Config' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-300">
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-emerald-500" />
          <span className="font-bold text-lg text-white">Admin Console</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                  isActive 
                    ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800" 
                    : "text-slate-400 hover:bg-slate-900 border border-transparent"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
             <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center font-bold">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 truncate">
               <div className="text-sm font-medium text-white truncate">{currentUser.name}</div>
               <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
             </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/50" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full h-screen overflow-hidden">
        <header className="md:hidden p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
          <span className="font-bold text-lg text-white">Admin Console</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}>
               <LogOut className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
