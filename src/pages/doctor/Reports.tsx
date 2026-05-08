import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store';

import { localizeNumber } from '@/lib/utils';

// Helper to generate deterministic mock data based on patient ID
const generateReportData = (patientId: string, language: string) => {
  const seed = patientId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const gripData = [
    { date: language === 'en' ? 'Week 1' : 'সপ্তাহ ১', left: 10 + (seed % 5), right: 15 },
    { date: language === 'en' ? 'Week 2' : 'সপ্তাহ ২', left: 12 + (seed % 6), right: 15.5 },
    { date: language === 'en' ? 'Week 3' : 'সপ্তাহ ৩', left: 14 + (seed % 7), right: 16 },
    { date: language === 'en' ? 'Week 4' : 'সপ্তাহ ৪', left: 17 + (seed % 8), right: 17 },
    { date: language === 'en' ? 'Week 5' : 'সপ্তাহ ৫', left: 19 + (seed % 9), right: 18.5 },
  ];

  const complianceData = [
    { day: language === 'en' ? 'Mon' : 'সোম', target: 30, actual: 20 + (seed % 15) },
    { day: language === 'en' ? 'Tue' : 'মঙ্গল', target: 30, actual: 25 + (seed % 10) },
    { day: language === 'en' ? 'Wed' : 'বুধ', target: 30, actual: 30 },
    { day: language === 'en' ? 'Thu' : 'বৃহঃ', target: 30, actual: 15 + (seed % 20) },
    { day: language === 'en' ? 'Fri' : 'শুক্র', target: 30, actual: (seed % 2 === 0) ? 0 : 30 },
    { day: language === 'en' ? 'Sat' : 'শনি', target: 30, actual: 30 + (seed % 10) },
    { day: language === 'en' ? 'Sun' : 'রবি', target: 30, actual: 25 + (seed % 10) },
  ];

  const romData = [
    { finger: language === 'en' ? 'Thumb' : 'বৃদ্ধাঙ্গুলি', A: 30 + (seed % 30), B: 25 + (seed % 20), fullMark: 90 },
    { finger: language === 'en' ? 'Index' : 'তর্জনী', A: 50 + (seed % 40), B: 40 + (seed % 30), fullMark: 90 },
    { finger: language === 'en' ? 'Middle' : 'মধ্যমা', A: 55 + (seed % 35), B: 45 + (seed % 25), fullMark: 90 },
    { finger: language === 'en' ? 'Ring' : 'অনামিকা', A: 45 + (seed % 45), B: 35 + (seed % 35), fullMark: 90 },
    { finger: language === 'en' ? 'Pinky' : 'কনিষ্ঠা', A: 40 + (seed % 30), B: 30 + (seed % 20), fullMark: 90 },
  ];

  const currentStageIndex = 1 + (seed % 3);
  const allStages = [
    { title: language === 'en' ? 'Initial Assessment' : 'প্রাথমিক মূল্যায়ন', date: language === 'en' ? 'Oct 01, 2023' : '০১ অক্টো, ২০২৩', desc: language === 'en' ? 'Baseline metrics established and targets set.' : 'বেসলাইন মেট্রিক্স প্রতিষ্ঠিত এবং লক্ষ্য নির্ধারণ করা হয়েছে।' },
    { title: language === 'en' ? 'Passive ROM Recovery' : 'প্যাসিভ ROM পুনরুদ্ধার', date: language === 'en' ? 'Oct 15, 2023' : '১৫ অক্টো, ২০২৩', desc: language === 'en' ? 'Regaining basic flexibility without load.' : 'লোড ছাড়াই মৌলিক নমনীয়তা পুনরুদ্ধার করা।' },
    { title: language === 'en' ? 'Active Assisted' : 'সক্রিয় সহায়তা প্রাপ্ত', date: language === 'en' ? 'Nov 05, 2023' : '০৫ নভে, ২০২৩', desc: language === 'en' ? 'Patient initiating movement with device assistance.' : 'রোগী ডিভাইসের সহায়তায় আন্দোলন শুরু করছেন।' },
    { title: language === 'en' ? 'Resistance Training' : 'প্রতিরোধ প্রশিক্ষণ', date: language === 'en' ? 'Est. Dec 2023' : 'আনুমানিক ডিসে ২০২৩', desc: language === 'en' ? 'Rebuilding force output using dynamic loads.' : 'গতিশীল লোড ব্যবহার করে ফোর্স আউটপুট পুনর্নির্মাণ।' },
    { title: language === 'en' ? 'Full Functional Use' : 'সম্পূর্ণ কার্যকরী ব্যবহার', date: language === 'en' ? 'Goal' : 'লক্ষ্য', desc: language === 'en' ? 'Return to unassisted daily living activities.' : 'সহায়তা ছাড়াই দৈনন্দিন জীবনযাত্রার কার্যকলাপে ফিরে আসা।' },
  ];

  const timelineStages = allStages.map((stage, i) => ({
    ...stage,
    status: i < currentStageIndex ? 'completed' : i === currentStageIndex ? 'current' : 'upcoming'
  }));

  return { gripData, complianceData, romData, timelineStages };
};


const CustomTooltip = ({ active, payload, label, unit, language }: any) => {
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
                {localizeNumber(entry.value, language)} {unit}
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
  const { patients, language } = useStore();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const { gripData, complianceData, romData, timelineStages } = useMemo(() => generateReportData(selectedPatientId, language), [selectedPatientId, language]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{language === 'en' ? 'Recovery Reports' : 'রিকভারি রিপোর্ট'}</h1>
          <p className="text-muted-foreground">{language === 'en' ? 'Comprehensive analytics and progress tracking.' : 'ব্যাপক বিশ্লেষণ এবং অগ্রগতি ট্র্যাকিং।'}</p>
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
             <Download className="w-4 h-4" /> {language === 'en' ? 'Export PDF' : 'পিডিএফ এক্সপোর্ট করুন'}
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
                  <div className="text-sm font-medium text-emerald-900">{language === 'en' ? 'Progress Stage' : 'অগ্রগতির পর্যায়'}</div>
                  <div className="text-2xl font-bold text-emerald-700">{selectedPatient.progressStage.replace('Phase ', language === 'en' ? 'Phase ' : 'ফেজ ')}</div>
                </div>
             </CardContent>
           </Card>
           <Card className="bg-blue-50/50 border-blue-100">
             <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">{language === 'en' ? 'Compliance Score' : 'কমপ্লায়েন্স স্কোর'}</div>
                  <div className="text-2xl font-bold text-blue-700">{localizeNumber(selectedPatient.complianceScore, language)}%</div>
                </div>
             </CardContent>
           </Card>
           <Card className="bg-purple-50/50 border-purple-100">
             <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-purple-900">{language === 'en' ? 'Last Session' : 'শেষ সেশন'}</div>
                  <div className="text-2xl font-bold text-purple-700">{new Date(selectedPatient.lastSessionDate).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
             </CardContent>
           </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="col-span-1 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Grip Strength Over Time' : 'সময়ের সাথে গ্রিপ শক্তি'}</CardTitle>
            <CardDescription>{language === 'en' ? 'Measured in Newtons (N) across recent weeks' : 'সাম্প্রতিক সপ্তাহগুলিতে নিউটনে (N) পরিমাপ করা হয়েছে'}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gripData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip unit={language === 'en' ? 'N' : 'নি.'} language={language} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="left" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name={language === 'en' ? 'Affected Hand' : 'আক্রান্ত হাত'} animationDuration={1000} />
                <Line type="monotone" dataKey="right" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name={language === 'en' ? 'Healthy Hand (Baseline)' : 'সুস্থ হাত (বেসলাইন)'} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Range of Motion Tracker' : 'গতির পরিসরের ট্র্যাকার'}</CardTitle>
            <CardDescription>{language === 'en' ? 'Max flexion achieved vs previous week' : 'অর্জিত সর্বোচ্চ ফ্লেক্সন বনাম গত সপ্তাহ'}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={romData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="finger" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={language === 'en' ? 'Current Week' : 'বর্তমান সপ্তাহ'} dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} animationDuration={1000} />
                <Radar name={language === 'en' ? 'Previous Week' : 'গত সপ্তাহ'} dataKey="B" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.4} animationDuration={1000} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip unit="%" language={language} />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Session Duration Compliance' : 'সেশনের সময়কাল কমপ্লায়েন্স'}</CardTitle>
            <CardDescription>{language === 'en' ? 'Daily prescribed vs actual minutes completed' : 'দৈনিক প্রস্তাবিত বনাম সম্পন্ন প্রকৃত মিনিট'}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip unit={language === 'en' ? 'min' : 'মিনিট'} language={language} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name={language === 'en' ? 'Target Duration' : 'লক্ষ্য সময়কাল'} animationDuration={1000} />
                <Bar dataKey="actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={language === 'en' ? 'Actual Duration' : 'প্রকৃত সময়কাল'} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm mt-2">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Recovery Journey Tracker' : 'রিকভারি জার্নি ট্র্যাকার'}</CardTitle>
            <CardDescription>{language === 'en' ? "Patient's progression through rehabilitation stages" : "পুনর্বাসন পর্যায়গুলির মাধ্যমে রোগীর অগ্রগতি"}</CardDescription>
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
                          {language === 'en' ? 'In Progress' : 'চলমান'}
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
