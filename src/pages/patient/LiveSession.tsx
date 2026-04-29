import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { AlertTriangle, Activity, Bluetooth } from 'lucide-react';

export default function PatientLiveSession() {
  const { activeSession, pairedDeviceId, connectDevice, deviceUrl, updateSessionTick } = useStore();
  const [deviceTelemetry, setDeviceTelemetry] = useState<any>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  // Poll device telemetry during active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeSession?.isRunning && !activeSession.isPaused) {
      interval = setInterval(async () => {
        if (pairedDeviceId === 'ESP32-Network-Device' && deviceUrl) {
          try {
            const res = await fetch(`${deviceUrl}/api/status`, { signal: AbortSignal.timeout(1500) });
            if (res.ok) {
              const data = await res.json();
              setDeviceTelemetry(data);
              setDeviceError(null);
            } else {
              setDeviceError(`Device error: ${res.status}`);
            }
          } catch(e) {
            setDeviceError('Network connection to device lost');
          }
        } else {
           setDeviceTelemetry(null);
        }
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [activeSession?.isRunning, activeSession?.isPaused, pairedDeviceId, deviceUrl]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Session</h1>
          <p className="text-muted-foreground">Follow along with your remote physiotherapy session.</p>
        </div>
        <div className="flex gap-2 items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${pairedDeviceId ? 'bg-emerald-50 text-emerald-700 border-emerald-200  ' : 'bg-secondary text-muted-foreground  '}`}>
               <Bluetooth className="w-4 h-4" />
               {pairedDeviceId ? `Local Device: ${pairedDeviceId}` : 'Disconnected'}
            </div>
            {!pairedDeviceId && (
               <Button size="sm" onClick={connectDevice}>Pair Local Device</Button>
            )}
        </div>
      </div>

      {!activeSession?.isRunning ? (
        <Card className="min-h-[400px] flex items-center justify-center border-dashed">
          <CardContent className="text-center space-y-4 pt-6">
            <Activity className="w-16 h-16 mx-auto text-muted-foreground opacity-30 animate-pulse" />
            <h2 className="text-2xl font-semibold">Waiting for Doctor</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Please ensure your device is powered on and connected. Your doctor will start the session remotely when they are ready.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {deviceError && pairedDeviceId === 'ESP32-Network-Device' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
               <div>
                  <p className="font-semibold text-sm">Device Connection Interrupted</p>
                  <p className="text-sm mt-1">{deviceError}. The session will resume when the connection is restored.</p>
               </div>
            </div>
          )}

          {deviceTelemetry?.overload && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse">
               <AlertTriangle className="w-6 h-6" />
               DEVICE OVERLOAD DETECTED - PLEASE RELAX HAND
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">Session Target</div>
                <div className="text-2xl font-bold">{activeSession.config.durationMinutes} min</div>
             </div>
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">Grip Force (Load)</div>
                <div className="text-2xl font-bold">
                   {deviceTelemetry?.load1 !== undefined ? deviceTelemetry.load1.toFixed(1) : activeSession.currentGripForce.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">N</span>
                </div>
             </div>
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">System Voltage</div>
                <div className="text-2xl font-bold text-amber-600">
                   {deviceTelemetry?.volt !== undefined ? deviceTelemetry.volt.toFixed(1) : '--'} <span className="text-sm font-normal text-muted-foreground">V</span>
                </div>
             </div>
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">Current Draw</div>
                <div className="flex justify-center gap-4 text-lg font-bold">
                  <div><span className="text-blue-600">{deviceTelemetry?.curr1 !== undefined ? deviceTelemetry.curr1.toFixed(0) : '--'}</span><span className="text-xs font-normal text-muted-foreground">mA</span></div>
                  <div><span className="text-emerald-600">{deviceTelemetry?.curr2 !== undefined ? deviceTelemetry.curr2.toFixed(0) : '--'}</span><span className="text-xs font-normal text-muted-foreground">mA</span></div>
                </div>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
               <Card className="bg-primary text-primary-foreground border-none">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-primary-foreground/90 font-medium text-sm flex items-center justify-between">
                      Session Active
                      {activeSession.isPaused ? (
                         <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-100">Paused</span>
                      ) : (
                         <span className="px-2 py-0.5 rounded text-xs bg-black/20 animate-pulse text-white">Live</span>
                      )}
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-5xl font-mono font-bold">
                      {Math.floor(activeSession.elapsedSeconds / 60).toString().padStart(2, '0')}:{(activeSession.elapsedSeconds % 60).toString().padStart(2, '0')}
                   </div>
                   <div className="mt-4 flex flex-col gap-1 text-sm text-primary-foreground/80">
                      <div className="flex justify-between"><span>Speed:</span> <span>{activeSession.config.speedPercentage}%</span></div>
                      <div className="flex justify-between"><span>Resistance:</span> <span>Level {activeSession.config.resistanceLevel}</span></div>
                   </div>
                 </CardContent>
               </Card>

               <Card className="border-red-200 bg-red-50 ">
                 <CardContent className="p-4">
                    <Button variant="destructive" className="w-full gap-2 h-14 text-lg">
                       <AlertTriangle className="w-5 h-5" /> Request Pause
                    </Button>
                    <p className="text-xs text-center mt-2 text-red-600 ">Alerts your doctor immediately.</p>
                 </CardContent>
               </Card>
            </div>

            <Card className="md:col-span-2">
              <CardHeader>
                 <CardTitle>Range of Motion</CardTitle>
                 <CardDescription>Live feedback from your device sensors</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex justify-evenly items-end h-64 gap-4 mt-8">
                    {['Thumb','Index','Middle','Ring','Pinky'].map((finger, i) => {
                       // Replace simulated flex with live telemetry if available
                       let heightPercentage = activeSession.currentFlex[i];
                       if (deviceTelemetry?.pos2 !== undefined) {
                           heightPercentage = (deviceTelemetry.pos2 / 270) * 100;
                           if (heightPercentage > 100) heightPercentage = 100;
                           if (heightPercentage < 0) heightPercentage = 0;
                       }
                       const isThumb = i === 0;
                       return (
                       <div key={finger} className={`flex flex-col items-center gap-4 ${isThumb ? 'mt-12 mr-4' : ''}`}>
                          <div className="w-16 h-48 bg-secondary  rounded-t-full relative overflow-hidden flex items-end">
                             <div className="w-full bg-primary/80 transition-all duration-300 rounded-t-full" style={{ height: `${heightPercentage}%` }}></div>
                             <div className="absolute top-2 w-full text-center text-xs font-mono font-bold text-muted-foreground z-10 opacity-50">
                               {Math.round(heightPercentage)}°
                             </div>
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">{finger}</span>
                       </div>
                    )})}
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
