import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { Users, ActivitySquare, Calendar as CalendarIcon, BellRing, PlayCircle, FileText, UserPlus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { localizeNumber } from '@/lib/utils';

export default function DoctorDashboard() {
  const { patients, activePatientId, setActivePatient, language } = useStore();
  const navigate = useNavigate();

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  const stats = [
    { title: language === 'en' ? 'Total Patients' : 'মোট রোগী', value: patients.length.toString(), icon: Users, color: 'text-blue-500' },
    { title: language === 'en' ? 'Active Sessions Today' : 'আজকের সক্রিয় সেশন', value: '3', icon: ActivitySquare, color: 'text-emerald-500' },
    { title: language === 'en' ? 'Upcoming Appts' : 'আসন্ন অ্যাপয়েন্টমেন্ট', value: '5', icon: CalendarIcon, color: 'text-orange-500' },
    { title: language === 'en' ? 'Alerts' : 'সতর্কতা', value: '2', icon: BellRing, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</h1>
        
        {/* Patient Selector */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-border px-3 py-1.5 shadow-sm">
           <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{language === 'en' ? 'Focus Patient:' : 'ফোকাস রোগী:'}</span>
           <select 
             className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer outline-none text-foreground"
             value={activePatient?.id || ''}
             onChange={(e) => setActivePatient(e.target.value)}
           >
              {patients.map(p => (
                 <option key={p.id} value={p.id}>{p.name}</option>
              ))}
           </select>
        </div>
      </div>
      
      {/* Quick Access */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => navigate('/doctor/session')} className="gap-2">
          <PlayCircle className="w-4 h-4" /> {language === 'en' ? 'Start Remote Session' : 'রিমোট সেশন শুরু করুন'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/doctor/reports')} className="gap-2">
          <FileText className="w-4 h-4" /> {language === 'en' ? 'View Reports' : 'রিপোর্ট দেখুন'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/doctor/patients')} className="gap-2">
          <UserPlus className="w-4 h-4" /> {language === 'en' ? 'Add Patient' : 'রোগী যোগ করুন'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{localizeNumber(stat.value, language)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Progress Summary Widget */}
        {activePatient && (
          <Card className="lg:col-span-1 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="w-5 h-5" /> 
                {language === 'en' ? 'Patient Progress' : 'রোগীর অগ্রগতি'}
              </CardTitle>
              <CardDescription>{language === 'en' ? 'Summary for' : 'সারাংশ:'} {activePatient.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">{language === 'en' ? 'Compliance Score' : 'কমপ্লায়েন্স স্কোর'}</div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-foreground">{localizeNumber(activePatient.complianceScore, language)}</span>
                    <span className="text-sm font-medium text-muted-foreground mb-1">/ {localizeNumber(100, language)}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000" 
                      style={{ width: `${activePatient.complianceScore}%` }} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-border/50">
                    <div className="text-xs text-muted-foreground font-medium mb-1">{language === 'en' ? 'Stage' : 'পর্যায়'}</div>
                    <div className="font-bold whitespace-nowrap">{activePatient.progressStage.replace('Phase ', language === 'en' ? 'Phase ' : 'ফেজ ')}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border/50">
                    <div className="text-xs text-muted-foreground font-medium mb-1">{language === 'en' ? 'Last Session' : 'শেষ সেশন'}</div>
                    <div className="font-bold whitespace-nowrap">{new Date(activePatient.lastSessionDate).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/doctor/reports')}>
                  {language === 'en' ? 'View Full Report' : 'সম্পূর্ণ রিপোর্ট দেখুন'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Feed */}
        <Card className={activePatient ? "lg:col-span-2" : "col-span-1 lg:col-span-3"}>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Recent Activity' : 'সাম্প্রতিক কার্যকলাপ'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: language === 'en' ? '10:45 AM' : 'সকাল ১০:৪৫', event: language === 'en' ? 'Sarah Smith completed Phase 1 session' : 'সারা স্মিথ ফেজ 1 সেশন সম্পন্ন করেছেন', type: 'success' },
                { time: language === 'en' ? '09:30 AM' : 'সকাল ০৯:৩০', event: language === 'en' ? 'John Doe scheduled new appointment for Oct 28' : 'জন ডো 28 অক্টোবরের জন্য নতুন অ্যাপয়েন্টমেন্ট নির্ধারণ করেছেন', type: 'info' },
                { time: language === 'en' ? '08:15 AM' : 'সকাল ০৮:১৫', event: language === 'en' ? 'Device Dev-42 disconnected unexpectedly' : 'ডিভাইস দেব-৪২ অপ্রত্যাশিতভাবে সংযোগ বিচ্ছিন্ন হয়েছে', type: 'alert' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-muted  border">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
