import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { Users, Search, ChevronRight } from 'lucide-react';

export default function PhysioPatientList() {
  const navigate = useNavigate();
  const { patients, language } = useStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-950">My Patients</h1>
          <p className="text-slate-500">View patient profiles, track progress, and manage clinical assessments.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search patients..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-9" />
            </div>
            <Button>Add New Patient</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map(pt => (
              <div 
                key={pt.id} 
                className="border rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white group"
                onClick={() => navigate(`/physio/patients/${pt.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
                      {pt.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">{pt.name}</h3>
                      <p className="text-sm text-slate-500">ID: {pt.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Condition</span>
                    <span className="font-medium text-slate-700 text-right max-w-[150px] truncate" title={pt.diagnosis}>{pt.diagnosis}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Stage</span>
                    <span className="font-medium text-slate-700">{pt.progressStage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Session</span>
                    <span className="font-medium text-slate-700">{pt.lastSessionDate}</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-between items-center text-indigo-600 font-medium text-sm group-hover:text-indigo-700">
                  View full profile <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
