import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { UserCircle, ShieldCheck, Smartphone } from 'lucide-react';

export default function PatientProfile() {
  const { currentUser, patients, updatePatient } = useStore();
  const patientData = patients.find(p => p.id === currentUser?.id);
  
  const [formData, setFormData] = useState({
     name: patientData?.name || '',
     contact: patientData?.contact || '',
     emergencyContact: patientData?.emergencyContact || ''
  });

  if (!patientData) return null;

  const handleSave = () => {
     updatePatient(patientData.id, formData);
     alert('Profile updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and account settings.</p>
      </div>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><UserCircle className="w-5 h-5"/> Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label>Full Name</Label>
                 <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <Label>Email / Phone</Label>
                 <Input value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
              </div>
           </div>
           <div className="space-y-2">
              <Label>Emergency Contact</Label>
              <Input value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} />
              <p className="text-xs text-muted-foreground">Format: Name (Relation) - Phone number</p>
           </div>
           <Button onClick={handleSave} className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Medical Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
           <p className="text-muted-foreground mb-4">This information is managed by your doctor and is read-only.</p>
           <div className="grid grid-cols-2 gap-y-4 border rounded-md p-4 bg-muted ">
              <div>
                 <span className="text-muted-foreground block mb-1">Diagnosis</span>
                 <span className="font-medium">{patientData.diagnosis}</span>
              </div>
              <div>
                 <span className="text-muted-foreground block mb-1">Current Stage</span>
                 <span className="font-medium">{patientData.progressStage}</span>
              </div>
              <div>
                 <span className="text-muted-foreground block mb-1">Supervising Doctor</span>
                 <span className="font-medium">Dr. Emily Chen</span>
              </div>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5"/> Device Information</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                 <div className="font-medium">HandRehab Pro V2</div>
                 <div className="text-sm text-muted-foreground font-mono">ID: {patientData.assignedDeviceId || 'Unassigned'}</div>
              </div>
              <div className="px-3 py-1 bg-secondary  rounded-full text-xs font-medium border text-muted-foreground ">
                 {patientData.assignedDeviceId ? 'Registered' : 'Pending'}
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
