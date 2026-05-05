import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import { LayoutDashboard, Users, Activity, FileBarChart, LogOut, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PhysioLayout() {
  const { currentUser, logout, language, setLanguage } = useStore();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'physiotherapist') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { to: '/physio/dashboard', icon: LayoutDashboard, label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard' },
    { to: '/physio/patients', icon: Users, label: language === 'bn' ? 'অর্পণ করা রোগী' : 'Assigned Patients' },
    { to: '/physio/session', icon: Activity, label: language === 'bn' ? 'থেরাপি সেশন' : 'Therapy Session' },
    { to: '/physio/reports', icon: FileBarChart, label: language === 'bn' ? 'রিপোর্ট' : 'Reports' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-2 bg-indigo-50">
          <Activity className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-lg text-indigo-950">Physio Portal</span>
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
                    ? "bg-indigo-50 text-indigo-900 border border-indigo-100" 
                    : "text-slate-500 hover:bg-slate-100 border border-transparent"
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
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 truncate">
               <div className="text-sm font-medium truncate">{currentUser.name}</div>
               <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
             </div>
          </div>
          <Button variant="outline" className="w-full mb-2 gap-2" size="sm" onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}>
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="h-5 w-5 mr-3" />
            {language === 'bn' ? 'লগআউট' : 'Logout'}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full h-screen overflow-hidden">
        <header className="md:hidden p-4 border-b bg-white flex justify-between items-center">
          <span className="font-bold text-lg text-indigo-950">Physio Portal</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}>
              <Globe className="w-5 h-5 text-slate-500" />
            </Button>
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
