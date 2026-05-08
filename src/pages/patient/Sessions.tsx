import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { localizeNumber } from '@/lib/utils';

export default function PatientSessions() {
   const navigate = useNavigate();
   const { language } = useStore();

   const upcoming = [
      { date: language === 'en' ? 'Today' : 'আজ', time: language === 'en' ? '10:00 AM' : 'সকাল ১০:০০', duration: language === 'en' ? '15 min' : '১৫ মিনিট', intensity: language === 'en' ? 'Moderate' : 'মাঝারি' },
      { date: language === 'en' ? 'Tomorrow' : 'আগামীকাল', time: language === 'en' ? '02:00 PM' : 'দুপুর ০২:০০', duration: language === 'en' ? '20 min' : '২০ মিনিট', intensity: language === 'en' ? 'Intensive' : 'তীব্র' },
   ];

   const history = [
      { date: language === 'en' ? 'Yesterday' : 'গতকাল', time: language === 'en' ? '11:00 AM' : 'সকাল ১১:০০', duration: language === 'en' ? '15 min' : '১৫ মিনিট', score: 95 },
      { date: language === 'en' ? 'Oct 25' : '২৫ অক্টো', time: language === 'en' ? '09:30 AM' : 'সকাল ০৯:৩০', duration: language === 'en' ? '15 min' : '১৫ মিনিট', score: 88 },
      { date: language === 'en' ? 'Oct 24' : '২৪ অক্টো', time: language === 'en' ? '10:15 AM' : 'সকাল ১০:১৫', duration: language === 'en' ? '10 min' : '১০ মিনিট', score: 100 },
      { date: language === 'en' ? 'Oct 22' : '২২ অক্টো', time: language === 'en' ? '04:00 PM' : 'বিকাল ০৪:০০', duration: language === 'en' ? '20 min' : '২০ মিনিট', score: 92 },
   ];

   return (
      <div className="space-y-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">{language === 'en' ? 'My Sessions' : 'আমার সেশন'}</h1>
            <p className="text-muted-foreground mt-1">{language === 'en' ? 'Manage your upcoming therapy schedule and review past sessions.' : 'আপনার আসন্ন থেরাপি সময়সূচী পরিচালনা করুন এবং অতীত সেশন পর্যালোচনা করুন।'}</p>
         </div>

         <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">{language === 'en' ? 'Upcoming Schedule' : 'আসন্ন সময়সূচী'}</h2>
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
                              <PlayCircle className="w-4 h-4 mr-2" /> {language === 'en' ? 'Start Now' : 'এখন শুরু করুন'}
                           </Button>
                        )}
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold border-b pb-2">{language === 'en' ? 'Session History' : 'সেশনের ইতিহাস'}</h2>
            <Card>
               <div className="divide-y">
                  {history.map((session, i) => (
                     <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted  transition-colors">
                        <div className="flex items-start gap-4">
                           <div className="mt-1 bg-emerald-100 text-emerald-600   rounded-full p-1">
                              <CheckCircle2 className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-medium text-lg">{session.date} {language === 'en' ? 'at' : 'এ'} {session.time}</div>
                              <div className="text-sm text-muted-foreground mt-1 flex gap-3">
                                 <span>{language === 'en' ? 'Duration:' : 'সময়কাল:'} {session.duration}</span>
                                 <span>•</span>
                                 <span>{language === 'en' ? 'Completed' : 'সম্পন্ন হয়েছে'}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 sm:text-right">
                           <div>
                              <div className="text-sm text-muted-foreground">{language === 'en' ? 'Performance Score' : 'পারফরম্যান্স স্কোর'}</div>
                              <div className="font-bold text-xl text-emerald-600 ">{localizeNumber(session.score, language)}/{localizeNumber(100, language)}</div>
                           </div>
                           <Button variant="outline" size="sm">{language === 'en' ? 'Details' : 'বিবরণ'}</Button>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
   );
}
