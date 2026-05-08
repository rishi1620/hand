import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, Label } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Assessment, BarthelIndexDetails, BergBalanceScaleDetails, ModifiedAshworthScaleDetails } from '@/types/clinical';

export default function PhysioNewAssessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, addAssessment, currentUser } = useStore();
  const patient = patients.find(p => p.id === id);

  const [assessmentType, setAssessmentType] = useState<'Barthel Index' | 'Berg Balance Scale' | 'Modified Ashworth Scale'>('Barthel Index');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [recommendedPlan, setRecommendedPlan] = useState('');

  // Form states depending on type
  const [barthelDetails, setBarthelDetails] = useState<BarthelIndexDetails>({
    feeding: 0,
    bathing: 0,
    grooming: 0,
    dressing: 0,
    bowels: 0,
    bladder: 0,
    toiletUse: 0,
    transfers: 0,
    mobility: 0,
    stairs: 0,
  });
  const barthelScore = Object.values(barthelDetails).reduce((sum, val) => sum + val, 0);

  const [bergScore, setBergScore] = useState(0);

  if (!patient) {
    return <div className="p-8 text-center">Patient not found</div>;
  }

  const handleSave = () => {
    let totalScore = 0;
    let interpretation = '';
    let details: any = {};

    if (assessmentType === 'Barthel Index') {
      totalScore = barthelScore;
      if (totalScore <= 20) interpretation = 'Total dependence';
      else if (totalScore <= 60) interpretation = 'Severe dependence';
      else if (totalScore <= 90) interpretation = 'Moderate dependence';
      else if (totalScore <= 99) interpretation = 'Slight dependence';
      else interpretation = 'Independent';
      details = { ...barthelDetails } as BarthelIndexDetails;
    } else if (assessmentType === 'Berg Balance Scale') {
      totalScore = bergScore;
      if (totalScore <= 20) interpretation = 'High fall risk';
      else if (totalScore <= 40) interpretation = 'Medium fall risk';
      else interpretation = 'Low fall risk';
      details = { sittingToStanding: 0 } as BergBalanceScaleDetails;
    } else {
      interpretation = 'Slight increase in muscle tone reported globally.';
      details = { entries: [{ muscleGroup: 'Wrist flexors', side: 'Right', beforeSessionScore: '2', afterSessionScore: '1', notes: '' }] } as ModifiedAshworthScaleDetails;
    }

    const newAssessment: Assessment = {
      id: `a-${Date.now()}`,
      patientId: patient.id,
      type: assessmentType,
      date: new Date().toISOString(),
      assessorId: currentUser?.id || 'unknown',
      assessorName: currentUser?.name || 'Physiotherapist',
      totalScore,
      interpretation,
      clinicalNotes,
      recommendedPlan,
      details,
    };

    addAssessment(newAssessment);
    navigate(`/physio/patients/${patient.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-2" onClick={() => navigate(`/physio/patients/${patient.id}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-950">New Clinical Assessment</h1>
          <p className="text-slate-500">Patient: {patient.name} • ID: {patient.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Assessment Type</Label>
            <div className="flex gap-4">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={assessmentType} 
                onChange={(e: any) => setAssessmentType(e.target.value)}
              >
                <option value="Barthel Index">Barthel Index</option>
                <option value="Berg Balance Scale">Berg Balance Scale</option>
                <option value="Modified Ashworth Scale">Modified Ashworth Scale (MAS)</option>
              </select>
            </div>
          </div>

          <div className="border rounded-xl p-6 bg-slate-50 space-y-4">
            {assessmentType === 'Barthel Index' && (
              <div className="space-y-6">
                 <div>
                   <h3 className="font-bold text-lg text-slate-800 mb-2">Barthel Index Form</h3>
                   <p className="text-sm text-slate-500 mb-4">Functional Independence Measure for Activities of Daily Living. (0-100)</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label>Feeding</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.feeding} onChange={(e) => setBarthelDetails({...barthelDetails, feeding: Number(e.target.value)})}>
                       <option value={0}>0 - Unable</option>
                       <option value={5}>5 - Needs help cutting, spreading butter, etc.</option>
                       <option value={10}>10 - Independent</option>
                     </select>
                   </div>
                   
                   <div className="space-y-2">
                     <Label>Bathing</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.bathing} onChange={(e) => setBarthelDetails({...barthelDetails, bathing: Number(e.target.value)})}>
                       <option value={0}>0 - Dependent</option>
                       <option value={5}>5 - Independent (or in shower)</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <Label>Grooming</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.grooming} onChange={(e) => setBarthelDetails({...barthelDetails, grooming: Number(e.target.value)})}>
                       <option value={0}>0 - Needs help with personal care</option>
                       <option value={5}>5 - Independent face/hair/teeth/shaving</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <Label>Dressing</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.dressing} onChange={(e) => setBarthelDetails({...barthelDetails, dressing: Number(e.target.value)})}>
                       <option value={0}>0 - Dependent</option>
                       <option value={5}>5 - Needs help but can do about half unaided</option>
                       <option value={10}>10 - Independent (including buttons, zips, laces, etc.)</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <Label>Bowels</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.bowels} onChange={(e) => setBarthelDetails({...barthelDetails, bowels: Number(e.target.value)})}>
                       <option value={0}>0 - Incontinent (or needs to be given enemata)</option>
                       <option value={5}>5 - Occasional accident</option>
                       <option value={10}>10 - Continent</option>
                     </select>
                   </div>
                   
                   <div className="space-y-2">
                     <Label>Bladder</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.bladder} onChange={(e) => setBarthelDetails({...barthelDetails, bladder: Number(e.target.value)})}>
                       <option value={0}>0 - Incontinent, or catheterized and unable to manage alone</option>
                       <option value={5}>5 - Occasional accident</option>
                       <option value={10}>10 - Continent</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <Label>Toilet Use</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.toiletUse} onChange={(e) => setBarthelDetails({...barthelDetails, toiletUse: Number(e.target.value)})}>
                       <option value={0}>0 - Dependent</option>
                       <option value={5}>5 - Needs some help, but can do something alone</option>
                       <option value={10}>10 - Independent (on and off, dressing, wiping)</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <Label>Transfers (bed to chair and back)</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.transfers} onChange={(e) => setBarthelDetails({...barthelDetails, transfers: Number(e.target.value)})}>
                       <option value={0}>0 - Unable, no sitting balance</option>
                       <option value={5}>5 - Major help (one or two people, physical)</option>
                       <option value={10}>10 - Minor help (verbal or physical)</option>
                       <option value={15}>15 - Independent</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <Label>Mobility (on level surfaces)</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.mobility} onChange={(e) => setBarthelDetails({...barthelDetails, mobility: Number(e.target.value)})}>
                       <option value={0}>0 - Immobile or &lt; 50 yards</option>
                       <option value={5}>5 - Wheelchair independent, including corners, &gt; 50 yards</option>
                       <option value={10}>10 - Walks with help of one person (verbal or physical) &gt; 50 yards</option>
                       <option value={15}>15 - Independent (but may use any aid; for example, stick) &gt; 50 yards</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <Label>Stairs</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={barthelDetails.stairs} onChange={(e) => setBarthelDetails({...barthelDetails, stairs: Number(e.target.value)})}>
                       <option value={0}>0 - Unable</option>
                       <option value={5}>5 - Needs help (verbal, physical, carrying aid)</option>
                       <option value={10}>10 - Independent</option>
                     </select>
                   </div>
                 </div>

                 <div className="mt-6 pt-4 border-t flex justify-between items-center">
                   <div className="font-medium text-slate-700">Total Score:</div>
                   <div className="text-3xl font-bold text-indigo-700">{barthelScore} <span className="text-lg text-slate-500 font-medium">/ 100</span></div>
                 </div>
              </div>
            )}
            
            {assessmentType === 'Berg Balance Scale' && (
               <div>
                 <h3 className="font-bold text-lg text-slate-800 mb-2">Berg Balance Scale Form</h3>
                 <p className="text-sm text-slate-500 mb-4">Balance and fall risk assessment. (0-56)</p>
                 <div className="space-y-2">
                     <Label>Total Calculated Score Mocked</Label>
                     <input type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={bergScore} onChange={(e) => setBergScore(Number(e.target.value))} max={56} min={0} />
                 </div>
              </div>
            )}

            {assessmentType === 'Modified Ashworth Scale' && (
               <div>
                 <h3 className="font-bold text-lg text-slate-800 mb-2">Modified Ashworth Scale Form</h3>
                 <p className="text-sm text-slate-500 mb-4">Spasticity and Muscle Tone Assessment.</p>
                 <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                    A comprehensive multi-select form for Wrist Flexors, Extensors, Finger Flexors, Thumb muscles, etc., comparing Before Session and After Session scores will be available here.
                 </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Clinical Notes</Label>
            <textarea
              placeholder="Enter your clinical observations here..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Therapy Plan Recommendation</Label>
            <textarea
              placeholder="Enter your recommended next steps and therapy plan goals..."
              value={recommendedPlan}
              onChange={(e) => setRecommendedPlan(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
             <Button variant="outline" onClick={() => navigate(`/physio/patients/${patient.id}`)}>Cancel</Button>
             <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> Save Assessment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
