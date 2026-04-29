import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppStrings } from '@/config/strings';
import { useStore } from '@/store';
import { Activity, Stethoscope, UserCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const setLogin = useStore(state => state.login);

  const handleDoctorLogin = () => {
    setLogin({ id: 'doc-1', name: 'Dr. Emily Chen', role: 'doctor', email: 'doc@example.com' });
    navigate('/doctor/dashboard');
  };

  const handlePatientLogin = () => {
    setLogin({ id: '1', name: 'John Doe', role: 'patient', email: 'john@example.com' });
    navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b flex justify-between items-center bg-white ">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{AppStrings.AppName}</span>
        </div>
        <div className="flex gap-4">
           {/* Navigation links if any */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl">
            {AppStrings.Tagline}
          </h1>
          <p className="text-xl text-muted-foreground  max-w-2xl">
            {AppStrings.Description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" className="h-14 px-8 text-lg gap-2" onClick={handleDoctorLogin}>
              <Stethoscope className="w-5 h-5" />
              {AppStrings.DoctorLoginBtn}
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg gap-2" onClick={handlePatientLogin}>
              <UserCircle className="w-5 h-5" />
              {AppStrings.PatientLoginBtn}
            </Button>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {[
            { title: 'Remote Control', desc: 'Physiotherapists can adjust device resistance and speed remotely.' },
            { title: 'Live Monitoring', desc: 'Real-time feedback on range of motion and grip strength.' },
            { title: 'Detailed Reports', desc: 'Comprehensive analytics for tracking recovery progress over time.' },
          ].map(feature => (
            <div key={feature.title} className="p-6 rounded-2xl bg-muted  border">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground ">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
