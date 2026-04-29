import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { UserCircle, Bell, Smartphone, Moon, Sun, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store';

export default function DoctorSettings() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your professional profile and platform preferences.</p>
      </div>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><UserCircle className="w-5 h-5"/> Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-accent  border-4 border-white  flex items-center justify-center shadow-sm overflow-hidden">
                 <UserCircle className="w-20 h-20 text-muted-foreground" />
              </div>
              <div>
                 <Button variant="outline" size="sm">Upload Photo</Button>
                 <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
              </div>
           </div>
           
           <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label>Full Name</Label>
                 <Input defaultValue="Dr. Emily Chen" />
              </div>
              <div className="space-y-2">
                 <Label>Specialty</Label>
                 <Input defaultValue="Orthopedic Physiotherapist" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                 <Label>Clinic / Hospital Name</Label>
                 <Input defaultValue="City Hand & Body Rehab Center" />
              </div>
           </div>
           
           <div className="pt-2">
              <Button>Save Profile</Button>
           </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/> Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {[
               { label: 'Session Completion Alerts', default: true },
               { label: 'Patient Messages', default: true },
               { label: 'Missed Sessions', default: false },
               { label: 'Weekly Summary Emails', default: true },
             ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                   <span className="text-sm font-medium">{item.label}</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.default} />
                      <div className="w-11 h-6 bg-accent peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                </div>
             ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5"/> Appearance</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between">
                 <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Toggle dark mode interface</div>
                 </div>
                 <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5"/> IoT Cloud Connection</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-4 mb-6">
              <Label>IoT Remote Gateway / Server URL</Label>
              <div className="flex gap-2">
                <Input 
                   value={useStore(state => state.deviceUrl)} 
                   onChange={(e) => useStore.getState().setDeviceUrl(e.target.value)} 
                   placeholder="e.g. https://api.iot-rehab.com"
                />
                <Button variant="outline" onClick={() => useStore.getState().connectDevice()}>Test Connection</Button>
              </div>
              <p className="text-xs text-muted-foreground">The platform will securely fetch live telemetry via this cloud gateway. Leave blank to simulate a remote device connection.</p>
           </div>
           
           <div className="rounded-md border divide-y">
              {[
                 { id: 'Dev-42 (Remote)', latency: '45ms', status: 'Online' },
                 { id: 'Dev-18 (Over WiFi)', latency: '120ms', status: 'Active Session' },
              ].map((device, i) => (
                 <div key={i} className="flex justify-between items-center p-4">
                    <div>
                       <div className="font-semibold text-sm">Node: {device.id}</div>
                       <div className="text-xs text-muted-foreground">Latency: {device.latency}</div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-medium px-2 py-1 bg-secondary  rounded">{device.status}</span>
                       <Button variant="ghost" size="sm" className="text-destructive h-8">Disconnect Target</Button>
                    </div>
                 </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
