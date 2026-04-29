import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { AppStrings } from '@/config/strings';
import { LayoutDashboard, Users, Activity, FileBarChart, Calendar, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function DoctorLayout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  // Basic auth guard
  if (!currentUser || currentUser.role !== 'doctor') {
    navigate('/');
    return null;
  }

  const navItems = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor/patients', icon: Users, label: 'Patients' },
    { to: '/doctor/session', icon: Activity, label: 'Live Session' },
    { to: '/doctor/reports', icon: FileBarChart, label: 'Reports' },
    { to: '/doctor/calendar', icon: Calendar, label: 'Scheduler' },
    { to: '/doctor/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-muted  overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white  border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">{AppStrings.DoctorPortalTitle}</span>
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
                    ? "bg-blue-50 text-blue-900 border border-blue-100" 
                    : "text-muted-foreground hover:bg-muted border border-transparent"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3">
             <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 truncate">
               <div className="text-sm font-medium truncate">{currentUser.name}</div>
               <div className="text-xs text-muted-foreground truncate">{currentUser.email}</div>
             </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 :bg-red-950/50" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full h-screen overflow-hidden">
        {/* Mobile Header (simplified) */}
        <header className="md:hidden p-4 border-b bg-white  flex justify-between items-center">
          <span className="font-bold text-lg">{AppStrings.DoctorPortalTitle}</span>
          <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}>
             <LogOut className="h-5 w-5 text-red-500" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
