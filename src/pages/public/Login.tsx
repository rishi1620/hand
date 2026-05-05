import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { Activity, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const setLogin = useStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validRoles = ['patient', 'doctor', 'physiotherapist', 'admin'];
  if (!role || !validRoles.includes(role)) {
    return <div className="p-12 text-center text-red-500">Invalid Role Specified. <Link to="/">Return Home</Link></div>;
  }

  const roleConfigs: Record<string, { title: string, color: string, badge: string }> = {
    patient: { title: 'Patient Portal', color: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700' },
    doctor: { title: 'Doctor Portal', color: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    physiotherapist: { title: 'Physio Portal', color: 'bg-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
    admin: { title: 'Admin Console', color: 'bg-slate-800', badge: 'bg-slate-200 text-slate-800' },
  };

  const config = roleConfigs[role];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setLoading(false);
      setError('Invalid credentials or weak password. Password must be at least 6 characters.');
      return;
    }

    // Simulate backend auth check
    setTimeout(() => {
      setLoading(false);
      
      const mockUsers: Record<string, any> = {
        patient: { id: "1", name: "John Doe", role: "patient", email },
        doctor: { id: "doc-1", name: "Dr. Emily Chen", role: "doctor", email },
        physiotherapist: { id: "physio-1", name: "Sarah Jenkins, PT", role: "physiotherapist", email },
        admin: { id: "admin-1", name: "System Admin", role: "admin", email },
      };

      setLogin(mockUsers[role]);
      navigate(`/${role === 'physiotherapist' ? 'physio' : role}/dashboard`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <Activity className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-slate-900">HandRehab Pro</span>
        </Link>
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">{config.title}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your dashboard.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          
          <div className="mb-6 flex justify-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.badge}`}>
              <ShieldCheck className="w-4 h-4 mr-1" /> Secure {role.charAt(0).toUpperCase() + role.slice(1)} Login
            </span>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500" onClick={(e) => { e.preventDefault(); alert("Verification email sent to reset password."); }}>
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign in safely'} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <p className="mt-4 text-xs text-center text-slate-500">
              Note: This is a demo environment. Any email and password ({'>'}= 6 chars) will work.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
