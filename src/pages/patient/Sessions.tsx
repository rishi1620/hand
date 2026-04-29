import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PatientSessions() {
   const navigate = useNavigate();

   const upcoming = [
      { date: 'Today', time: '10:00 AM', duration: '15 min', intensity: 'Moderate' },
      { date: 'Tomorrow', time: '02:00 PM', duration: '20 min', intensity: 'Intensive' },
   ];

   const history = [
      { date: 'Yesterday', time: '11:00 AM', duration: '15 min', score: 95 },
      { date: 'Oct 25', time: '09:30 AM', duration: '15 min', score: 88 },
      { date: 'Oct 24', time: '10:15 AM', duration: '10 min', score: 100 },
      { date: 'Oct 22', time: '04:00 PM', duration: '20 min', score: 92 },
   ];

   return (
      <div className="space-y-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
            <p className="text-muted-foreground mt-1">Manage your upcoming therapy schedule and review past sessions.</p>
         </div>

         <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Upcoming Schedule</h2>
            <div className="grid sm:grid-cols-2 gap-4">
               {upcoming.map((session, i) => (
                  <Card key={i} className="border-l-4 border-l-primary">
                     <CardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                           <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                              <Calendar className="w-4 h-4" /> {session.date} - {session.time}
                           </div>
                           <div className="text-sm text-muted-foreground flex items-center gap-4">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {session.duration}</span>
                              <span className="flex items-center gap-1 bg-secondary  px-2 rounded">{session.intensity}</span>
                           </div>
                        </div>
                        {i === 0 && (
                           <Button onClick={() => navigate('/patient/live')}>
                              <PlayCircle className="w-4 h-4 mr-2" /> Start Now
                           </Button>
                        )}
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold border-b pb-2">Session History</h2>
            <Card>
               <div className="divide-y">
                  {history.map((session, i) => (
                     <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted  transition-colors">
                        <div className="flex items-start gap-4">
                           <div className="mt-1 bg-emerald-100 text-emerald-600   rounded-full p-1">
                              <CheckCircle2 className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-medium text-lg">{session.date} at {session.time}</div>
                              <div className="text-sm text-muted-foreground mt-1 flex gap-3">
                                 <span>Duration: {session.duration}</span>
                                 <span>•</span>
                                 <span>Completed</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 sm:text-right">
                           <div>
                              <div className="text-sm text-muted-foreground">Performance Score</div>
                              <div className="font-bold text-xl text-emerald-600 ">{session.score}/100</div>
                           </div>
                           <Button variant="outline" size="sm">Details</Button>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
   );
}
