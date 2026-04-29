import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import { AppStrings } from '@/config/strings';
import { LayoutDashboard, History, PlayCircle, BarChart2, User, MessageCircle, LogOut, Video, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PatientLayout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'patient') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patient/sessions', icon: History, label: 'My Sessions' },
    { to: '/patient/live', icon: PlayCircle, label: 'Live Session' },
    { to: '/patient/reports', icon: BarChart2, label: 'Progress' },
    { to: '/patient/tele-rehab', icon: Video, label: 'Tele-Rehab' },
    { to: '/patient/games', icon: Gamepad2, label: 'Games' },
    { to: '/patient/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-muted ">
      {/* Top Header */}
      <header className="h-16 bg-white  border-b flex items-center justify-between px-6 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            P
          </div>
          <span className="font-bold text-lg hidden sm:block">{AppStrings.PatientPortalTitle}</span>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Notification or Messages Quick Icon here if needed */}
           <div className="flex items-center gap-2 text-sm font-medium mr-4">
              Hello, {currentUser.name.split(' ')[0]}
           </div>
           <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
           </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop) / Bottom Nav (Mobile) will be simple sidebar for now, responsive later */}
        <aside className="w-64 bg-white  border-r hidden md:flex flex-col">
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
        </aside>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
