import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useStore } from '@/store';
import type { PatientRecord } from '@/store';
import { Search, Plus, Edit, Trash2, Calendar, Phone, Activity, AlertCircle } from 'lucide-react';
import { localizeNumber } from '@/lib/utils';

export default function DoctorPatients() {
  const { patients, language } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{language === 'en' ? 'Patients' : 'রোগীসমূহ'}</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {language === 'en' ? 'Add Patient' : 'রোগী যোগ করুন'}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={language === 'en' ? "Search patients..." : "রোগী খুঁজুন..."}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted  border-b">
                <tr>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">{language === 'en' ? 'Name' : 'নাম'}</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">{language === 'en' ? 'Diagnosis' : 'রোগ নির্ণয়'}</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">{language === 'en' ? 'Stage' : 'পর্যায়'}</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">{language === 'en' ? 'Compliance' : 'কমপ্লায়েন্স'}</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">{language === 'en' ? 'Last Session' : 'শেষ সেশন'}</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">{language === 'en' ? 'Actions' : 'ক্রিয়া'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr 
                    key={patient.id} 
                    className="border-b transition-colors hover:bg-muted/50  cursor-pointer"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <td className="p-4 font-medium">{patient.name}</td>
                    <td className="p-4 text-muted-foreground">{patient.diagnosis}</td>
                    <td className="p-4"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">{patient.progressStage.replace('Phase ', language === 'en' ? 'Phase ' : 'ফেজ ')}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${patient.complianceScore}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{localizeNumber(patient.complianceScore, language)}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(patient.lastSessionDate).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { month: 'short', day: 'numeric' })}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); /* edit temp */ }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={(e) => { e.stopPropagation(); /* del temp */ }}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">{language === 'en' ? 'No patients found.' : 'কোনো রোগী পাওয়া যায়নি।'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPatient?.name}</DialogTitle>
            <DialogDescription>{language === 'en' ? 'Patient ID:' : 'রোগীর আইডি:'} {selectedPatient?.id} • {language === 'en' ? 'Age:' : 'বয়স:'} {selectedPatient ? localizeNumber(selectedPatient.age, language) : ''}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{language === 'en' ? 'Diagnosis' : 'রোগ নির্ণয়'}</p>
                  <p className="font-medium text-foreground">{selectedPatient?.diagnosis}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPatient?.progressStage.replace('Phase ', language === 'en' ? 'Phase ' : 'ফেজ ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{language === 'en' ? 'Last Session' : 'শেষ সেশন'}</p>
                  <p className="font-medium text-foreground">{selectedPatient && new Date(selectedPatient.lastSessionDate).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{language === 'en' ? 'Contact Info' : 'যোগাযোগের তথ্য'}</p>
                  <p className="font-medium text-foreground">{selectedPatient?.contact}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-700 uppercase">{language === 'en' ? 'Emergency Contact' : 'জরুরী যোগাযোগ'}</p>
                  <p className="font-medium text-red-900">{selectedPatient?.emergencyContact}</p>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">{language === 'en' ? 'Compliance Score' : 'কমপ্লায়েন্স স্কোর'}</p>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${selectedPatient?.complianceScore || 0}%` }} />
                </div>
                <span className="font-bold text-foreground">{selectedPatient ? localizeNumber(selectedPatient.complianceScore, language) : ''}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setSelectedPatient(null)}>{language === 'en' ? 'Close' : 'বন্ধ করুন'}</Button>
            <Button onClick={() => {
               // In a real app we might navigate to a specific session page or start session here
               setSelectedPatient(null);
            }}>{language === 'en' ? 'View Full History' : 'সম্পূর্ণ ইতিহাস দেখুন'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
