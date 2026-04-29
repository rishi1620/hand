import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Award } from 'lucide-react';
import { useStore } from '@/store';

const gripData = [
  { date: 'Week 1', score: 12 },
  { date: 'Week 2', score: 14 },
  { date: 'Week 3', score: 16.5 },
  { date: 'Week 4', score: 19 },
  { date: 'Week 5', score: 22 },
];

const complianceData = [
  { day: 'Mon', actual: 30 },
  { day: 'Tue', actual: 25 },
  { day: 'Wed', actual: 35 },
  { day: 'Thu', actual: 30 },
  { day: 'Fri', actual: 0 },
  { day: 'Sat', actual: 40 },
  { day: 'Sun', actual: 30 },
];

export default function PatientReports() {
  const { currentUser } = useStore();

  return (
    <div className="space-y-6">
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
            <h3 className="font-semibold text-lg">Milestones Achieved</h3>
            {[
               { title: '10 Day Streak', desc: 'Completed 10 consecutive daily sessions.', date: 'Oct 20' },
               { title: 'Grip Strength +5N', desc: 'Improved base grip force by 5 Newtons.', date: 'Oct 15' },
               { title: 'Full Index Flex', desc: 'Reached 90 degrees index finger flexion.', date: 'Oct 10' },
            ].map((m, i) => (
               <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted  border">
                  <div className="bg-amber-100 text-amber-600   p-3 rounded-full h-fit">
                     <Award className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="font-semibold">{m.title}</h4>
                     <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                     <p className="text-xs text-muted-foreground mt-2">{m.date}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Charts */}
         <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grip Recovery Curve</CardTitle>
                <CardDescription>Your grip strength improvement over time</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gripData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} name="Grip Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>This Week's Activity</CardTitle>
                <CardDescription>Minutes practiced per day</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Minutes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
