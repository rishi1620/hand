import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useStore } from '@/store';
import type { PatientRecord } from '@/store';
import { Search, Plus, Edit, Trash2, Calendar, Phone, Activity, AlertCircle } from 'lucide-react';

export default function DoctorPatients() {
  const { patients } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search patients..." 
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
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Name</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Diagnosis</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Stage</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Compliance</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Last Session</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
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
                    <td className="p-4"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">{patient.progressStage}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${patient.complianceScore}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{patient.complianceScore}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{patient.lastSessionDate}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); /* edit temp */ }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={(e) => { e.stopPropagation(); /* del temp */ }}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No patients found.</td>
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
            <DialogDescription>Patient ID: {selectedPatient?.id} • Age: {selectedPatient?.age}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Diagnosis</p>
                  <p className="font-medium text-foreground">{selectedPatient?.diagnosis}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPatient?.progressStage}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Last Session</p>
                  <p className="font-medium text-foreground">{selectedPatient?.lastSessionDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Contact Info</p>
                  <p className="font-medium text-foreground">{selectedPatient?.contact}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-700 uppercase">Emergency Contact</p>
                  <p className="font-medium text-red-900">{selectedPatient?.emergencyContact}</p>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Compliance Score</p>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${selectedPatient?.complianceScore || 0}%` }} />
                </div>
                <span className="font-bold text-foreground">{selectedPatient?.complianceScore}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setSelectedPatient(null)}>Close</Button>
            <Button onClick={() => {
               // In a real app we might navigate to a specific session page or start session here
               setSelectedPatient(null);
            }}>View Full History</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
