import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { UserCircle, ShieldCheck, Smartphone } from 'lucide-react';

export default function PatientProfile() {
  const { currentUser, patients, updatePatient, language } = useStore();
  const patientData = patients.find(p => p.id === currentUser?.id);
  
  const [formData, setFormData] = useState({
     name: patientData?.name || '',
     contact: patientData?.contact || '',
     emergencyContact: patientData?.emergencyContact || ''
  });

  if (!patientData) return null;

  const handleSave = () => {
     updatePatient(patientData.id, formData);
     alert(language === 'en' ? 'Profile updated successfully.' : 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে।');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{language === 'en' ? 'My Profile' : 'আমার প্রোফাইল'}</h1>
        <p className="text-muted-foreground mt-1">{language === 'en' ? 'Manage your personal information and account settings.' : 'আপনার ব্যক্তিগত তথ্য এবং অ্যাকাউন্ট সেটিংস পরিচালনা করুন।'}</p>
      </div>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><UserCircle className="w-5 h-5"/> {language === 'en' ? 'Personal Information' : 'ব্যক্তিগত তথ্য'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label>{language === 'en' ? 'Full Name' : 'পুরো নাম'}</Label>
                 <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <Label>{language === 'en' ? 'Email / Phone' : 'ইমেইল / ফোন'}</Label>
                 <Input value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
              </div>
           </div>
           <div className="space-y-2">
              <Label>{language === 'en' ? 'Emergency Contact' : 'জরুরী যোগাযোগ'}</Label>
              <Input value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} />
              <p className="text-xs text-muted-foreground">{language === 'en' ? 'Format: Name (Relation) - Phone number' : 'বিন্যাস: নাম (সম্পর্ক) - ফোন নম্বর'}</p>
           </div>
           <Button onClick={handleSave} className="mt-4">{language === 'en' ? 'Save Changes' : 'পরিবর্তন সংরক্ষণ করুন'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> {language === 'en' ? 'Medical Profile' : 'মেডিকেল প্রোফাইল'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
           <p className="text-muted-foreground mb-4">{language === 'en' ? 'This information is managed by your doctor and is read-only.' : 'এই তথ্য আপনার ডাক্তার দ্বারা পরিচালিত হয় এবং রীড ওনলি।'}</p>
           <div className="grid grid-cols-2 gap-y-4 border rounded-md p-4 bg-muted ">
              <div>
                 <span className="text-muted-foreground block mb-1">{language === 'en' ? 'Diagnosis' : 'রোগ নির্ণয়'}</span>
                 <span className="font-medium">{patientData.diagnosis}</span>
              </div>
              <div>
                 <span className="text-muted-foreground block mb-1">{language === 'en' ? 'Current Stage' : 'বর্তমান পর্যায়'}</span>
                 <span className="font-medium">{patientData.progressStage}</span>
              </div>
              <div>
                 <span className="text-muted-foreground block mb-1">{language === 'en' ? 'Supervising Doctor' : 'তত্ত্বাবধানকারী ডাক্তার'}</span>
                 <span className="font-medium">{language === 'en' ? 'Dr. Emily Chen' : 'ডা. এমিলি চেন'}</span>
              </div>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5"/> {language === 'en' ? 'Device Information' : 'ডিভাইসের তথ্য'}</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                 <div className="font-medium">HandRehab Pro V2</div>
                 <div className="text-sm text-muted-foreground font-mono">ID: {patientData.assignedDeviceId || (language === 'en' ? 'Unassigned' : 'অনির্ধারিত')}</div>
              </div>
              <div className="px-3 py-1 bg-secondary  rounded-full text-xs font-medium border text-muted-foreground ">
                 {patientData.assignedDeviceId ? (language === 'en' ? 'Registered' : 'নিবন্ধিত') : (language === 'en' ? 'Pending' : 'অমীমাংসিত')}
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
