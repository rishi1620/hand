import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Download, Award, Activity, TrendingUp, HandMetal } from 'lucide-react';
import { useStore } from '@/store';

// Helper to generate deterministic mock data based on patient ID
const generateReportData = (patientId: string) => {
  const seed = patientId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 5; 
  
  const gripData = [
    { date: 'Week 1', score: 10 + (seed % 5), target: 12 },
    { date: 'Week 2', score: 12 + (seed % 6), target: 15 },
    { date: 'Week 3', score: 15 + (seed % 7), target: 17 },
    { date: 'Week 4', score: 18 + (seed % 8), target: 20 },
    { date: 'Week 5', score: 21 + (seed % 9), target: 22 },
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

  const romData = [
    { date: 'Week 1', extension: 15, flexion: 40, target: 60 },
    { date: 'Week 2', extension: 25, flexion: 55, target: 70 },
    { date: 'Week 3', extension: 35, flexion: 65, target: 80 },
    { date: 'Week 4', extension: 45, flexion: 80, target: 90 },
    { date: 'Week 5', extension: 55, flexion: 92, target: 100 },
  ];

  return { gripData, complianceData, romData };
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg min-w-[150px]">
        <p className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: entry.stroke || entry.fill || entry.color }} />
                <span className="font-semibold text-slate-600">{entry.name}</span>
              </div>
              <span className="font-black text-slate-900">
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
  
  const { gripData, complianceData, romData } = useMemo(() => generateReportData(patientId), [patientId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Progress Reports</h1>
          <p className="text-slate-500 mt-1">Detailed visualization of your biometrics and therapy outcomes.</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 h-10">
           <Download className="w-4 h-4" /> Export comprehensive PDF
        </Button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
         {/* Milestones Panel */}
         <div className="md:col-span-4 space-y-6">
            <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm overflow-hidden">
               <div className="h-1 bg-indigo-500 w-full" />
               <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                     <TrendingUp className="w-5 h-5 text-indigo-600" /> Executive Summary
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  {selectedPatient && (
                     <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white border border-indigo-100 rounded-xl p-3 flex flex-col justify-center shadow-sm">
                           <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Current Stage</span>
                           <span className="text-lg font-bold text-indigo-700">{selectedPatient.progressStage}</span>
                        </div>
                        <div className="bg-white border border-indigo-100 rounded-xl p-3 flex flex-col justify-center shadow-sm">
                           <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Adherence</span>
                           <span className="text-lg font-bold text-emerald-600 flex items-baseline gap-1">
                             {selectedPatient.complianceScore}%
                             <TrendingUp className="w-3 h-3" />
                           </span>
                        </div>
                     </div>
                  )}

                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900/60 mb-3 flex items-center gap-2">
                     <Award className="w-4 h-4" /> Recent Milestones
                  </h4>
                  <div className="space-y-3">
                     {[
                        { title: '10 Day Streak', desc: 'Completed 10 consecutive daily sessions.', date: 'Oct 20', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
                        { title: 'Grip Strength +5N', desc: 'Improved base grip force by 5 Newtons.', date: 'Oct 15', color: 'bg-blue-100 text-blue-600 border-blue-200' },
                        { title: 'Full Index Flex', desc: 'Reached 90 degrees index finger flexion.', date: 'Oct 10', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
                     ].map((m, i) => (
                        <div key={i} className="flex gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
                           <div className={`p-2 rounded-lg h-fit border ${m.color}`}>
                              <Award className="w-4 h-4" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-semibold text-sm text-slate-800">{m.title}</h4>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{m.desc}</p>
                              <span className="absolute top-3 right-3 text-[10px] font-medium text-slate-400">{m.date}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Analytics Grid */}
         <div className="md:col-span-8 space-y-6">
            
            {/* Grip Recovery - Enhanced Line Chart */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                      <HandMetal className="w-5 h-5 text-blue-500" /> Grip Force Trajectory
                    </CardTitle>
                    <CardDescription className="mt-1">Max force measured across training weeks (Newtons)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gripData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip unit="N" />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="target" name="Clinical Target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={false} />
                    <Line type="monotone" dataKey="score" name="Your Grip Force" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#3b82f6' }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
               {/* Range of Motion - Area Chart */}
               <Card className="border-slate-200 shadow-sm">
                 <CardHeader className="pb-0">
                   <CardTitle className="text-md text-slate-800">Range of Motion (ROM)</CardTitle>
                   <CardDescription>Flexion & Extension (Degrees)</CardDescription>
                 </CardHeader>
                 <CardContent className="h-60 mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={romData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorFlex" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                         </linearGradient>
                         <linearGradient id="colorExt" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                       <Tooltip content={<CustomTooltip unit="°" />} />
                       <Area type="monotone" dataKey="flexion" name="Flexion" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorFlex)" strokeWidth={2} />
                       <Area type="monotone" dataKey="extension" name="Extension" stroke="#ec4899" fillOpacity={1} fill="url(#colorExt)" strokeWidth={2} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>

               {/* Adherence / Activity - Bar Chart */}
               <Card className="border-slate-200 shadow-sm">
                 <CardHeader className="pb-0">
                   <CardTitle className="text-md text-slate-800">Weekly Adherence</CardTitle>
                   <CardDescription>Active device usage strictly logged</CardDescription>
                 </CardHeader>
                 <CardContent className="h-60 mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={complianceData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                       <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip unit="min" />} />
                       <Bar dataKey="actual" name="Active Minutes" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1000} barSize={24} />
                       <ReferenceLine y={25} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'top', value: 'Goal', fill: '#94a3b8', fontSize: 10 }} />
                     </BarChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>
            </div>
         </div>
      </div>
    </div>
  );
}
