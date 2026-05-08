import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, BatteryCharging, ChevronRight, ActivitySquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PhysioPatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, assessments, language } = useStore();
  const patient = patients.find(p => p.id === id);

  const [activeTab, setActiveTab] = useState<'assessments' | 'history' | 'trends'>('assessments');

  if (!patient) {
    return <div className="p-8 text-center text-slate-500">Patient not found</div>;
  }

  const patientAssessments = assessments.filter(a => a.patientId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const barthelAssessments = [...patientAssessments]
    .filter(a => a.type === 'Barthel Index')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(a => ({
      date: new Date(a.date).toLocaleDateString(),
      score: a.totalScore
    }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-2" onClick={() => navigate('/physio/patients')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-950">{patient.name}</h1>
          <p className="text-slate-500">ID: {patient.id} • {patient.diagnosis}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Age</span>
              <span className="font-medium text-slate-800">{patient.age}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Stage</span>
              <span className="font-medium text-slate-800">{patient.progressStage}</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Compliance</span>
              <span className="font-medium text-emerald-600">{patient.complianceScore}%</span>
            </div>
             <div className="pt-4 border-t">
               <h4 className="text-sm font-bold text-slate-700 mb-2">Emergency Contact</h4>
               <p className="text-sm text-slate-600">{patient.emergencyContact}</p>
             </div>
          </CardContent>
        </Card>

         <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Robotic Therapy Status</CardTitle>
             <CardDescription>Recent hardware metrics and activity.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="p-4 bg-slate-50 rounded-xl border">
                 <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Target className="w-4 h-4"/> Grip Force</div>
                 <div className="text-2xl font-bold text-slate-800">42 N</div>
                 <div className="text-xs text-emerald-500 font-medium">+5% this week</div>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border">
                 <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><ActivitySquare className="w-4 h-4"/> ROM Max</div>
                 <div className="text-2xl font-bold text-slate-800">75%</div>
                 <div className="text-xs text-emerald-500 font-medium">+2% this week</div>
               </div>
                <div className="p-4 bg-slate-50 rounded-xl border">
                 <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><BatteryCharging className="w-4 h-4"/> Fatigue</div>
                 <div className="text-2xl font-bold text-slate-800">Low</div>
                 <div className="text-xs text-slate-500">Last session</div>
               </div>
               <div className="p-4 bg-indigo-50 border-indigo-100 rounded-xl border flex flex-col justify-center items-center cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => navigate('/physio/session')}>
                 <div className="font-bold text-indigo-700 mb-1">Start Session</div>
                 <ChevronRight className="w-5 h-5 text-indigo-500" />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full mt-8">
        <div className="flex w-full justify-start border-b mb-6">
          <button onClick={() => setActiveTab('assessments')} className={`pb-3 px-6 text-base font-semibold border-b-2 ${activeTab === 'assessments' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Clinical Assessments</button>
          <button onClick={() => setActiveTab('history')} className={`pb-3 px-6 text-base font-semibold border-b-2 ${activeTab === 'history' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Therapy History</button>
          <button onClick={() => setActiveTab('trends')} className={`pb-3 px-6 text-base font-semibold border-b-2 ${activeTab === 'trends' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Progress Trends</button>
        </div>
        
        {activeTab === 'assessments' && (
           <div>
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-800">Standardized Outcome Measures</h2>
               <Button onClick={() => navigate(`/physio/patients/${patient.id}/new-assessment`)}>
                 New Assessment
               </Button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="hover:shadow-md transition-shadow cursor-pointer border-indigo-100">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between items-start">
                     <div>
                       <CardTitle className="text-lg">Barthel Index</CardTitle>
                       <p className="text-sm text-slate-500 mt-1">Measures functional independence and ADL.</p>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   {patientAssessments.filter(a => a.type === 'Barthel Index').length > 0 ? (
                     <div className="mt-4">
                       <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Latest Score</div>
                       <div className="flex items-end gap-3">
                         <span className="text-3xl font-bold text-slate-800">{patientAssessments.filter(a => a.type === 'Barthel Index')[0].totalScore}</span>
                         <span className="text-sm font-medium text-slate-600 pb-1">/ 100</span>
                       </div>
                       <p className="text-sm text-indigo-600 font-medium mt-1">{patientAssessments.filter(a => a.type === 'Barthel Index')[0].interpretation}</p>
                     </div>
                   ) : (
                     <div className="text-sm text-slate-400 italic mt-4">No assessments recorded yet.</div>
                   )}
                 </CardContent>
               </Card>

               <Card className="hover:shadow-md transition-shadow cursor-pointer border-indigo-100">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between items-start">
                     <div>
                       <CardTitle className="text-lg">Berg Balance Scale</CardTitle>
                       <p className="text-sm text-slate-500 mt-1">Measures balance and fall risk.</p>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   {patientAssessments.filter(a => a.type === 'Berg Balance Scale').length > 0 ? (
                     <div className="mt-4">
                       <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Latest Score</div>
                       <div className="flex items-end gap-3">
                         <span className="text-3xl font-bold text-slate-800">{patientAssessments.filter(a => a.type === 'Berg Balance Scale')[0].totalScore}</span>
                         <span className="text-sm font-medium text-slate-600 pb-1">/ 56</span>
                       </div>
                       <p className="text-sm text-indigo-600 font-medium mt-1">{patientAssessments.filter(a => a.type === 'Berg Balance Scale')[0].interpretation}</p>
                     </div>
                   ) : (
                     <div className="text-sm text-slate-400 italic mt-4">No assessments recorded yet.</div>
                   )}
                 </CardContent>
               </Card>

               <Card className="hover:shadow-md transition-shadow cursor-pointer border-indigo-100">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between items-start">
                     <div>
                       <CardTitle className="text-lg">Modified Ashworth Scale</CardTitle>
                       <p className="text-sm text-slate-500 mt-1">Measures upper-limb spasticity and muscle tone.</p>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   {patientAssessments.filter(a => a.type === 'Modified Ashworth Scale').length > 0 ? (
                     <div className="mt-4">
                       <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Latest Summary</div>
                       <p className="text-sm text-indigo-600 font-medium mt-1">{patientAssessments.filter(a => a.type === 'Modified Ashworth Scale')[0].interpretation}</p>
                     </div>
                   ) : (
                     <div className="text-sm text-slate-400 italic mt-4">No assessments recorded yet.</div>
                   )}
                 </CardContent>
               </Card>
             </div>
             
             <div className="mt-8">
               <h3 className="font-bold text-slate-800 mb-4">Assessment History</h3>
               <div className="space-y-3">
                {patientAssessments.length === 0 ? (
                  <p className="text-slate-500">No history available.</p>
                ) : (
                  patientAssessments.map(a => (
                    <div key={a.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-xl hover:bg-slate-50 transition-colors gap-4">
                      <div>
                        <div className="font-bold text-slate-800">{a.type}</div>
                        <div className="text-sm text-slate-500">{new Date(a.date).toLocaleDateString()} • Assessed by {a.assessorName}</div>
                      </div>
                      <div className="text-right">
                        {a.type !== 'Modified Ashworth Scale' ? (
                          <div className="font-bold text-indigo-700 text-xl">{a.totalScore}</div>
                        ) : (
                           <div className="font-bold text-indigo-700 text-sm">{a.interpretation}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
               </div>
             </div>
          </div>
        )}
        {activeTab === 'history' && (
          <div className="py-8 text-center text-slate-500">Therapy history will be displayed here.</div>
        )}
        {activeTab === 'trends' && (
          <div className="py-6">
             <Card>
               <CardHeader>
                 <CardTitle>Barthel Index Trends</CardTitle>
                 <CardDescription>Functional independence over time</CardDescription>
               </CardHeader>
               <CardContent>
                 {barthelAssessments.length > 0 ? (
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={barthelAssessments} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="score" name="Barthel Score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                 ) : (
                   <p className="text-slate-500 text-center py-8">Not enough data to plot Barthel Index trends.</p>
                 )}
               </CardContent>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
