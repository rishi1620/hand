import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { AppStrings } from '@/config/strings';
import { Calendar, PlayCircle, Trophy, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, localizeNumber } from '@/lib/utils';

export default function PatientDashboard() {
  const { patients, currentUser, language } = useStore();
  const navigate = useNavigate();
  const patientData = patients.find(p => p.id === currentUser?.id);
  const strings = AppStrings[language];

  if (!patientData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{strings.WelcomeBack}, {currentUser?.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">{strings.DailySummary}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Calendar className="w-5 h-5" /> {strings.TodaySessionPlan}
            </CardTitle>
            <CardDescription>{strings.PrescribedBy} {strings.Dr} {language === 'en' ? 'Emily Chen' : 'এমিলি চেন'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex gap-4 mb-6">
              <div className="bg-white  p-4 rounded-xl border flex-1 text-center">
                <div className="text-2xl font-bold">{localizeNumber(15, language)}</div>
                <div className="text-xs text-muted-foreground uppercase mt-1">{strings.Minutes}</div>
              </div>
              <div className="bg-white  p-4 rounded-xl border flex-1 text-center">
                <div className="text-2xl font-bold text-orange-500">{language === 'en' ? 'Moderate' : 'মাঝারি'}</div>
                <div className="text-xs text-muted-foreground uppercase mt-1">{strings.Intensity}</div>
              </div>
            </div>
            <Button className="w-full sm:w-auto" size="lg" onClick={() => navigate('/patient/live')}>
              <PlayCircle className="w-5 h-5 mr-2" /> {strings.StartNow}
            </Button>
          </CardContent>
        </Card>

        {/* Streak & Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                 <Trophy className="w-4 h-4 text-yellow-500" /> {strings.CurrentStreak}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{localizeNumber(4, language)} <span className="text-lg text-muted-foreground font-normal">{strings.Days}</span></div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                 <Activity className="w-4 h-4 text-emerald-500" /> {strings.ComplianceScore}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{localizeNumber(patientData.complianceScore, language)}%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Progress Snippet */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>{strings.RecentActivity}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/patient/sessions')}>
            {strings.ViewAll} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
           <div className="border rounded-lg divide-y">
              {[
                { date: language === 'en' ? 'Yesterday' : 'গতকাল', duration: '15', score: language === 'en' ? 'Excellent' : 'চমৎকার' },
                { date: language === 'en' ? 'Oct 24' : 'অক্টো ২৪', duration: '12', score: language === 'en' ? 'Good' : 'ভালো' },
              ].map((s, i) => (
                 <div key={i} className="p-4 flex justify-between items-center bg-muted/50 ">
                    <div>
                      <div className="font-medium">{s.date}</div>
                      <div className="text-sm text-muted-foreground">{localizeNumber(s.duration, language)} {language === 'en' ? 'min' : 'মিনিট'} {language === 'en' ? 'session' : 'সেশন'}</div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700   rounded-full text-xs font-medium">
                      {s.score}
                    </div>
                 </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
