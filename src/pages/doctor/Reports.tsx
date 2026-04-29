import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { useStore } from '@/store';

const gripData = [
  { date: 'Week 1', left: 12, right: 15 },
  { date: 'Week 2', left: 14, right: 15.5 },
  { date: 'Week 3', left: 16.5, right: 16 },
  { date: 'Week 4', left: 19, right: 17 },
  { date: 'Week 5', left: 22, right: 18.5 },
];

const complianceData = [
  { day: 'Mon', target: 30, actual: 30 },
  { day: 'Tue', target: 30, actual: 25 },
  { day: 'Wed', target: 30, actual: 35 },
  { day: 'Thu', target: 30, actual: 30 },
  { day: 'Fri', target: 30, actual: 0 },
  { day: 'Sat', target: 30, actual: 40 },
  { day: 'Sun', target: 30, actual: 30 },
];

const romData = [
  { finger: 'Thumb', A: 45, B: 30, fullMark: 90 },
  { finger: 'Index', A: 85, B: 60, fullMark: 90 },
  { finger: 'Middle', A: 80, B: 55, fullMark: 90 },
  { finger: 'Ring', A: 75, B: 50, fullMark: 90 },
  { finger: 'Pinky', A: 60, B: 40, fullMark: 90 },
];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics for tracking recovery.</p>
        </div>
        <div className="flex items-center gap-4">
           <select 
             className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
             value={selectedPatientId}
             onChange={(e) => setSelectedPatientId(e.target.value)}
           >
             {patients.map(p => (
               <option key={p.id} value={p.id}>{p.name}</option>
             ))}
           </select>
           <Button variant="outline" className="gap-2">
             <Download className="w-4 h-4" /> Export PDF
           </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Grip Strength Over Time</CardTitle>
            <CardDescription>Measured in Newtons (N) across recent weeks</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gripData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip unit="N" />} />
                <Legend />
                <Line type="monotone" dataKey="left" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} name="Affected Hand" />
                <Line type="monotone" dataKey="right" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Healthy Hand (Baseline)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Range of Motion Tracker</CardTitle>
            <CardDescription>Max flexion achieved vs previous week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={romData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="finger" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Current Week" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                <Radar name="Previous Week" dataKey="B" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.4} />
                <Legend />
                <Tooltip content={<CustomTooltip unit="%" />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Session Duration Compliance</CardTitle>
            <CardDescription>Daily prescribed vs actual minutes completed</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip unit="min" />} />
                <Legend />
                <Bar dataKey="target" fill="#f1f5f9" radius={[4, 4, 0, 0]} name="Target Duration" />
                <Bar dataKey="actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Actual Duration" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
