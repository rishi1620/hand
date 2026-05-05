import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { Users, ActivitySquare, AlertTriangle, PlayCircle, Settings2, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PhysioParameterDialog } from '@/components/PhysioParameterDialog';

export default function PhysioDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-950">Physio Dashboard</h1>
          <p className="text-slate-500">Manage therapy sessions, monitor compliance, and adjust protocols safely.</p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Assigned Patients</CardTitle>
            <Users className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-800">14</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Today's Sessions</CardTitle>
            <ActivitySquare className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-800">8</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Abnormal Readings</CardTitle>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-800">1</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending MD Approval</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-800">3</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Therapy Queue</CardTitle>
            <CardDescription>Patients scheduled for remote robotic sessions today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'John Doe', time: '10:00 AM', status: 'Ready', id: '1' },
                { name: 'Sarah Smith', time: '11:30 AM', status: 'In Progress', id: '2' },
                { name: 'Michael Ross', time: '02:00 PM', status: 'Scheduled', id: '3' },
              ].map(pt => (
                <div key={pt.id} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{pt.name.charAt(0)}</div>
                     <div>
                       <div className="font-bold text-slate-800">{pt.name}</div>
                       <div className="text-xs text-slate-500">{pt.time} • Status: {pt.status}</div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <PhysioParameterDialog patientName={pt.name} patientId={pt.id} />
                     <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2"><PlayCircle className="w-4 h-4" /> Start</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <CardHeader>
            <CardTitle>Protocol Adjustments</CardTitle>
            <CardDescription>Safety limit constraints.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-6">
              As a physiotherapist, you may adjust exercise intensity, speed, and repetition volumes within the boundaries prescribed by the attending physician. 
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium space-y-2">
              <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> High-risk modifications locked.</div>
              <div>Any attempt to increase active resistance beyond +15% of the baseline requires MD authorization before the device will accept the command.</div>
            </div>
            <Button variant="outline" className="w-full mt-6 gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100"><FileText className="w-4 h-4" /> Request MD Override</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
