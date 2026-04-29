import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store';

// Helper to generate deterministic mock data based on patient ID
const generateReportData = (patientId: string) => {
  const seed = patientId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const gripData = [
    { date: 'Week 1', left: 10 + (seed % 5), right: 15 },
    { date: 'Week 2', left: 12 + (seed % 6), right: 15.5 },
    { date: 'Week 3', left: 14 + (seed % 7), right: 16 },
    { date: 'Week 4', left: 17 + (seed % 8), right: 17 },
    { date: 'Week 5', left: 19 + (seed % 9), right: 18.5 },
  ];

  const complianceData = [
    { day: 'Mon', target: 30, actual: 20 + (seed % 15) },
    { day: 'Tue', target: 30, actual: 25 + (seed % 10) },
    { day: 'Wed', target: 30, actual: 30 },
    { day: 'Thu', target: 30, actual: 15 + (seed % 20) },
    { day: 'Fri', target: 30, actual: (seed % 2 === 0) ? 0 : 30 },
    { day: 'Sat', target: 30, actual: 30 + (seed % 10) },
    { day: 'Sun', target: 30, actual: 25 + (seed % 10) },
  ];

  const romData = [
    { finger: 'Thumb', A: 30 + (seed % 30), B: 25 + (seed % 20), fullMark: 90 },
    { finger: 'Index', A: 50 + (seed % 40), B: 40 + (seed % 30), fullMark: 90 },
    { finger: 'Middle', A: 55 + (seed % 35), B: 45 + (seed % 25), fullMark: 90 },
    { finger: 'Ring', A: 45 + (seed % 45), B: 35 + (seed % 35), fullMark: 90 },
    { finger: 'Pinky', A: 40 + (seed % 30), B: 30 + (seed % 20), fullMark: 90 },
  ];

  const currentStageIndex = 1 + (seed % 3);
  const allStages = [
    { title: 'Initial Assessment', date: 'Oct 01, 2023', desc: 'Baseline metrics established and targets set.' },
    { title: 'Passive ROM Recovery', date: 'Oct 15, 2023', desc: 'Regaining basic flexibility without load.' },
    { title: 'Active Assisted', date: 'Nov 05, 2023', desc: 'Patient initiating movement with device assistance.' },
    { title: 'Resistance Training', date: 'Est. Dec 2023', desc: 'Rebuilding force output using dynamic loads.' },
    { title: 'Full Functional Use', date: 'Goal', desc: 'Return to unassisted daily living activities.' },
  ];

  const timelineStages = allStages.map((stage, i) => ({
    ...stage,
    status: i < currentStageIndex ? 'completed' : i === currentStageIndex ? 'current' : 'upcoming'
  }));

  return { gripData, complianceData, romData, timelineStages };
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

export default function DoctorReports() {
  const { patients } = useStore();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const { gripData, complianceData, romData, timelineStages } = useMemo(() => generateReportData(selectedPatientId), [selectedPatientId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recovery Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics and progress tracking.</p>
        </div>
        <div className="flex items-center gap-4">
           <select 
             className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
             value={selectedPatientId}
             onChange={(e) => setSelectedPatientId(e.target.value)}
           >
             {patients.map(p => (
               <option key={p.id} value={p.id}>{p.name} - {p.diagnosis}</option>
             ))}
           </select>
           <Button variant="outline" className="gap-2">
             <Download className="w-4 h-4" /> Export PDF
           </Button>
        </div>
      </div>

      {selectedPatient && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <Card className="bg-emerald-50/50 border-emerald-100">
             <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-emerald-900">Progress Stage</div>
                  <div className="text-2xl font-bold text-emerald-700">{selectedPatient.progressStage}</div>
                </div>
             </CardContent>
           </Card>
           <Card className="bg-blue-50/50 border-blue-100">
             <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">Compliance Score</div>
                  <div className="text-2xl font-bold text-blue-700">{selectedPatient.complianceScore}%</div>
                </div>
             </CardContent>
           </Card>
           <Card className="bg-purple-50/50 border-purple-100">
             <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-purple-900">Last Session</div>
                  <div className="text-2xl font-bold text-purple-700">{new Date(selectedPatient.lastSessionDate).toLocaleDateString()}</div>
                </div>
             </CardContent>
           </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="col-span-1 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Grip Strength Over Time</CardTitle>
            <CardDescription>Measured in Newtons (N) across recent weeks</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gripData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip unit="N" />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="left" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Affected Hand" animationDuration={1000} />
                <Line type="monotone" dataKey="right" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Healthy Hand (Baseline)" animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Range of Motion Tracker</CardTitle>
            <CardDescription>Max flexion achieved vs previous week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={romData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="finger" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Current Week" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} animationDuration={1000} />
                <Radar name="Previous Week" dataKey="B" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.4} animationDuration={1000} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip unit="%" />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Session Duration Compliance</CardTitle>
            <CardDescription>Daily prescribed vs actual minutes completed</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip unit="min" />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target Duration" animationDuration={1000} />
                <Bar dataKey="actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Actual Duration" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm mt-2">
          <CardHeader>
            <CardTitle>Recovery Journey Tracker</CardTitle>
            <CardDescription>Patient's progression through rehabilitation stages</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:px-10">
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
              {timelineStages.map((item, i) => (
                <div key={i} className={`relative pl-8 transition-opacity duration-500 ${item.status === 'upcoming' ? 'opacity-60' : 'opacity-100'}`}>
                  <div className={`absolute -left-[11px] top-1 flex items-center justify-center h-5 w-5 rounded-full border-2 bg-white ${
                    item.status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' :
                    item.status === 'current' ? 'border-blue-500 ring-4 ring-blue-500/20' :
                    'border-slate-300'
                  }`}>
                    {item.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h4 className={`text-base font-semibold ${
                      item.status === 'completed' ? 'text-slate-900' :
                      item.status === 'current' ? 'text-blue-700' :
                      'text-slate-500'
                    }`}>
                      {item.title}
                      {item.status === 'current' && (
                        <span className="ml-3 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </h4>
                    <span className="text-sm font-medium text-slate-500 mt-1 sm:mt-0">{item.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 max-w-2xl">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
