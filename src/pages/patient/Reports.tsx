import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Award, Activity, TrendingUp } from 'lucide-react';
import { useStore } from '@/store';

// Helper to generate deterministic mock data based on patient ID
const generateReportData = (patientId: string) => {
  const seed = patientId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 5; // Default seed if no ID
  
  const gripData = [
    { date: 'Week 1', score: 10 + (seed % 5) },
    { date: 'Week 2', score: 12 + (seed % 6) },
    { date: 'Week 3', score: 14 + (seed % 7) },
    { date: 'Week 4', score: 17 + (seed % 8) },
    { date: 'Week 5', score: 19 + (seed % 9) },
  ];

  const complianceData = [
    { day: 'Mon', actual: 20 + (seed % 15) },
    { day: 'Tue', actual: 25 + (seed % 10) },
    { day: 'Wed', actual: 30 },
    { day: 'Thu', actual: 15 + (seed % 20) },
    { day: 'Fri', actual: (seed % 2 === 0) ? 0 : 30 },
    { day: 'Sat', actual: 30 + (seed % 10) },
    { day: 'Sun', actual: 25 + (seed % 10) },
  ];

  return { gripData, complianceData };
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
        <p className="text-sm font-bold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-bold text-slate-500">{entry.name}</span>
              </div>
              <span className="font-black text-slate-800">
                {entry.value} {unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function PatientReports() {
  const { currentUser, patients } = useStore();
  const patientId = currentUser?.id || 'default';
  const selectedPatient = patients.find(p => p.id === currentUser?.id);
  
  const { gripData, complianceData } = useMemo(() => generateReportData(patientId), [patientId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground">See how far you've come since starting your therapy.</p>
        </div>
        <Button variant="outline" className="gap-2">
           <Download className="w-4 h-4" /> Download Summary
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Milestones */}
         <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
               <Award className="w-5 h-5 text-amber-500" />
               Recent Milestones
            </h3>
            
            {selectedPatient && (
               <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center text-center">
                     <TrendingUp className="w-5 h-5 text-emerald-600 mb-1" />
                     <span className="text-xs text-emerald-900 font-medium">Stage</span>
                     <span className="text-sm font-bold text-emerald-700">{selectedPatient.progressStage}</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col items-center text-center">
                     <Activity className="w-5 h-5 text-blue-600 mb-1" />
                     <span className="text-xs text-blue-900 font-medium">Compliance</span>
                     <span className="text-sm font-bold text-blue-700">{selectedPatient.complianceScore}%</span>
                  </div>
               </div>
            )}

            {[
               { title: '10 Day Streak', desc: 'Completed 10 consecutive daily sessions.', date: 'Oct 20' },
               { title: 'Grip Strength +5N', desc: 'Improved base grip force by 5 Newtons.', date: 'Oct 15' },
               { title: 'Full Index Flex', desc: 'Reached 90 degrees index finger flexion.', date: 'Oct 10' },
            ].map((m, i) => (
               <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border">
                  <div className="bg-amber-100 text-amber-600 p-3 rounded-full h-fit shadow-sm">
                     <Award className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-semibold text-slate-800">{m.title}</h4>
                     <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
                     <p className="text-xs text-slate-400 mt-2 font-medium">{m.date}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Charts */}
         <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Grip Recovery Curve</CardTitle>
                <CardDescription>Your grip strength improvement over time (Newtons)</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gripData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                    <Tooltip content={<CustomTooltip unit="N" />} />
                    <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Grip Score" animationDuration={1000} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>This Week's Activity</CardTitle>
                <CardDescription>Minutes practiced per day</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip unit="min" />} />
                    <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Minutes" animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
