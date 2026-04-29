import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/store';
import { PlayCircle, Square, PauseCircle, Activity, Globe, AlertTriangle, Undo, Redo, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const playWarningBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch(e) {}
};

export default function DoctorSession() {
  const { patients, startSession, pauseSession, stopSession, activeSession, pairedDeviceId, connectDevice, updateSessionTick, pairingDevice } = useStore();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [deviceTelemetry, setDeviceTelemetry] = useState<any>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const previousApproachingRef = useRef<boolean[]>(Array(5).fill(false));
  
  const [configHistory, setConfigHistory] = useState([{
    durationMinutes: 15,
    speedPercentage: 50,
    resistanceLevel: 2,
    romLimits: { thumb: 45, index: 60, middle: 60, ring: 60, pinky: 45 }
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const sessionConfig = configHistory[historyIndex];

  const handleConfigChange = (newConfig: typeof sessionConfig) => {
    const newHistory = configHistory.slice(0, historyIndex + 1);
    newHistory.push(newConfig);
    setConfigHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    if (activeSession?.isRunning) {
       useStore.getState().startSession(newConfig);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      if (activeSession?.isRunning) useStore.getState().startSession(configHistory[idx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < configHistory.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      if (activeSession?.isRunning) useStore.getState().startSession(configHistory[idx]);
    }
  };

  const selectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;

  const handleStart = () => {
    if (!selectedPatientId) return alert('Select a patient first');
    if (!pairedDeviceId) return alert('Connect to remote IoT device first');
    startSession(sessionConfig);
    setChartData([]);
    setDeviceError(null);
  };

  // Simulation tick logic
  useEffect(() => {
    let interval: number;
    if (activeSession?.isRunning && !activeSession?.isPaused) {
      interval = window.setInterval(async () => {
        // Stop automatically if duration reached
        if (activeSession.elapsedSeconds >= activeSession.config.durationMinutes * 60) {
          stopSession('Completed successfully via duration limit');
          return;
        }

        const url = useStore.getState().deviceUrl;
        const elapsed = activeSession.elapsedSeconds + 1;

        if (pairedDeviceId === 'ESP32-Network-Device' && url) {
          try {
            // Attempt to fetch real telemetry data from the ESP32
            // Example Arduino JSON: {"curr1": 500, "curr2": 1500, "pos1": 135, "pos2": 200, "load1": 10, "load2": 45}
            const res = await fetch(`${url}/api/status`, { signal: AbortSignal.timeout(1500) });
            if (res.ok) {
              const data = await res.json();
              setDeviceTelemetry(data);
              setDeviceError(null);
              // Calculate metrics based on sensor readings
              // Use Torque or Load for grip force
              const grip = data.load1 !== undefined ? data.load1 : (Math.random() * 5 + 10);
              
              // Use servo 2 (Flexion) position mapped to 0-100% flexion
              // Assuming 0 is full extension and 270 is full flexion based on Arduino code
              const pos2 = data.pos2 !== undefined ? data.pos2 : 135;
              const flexVal = Math.min(100, Math.max(0, (pos2 / 270) * 100));
              
              // Apply base flex to all fingers
              const flex = [flexVal, flexVal, flexVal, flexVal, flexVal];
              
              updateSessionTick(elapsed, grip, flex);
              return; // Skip the mock generation if successful
            } else {
               setDeviceError(`Device returned status ${res.status}. Check API endpoint.`);
            }
          } catch(e) {
            // Silently fall back to simulation if the device drops
            setDeviceTelemetry(null);
            setDeviceError(`Network connection to device lost. Ensure it is powered on and connected.`);
          }
        }

        // Simulate varying grip and flex (Mock Fallback)
        setDeviceTelemetry(null);
        const grip = 10 + Math.random() * 20 + Math.sin(elapsed / 5) * 5;
        const intensityScale = activeSession.config.speedPercentage / 100;
        const overreach = 5 * intensityScale; // Allow slight exceed based on intensity
        const flex = [
           Math.abs(Math.sin(elapsed / 3) * (activeSession.config.romLimits.thumb + overreach)),
           Math.abs(Math.sin(elapsed / 3.2) * (activeSession.config.romLimits.index + overreach)),
           Math.abs(Math.sin(elapsed / 3.3) * (activeSession.config.romLimits.middle + overreach)),
           Math.abs(Math.sin(elapsed / 3.4) * (activeSession.config.romLimits.ring + overreach)),
           Math.abs(Math.sin(elapsed / 3.5) * (activeSession.config.romLimits.pinky + overreach)),
        ];
        updateSessionTick(elapsed, grip, flex);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession, pairedDeviceId, updateSessionTick, stopSession]);

  useEffect(() => {
    if (activeSession?.isRunning && !activeSession?.isPaused) {
      const map = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const;
      let newlyApproached = false;
      
      const currentApproaching = activeSession.currentFlex.map((current, index) => {
         const limit = activeSession.config.romLimits[map[index]];
         return current >= limit * 0.95;
      });

      currentApproaching.forEach((isAppr, index) => {
         if (isAppr && !previousApproachingRef.current[index]) {
            newlyApproached = true;
         }
      });
      
      if (newlyApproached) {
         playWarningBeep();
      }
      
      previousApproachingRef.current = currentApproaching;
    } else {
      previousApproachingRef.current = Array(5).fill(false);
    }
  }, [activeSession?.currentFlex, activeSession?.isRunning, activeSession?.isPaused]);

  useEffect(() => {
    if (activeSession?.isRunning && !activeSession?.isPaused) {
      setChartData(prev => {
        const avgFlex = activeSession.currentFlex.reduce((a, b) => a + b, 0) / 5;
        const newData = {
          time: `${Math.floor(activeSession.elapsedSeconds / 60).toString().padStart(2, '0')}:${(activeSession.elapsedSeconds % 60).toString().padStart(2, '0')}`,
          grip: activeSession.currentGripForce,
          flex: avgFlex,
          thumb: activeSession.currentFlex[0],
          index: activeSession.currentFlex[1],
          middle: activeSession.currentFlex[2],
          ring: activeSession.currentFlex[3],
          pinky: activeSession.currentFlex[4]
        };
        const next = [...prev, newData];
        if (next.length > 30) return next.slice(next.length - 30);
        return next;
      });
    } else if (!activeSession?.isRunning) {
      setChartData([]);
    }
  }, [activeSession?.elapsedSeconds, activeSession?.isRunning, activeSession?.isPaused]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Remote Session Control</h1>
          <p className="text-muted-foreground">Configure and monitor live physical therapy sessions.</p>
        </div>
        <div className="flex gap-2 items-center">
            {pairedDeviceId === 'ESP32-Network-Device' && (
              <Button size="sm" variant="outline" className="h-8" onClick={async () => {
                const url = useStore.getState().deviceUrl;
                try {
                   await fetch(`${url}/api/init`, { method: 'POST', signal: AbortSignal.timeout(2000) });
                   alert("Initialization command sent to device.");
                } catch(e) {
                   alert("Failed to initialize device.");
                }
              }}>Initialize Servos</Button>
            )}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${pairedDeviceId ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (pairingDevice ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' : 'bg-secondary text-muted-foreground')}`}>
               {pairingDevice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
               {pairedDeviceId ? `Cloud Connected: ${pairedDeviceId}` : (pairingDevice ? 'Attempting to link device...' : 'IoT Disconnected')}
            </div>
            {!pairedDeviceId && (
               <Button size="sm" onClick={connectDevice} disabled={pairingDevice}>
                 {pairingDevice ? (
                    <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Linking...
                    </>
                 ) : 'Link Remote Node'}
               </Button>
            )}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Controls Configuration */}
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Session Configuration</CardTitle>
              <div className="flex gap-1">
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={historyIndex === 0}>
                   <Undo className="h-4 w-4" />
                 </Button>
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRedo} disabled={historyIndex === configHistory.length - 1}>
                   <Redo className="h-4 w-4" />
                 </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>Select Patient</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  disabled={activeSession?.isRunning}
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.diagnosis}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-4">
                   <div className="flex justify-between"><Label>Duration (Minutes)</Label><span className="text-sm text-muted-foreground">{sessionConfig.durationMinutes}m</span></div>
                  <Slider min={1} max={60} step={1} value={[sessionConfig.durationMinutes]} onValueChange={([val]) => handleConfigChange({...sessionConfig, durationMinutes: val})} disabled={activeSession?.isRunning} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between"><Label>Speed / Intensity</Label><span className="text-sm text-muted-foreground">{sessionConfig.speedPercentage}%</span></div>
                  <Slider min={10} max={100} step={10} value={[sessionConfig.speedPercentage]} onValueChange={([val]) => {
                     handleConfigChange({...sessionConfig, speedPercentage: val});
                  }} />
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Gentle</span><span>Moderate</span><span>Intensive</span></div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between"><Label>Resistance Level</Label><span className="text-sm text-muted-foreground">{sessionConfig.resistanceLevel}</span></div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[sessionConfig.resistanceLevel]}
                    onValueChange={([val]) => {
                       handleConfigChange({...sessionConfig, resistanceLevel: val});
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Light</span><span>Heavy</span></div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label>Range of Motion Limits (Degrees)</Label>
                  {['thumb', 'index', 'middle', 'ring', 'pinky'].map((finger) => (
                    <div key={finger} className="space-y-2">
                       <div className="flex justify-between">
                         <span className="text-xs font-medium capitalize text-muted-foreground">{finger}</span>
                         <span className="text-xs text-muted-foreground">{sessionConfig.romLimits[finger as keyof typeof sessionConfig.romLimits]}°</span>
                       </div>
                       <Slider
                         min={0}
                         max={90}
                         step={1}
                         value={[sessionConfig.romLimits[finger as keyof typeof sessionConfig.romLimits]]}
                         onValueChange={([val]) => {
                           handleConfigChange({
                             ...sessionConfig, 
                             romLimits: { ...sessionConfig.romLimits, [finger]: val }
                           });
                         }}
                       />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
               {!activeSession?.isRunning ? (
                 <Button className="w-full text-lg h-14" disabled={!selectedPatientId || !pairedDeviceId} onClick={handleStart}>
                   <PlayCircle className="w-6 h-6 mr-2" /> Start Session
                 </Button>
               ) : (
                 <div className="flex flex-col gap-2">
                   <div className="flex gap-2">
                     <Button variant={activeSession.isPaused ? "default" : "outline"} className="flex-1 h-14" onClick={activeSession.isPaused ? () => useStore.getState().resumeSession() : pauseSession}>
                       {activeSession.isPaused ? <PlayCircle className="w-5 h-5 mr-2" /> : <PauseCircle className="w-5 h-5 mr-2" />}
                       {activeSession.isPaused ? 'Resume' : 'Pause'}
                     </Button>
                     <Button variant="outline" className="flex-1 h-14 border-destructive text-destructive hover:bg-destructive/10" onClick={() => stopSession()}>
                       <Square className="w-5 h-5 mr-2" /> Stop
                     </Button>
                   </div>
                   {pairedDeviceId === 'ESP32-Network-Device' && (
                     <Button variant="destructive" className="w-full h-12 mt-2" onClick={() => useStore.getState().emergencyStop()}>
                       <AlertTriangle className="w-5 h-5 mr-2" /> EMERGENCY STOP
                     </Button>
                   )}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Live Monitoring */}
        <div className="md:col-span-7 space-y-6">
          <Card className="h-full min-h-[400px]">
            <CardHeader className="border-b bg-muted ">
               <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Live Observation Panel</CardTitle>
                    <CardDescription>{selectedPatient ? selectedPatient.name : 'No patient selected'}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="relative flex h-3 w-3">
                        {activeSession?.isRunning && !activeSession?.isPaused && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${activeSession?.isRunning ? (activeSession.isPaused ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-300 '}`}></span>
                     </span>
                     <span className="text-sm font-medium uppercase text-muted-foreground">
                       {activeSession?.isRunning ? (activeSession.isPaused ? 'Paused' : 'Running') : 'Idle'}
                     </span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
               {activeSession?.isRunning ? (
                 <div className="w-full space-y-8">
                    {deviceError && pairedDeviceId === 'ESP32-Network-Device' && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
                         <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
                         <div>
                            <p className="font-semibold text-sm">Device Communication Issue</p>
                            <p className="text-sm mt-1">{deviceError} Currently falling back to simulation parameters.</p>
                         </div>
                      </div>
                    )}
                    {deviceTelemetry?.overload && (
                      <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse">
                         <AlertTriangle className="w-6 h-6" />
                         DEVICE OVERLOAD DETECTED - PLEASE STOP SESSION
                      </div>
                    )}
                    {/* Metrics UI simulated */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-secondary  p-4 rounded-xl text-center">
                          <div className="text-sm text-muted-foreground mb-1">Elapsed Time</div>
                          <div className="text-3xl font-mono text-slate-800">{Math.floor(activeSession.elapsedSeconds / 60).toString().padStart(2, '0')}:{(activeSession.elapsedSeconds % 60).toString().padStart(2, '0')}</div>
                       </div>
                       <div className="bg-secondary  p-4 rounded-xl text-center">
                          <div className="text-sm text-muted-foreground mb-1">Resistance</div>
                          <div className="text-3xl font-mono text-indigo-600">Lvl {activeSession.config.resistanceLevel}</div>
                       </div>
                       <div className="bg-secondary  p-4 rounded-xl text-center">
                          <div className="text-sm text-muted-foreground mb-1">Grip Force (Load)</div>
                          <div className="text-3xl font-mono text-slate-800">{activeSession.currentGripForce.toFixed(1)} N</div>
                       </div>
                       <div className="bg-secondary  p-4 rounded-xl text-center">
                          <div className="text-sm text-muted-foreground mb-1">System Voltage</div>
                          <div className="text-3xl font-mono text-amber-600">{deviceTelemetry?.volt !== undefined ? `${deviceTelemetry.volt.toFixed(1)}` : '--'}<span className="text-sm ml-1 text-muted-foreground">V</span></div>
                       </div>
                       <div className="bg-secondary  p-4 rounded-xl text-center flex flex-col justify-center">
                          <div className="text-sm text-muted-foreground mb-1">Motor Currents</div>
                          <div className="flex justify-center gap-4">
                            <div><span className="text-xs text-muted-foreground">M1:</span> <span className="font-mono text-blue-600">{deviceTelemetry?.curr1 !== undefined ? `${deviceTelemetry.curr1.toFixed(0)}` : '--'}mA</span></div>
                            <div><span className="text-xs text-muted-foreground">M2:</span> <span className="font-mono text-emerald-600">{deviceTelemetry?.curr2 !== undefined ? `${deviceTelemetry.curr2.toFixed(0)}` : '--'}mA</span></div>
                          </div>
                       </div>
                       <div className="bg-secondary  p-4 rounded-xl text-center flex flex-col justify-center">
                          <div className="text-sm text-muted-foreground mb-1">Motor Positions</div>
                          <div className="flex justify-center gap-4">
                            <div><span className="text-xs text-muted-foreground">P1:</span> <span className="font-mono text-blue-600">{deviceTelemetry?.pos1 !== undefined ? `${deviceTelemetry.pos1.toFixed(0)}` : '--'}°</span></div>
                            <div><span className="text-xs text-muted-foreground">P2:</span> <span className="font-mono text-emerald-600">{deviceTelemetry?.pos2 !== undefined ? `${deviceTelemetry.pos2.toFixed(0)}` : '--'}°</span></div>
                          </div>
                       </div>
                       <div className="bg-secondary  p-4 rounded-xl text-center">
                          <div className="text-sm text-muted-foreground mb-1">Avg Flexion</div>
                          <div className="text-3xl font-mono text-purple-600">{(activeSession.currentFlex.reduce((a, b) => a + b, 0) / 5).toFixed(0)}<span className="text-sm ml-1 text-muted-foreground">%</span></div>
                       </div>
                    </div>
                    {/* Simulated hand flex display */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                         <h4 className="text-center font-medium">Finger Flexion Range</h4>
                         {activeSession.currentFlex.some((val, i) => {
                            const map = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const;
                            return val >= activeSession.config.romLimits[map[i]] * 0.95;
                         }) && (
                           <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full dark:bg-amber-950/50">
                             <AlertTriangle className="w-3 h-3 mr-1" /> ROM Limit Warning
                           </span>
                         )}
                      </div>
                      <div className="flex flex-col gap-4 mt-6">
                        {['Thumb','Index','Middle','Ring','Pinky'].map((finger, i) => {
                           const limit = activeSession.config.romLimits[finger.toLowerCase() as keyof typeof activeSession.config.romLimits];
                           const current = activeSession.currentFlex[i];
                           const isApproaching = current >= limit * 0.95;
                           const limitExceeded = current > limit;
                           const bgColorClass = limitExceeded ? 'bg-destructive' : (isApproaching ? 'bg-amber-500' : 'bg-primary');
                           
                           return (
                             <div key={finger} className="flex items-center gap-4 border p-3 rounded-xl bg-slate-50/50">
                                <div className="w-16 text-right">
                                   <span className={`text-sm font-medium ${limitExceeded ? 'text-destructive font-bold' : (isApproaching ? 'text-amber-500 font-bold' : '')}`}>{finger}</span>
                                </div>
                                
                                <div className="flex-1 space-y-1.5">
                                   <div className="flex justify-between text-xs">
                                     <span className="font-mono font-medium">{current.toFixed(0)}°</span>
                                     <span className="text-muted-foreground font-mono">Limit: {limit}°</span>
                                   </div>
                                   <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden">
                                      <div className={`absolute top-0 left-0 h-full transition-all duration-300 ${bgColorClass}`} style={{ width: `${Math.min(100, current / 100 * 100)}%` }}></div>
                                      {/* Limit Marker */}
                                      <div className="absolute top-0 bottom-0 w-1 bg-black/30 z-10" style={{ left: `${limit}%` }}></div>
                                   </div>
                                </div>

                                <div className="h-10 w-24 opacity-70">
                                    <ResponsiveContainer width="100%" height="100%">
                                       <LineChart data={chartData.slice(-15)}>
                                           <YAxis domain={[0, 100]} hide />
                                           <Line type="monotone" dataKey={finger.toLowerCase()} stroke={limitExceeded ? '#ef4444' : (isApproaching ? '#f59e0b' : '#3b82f6')} strokeWidth={2} dot={false} isAnimationActive={false} />
                                       </LineChart>
                                    </ResponsiveContainer>
                                </div>
                             </div>
                           );
                        })}
                      </div>
                    </div>
                    {/* Real-time Telemetry Graph */}
                    <div className="mt-8 border-t pt-8">
                       <h4 className="text-center font-medium mb-4">Live Telemetry</h4>
                       <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} minTickGap={20} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 50]} />
                                <Tooltip
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="flex" name="Avg Flexion (%)" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} isAnimationActive={false} />
                                <Line yAxisId="right" type="stepAfter" dataKey="grip" name="Grip Force (N)" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} isAnimationActive={false} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center space-y-4 text-muted-foreground">
                    <Activity className="w-16 h-16 mx-auto opacity-20" />
                    <p>Session is currently idle.<br/>Select a patient and configure settings to start.</p>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
