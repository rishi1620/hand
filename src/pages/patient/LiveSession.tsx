import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { AlertTriangle, Activity, Bluetooth, Wifi } from 'lucide-react';
import { localizeNumber } from '@/lib/utils';

export default function PatientLiveSession() {
  const { activeSession, pairedDeviceId, connectDevice, deviceUrl, setDeviceUrl, pairingDevice, pairingStatus, language } = useStore();
  const [deviceTelemetry, setDeviceTelemetry] = useState<any>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [showWifiConnect, setShowWifiConnect] = useState(false);
  const [localDeviceUrl, setLocalDeviceUrl] = useState(deviceUrl);

  const FINGERS_EN = ['Thumb','Index','Middle','Ring','Pinky'];
  const FINGERS_BN = ['বৃদ্ধাঙ্গুলি','তর্জনী','মধ্যমা','অনামিকা','কনিষ্ঠা'];
  const fingers = language === 'en' ? FINGERS_EN : FINGERS_BN;

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
              setDeviceError(language === 'en' ? `Device error: ${res.status}` : `ডিভাইস ত্রুটি: ${res.status}`);
            }
          } catch(e) {
            setDeviceError(language === 'en' ? 'Network connection to device lost' : 'ডিভাইসে নেটওয়ার্ক সংযোগ বিচ্ছিন্ন হয়েছে');
          }
        } else {
           setDeviceTelemetry(null);
        }
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [activeSession?.isRunning, activeSession?.isPaused, pairedDeviceId, deviceUrl, language]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{language === 'en' ? 'Live Session' : 'লাইভ সেশন'}</h1>
          <p className="text-muted-foreground">{language === 'en' ? 'Follow along with your remote physiotherapy session.' : 'আপনার রিমোট ফিজিওথেরাপি সেশন অনুসরণ করুন।'}</p>
        </div>
        <div className="flex gap-2 items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${pairedDeviceId ? 'bg-emerald-50 text-emerald-700 border-emerald-200  ' : 'bg-secondary text-muted-foreground  '}`}>
               <Bluetooth className="w-4 h-4" />
               {pairedDeviceId ? (language === 'en' ? `Local Device: ${pairedDeviceId}` : `লোকাল ডিভাইস: ${pairedDeviceId}`) : (language === 'en' ? 'Disconnected' : 'ডিভাইস বিচ্ছিন্ন')}
               {pairedDeviceId && <Wifi className="w-4 h-4 ml-1 opacity-70" />}
            </div>
            {!pairedDeviceId && (
               <div className="flex flex-col items-end gap-2 relative">
                 {pairingDevice ? (
                   <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border rounded-lg text-sm text-slate-600">
                     <Activity className="w-4 h-4 animate-spin text-blue-600" />
                     <span className="font-medium animate-pulse">{pairingStatus || (language === 'en' ? 'Connecting...' : 'সংযোগ করা হচ্ছে...')}</span>
                   </div>
                 ) : (
                   <>
                     <div className="flex gap-2">
                       <Button size="sm" variant="outline" onClick={connectDevice}><Bluetooth className="w-4 h-4 mr-2" /> <span>{language === 'en' ? 'Pair Bluetooth' : 'ব্লুটুথ যুক্ত করুন'}</span></Button>
                       <Button size="sm" onClick={() => setShowWifiConnect(true)}><Wifi className="w-4 h-4 mr-2" /> {language === 'en' ? 'Connect with Device Wifi' : 'ডিভাইস ওয়াইফাই দিয়ে সংযুক্ত করুন'}</Button>
                     </div>
                     {showWifiConnect && (
                       <div className="absolute top-12 right-0 w-72 bg-white border border-slate-200 shadow-xl p-4 rounded-xl z-50 animate-in fade-in slide-in-from-top-2">
                          <h4 className="font-semibold text-sm mb-2">{language === 'en' ? 'Connect to Wi-Fi Device' : 'ওয়াইফাই ডিভাইসে সংযোগ করুন'}</h4>
                          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{language === 'en' ? "Ensure your computer or phone is connected to the HandRehab device's local Wi-Fi hotspot." : 'নিশ্চিত করুন যে আপনার কম্পিউটার বা ফোন হ্যান্ডরিহ্যাব ডিভাইসের স্থানীয় ওয়াই-ফাই হটস্পটের সাখে যুক্ত আছে।'}</p>
                          <div className="space-y-3">
                             <div className="space-y-1.5">
                               <Label className="text-xs font-medium">{language === 'en' ? 'Device IP Address' : 'ডিভাইসের আইপি ঠিকানা'}</Label>
                               <Input 
                                 value={localDeviceUrl} 
                                 onChange={e => setLocalDeviceUrl(e.target.value)} 
                                 placeholder="http://192.168.4.1"
                                 className="h-8 text-sm"
                               />
                             </div>
                             <div className="flex justify-end gap-2 pt-1">
                               <Button size="sm" variant="ghost" onClick={() => setShowWifiConnect(false)}>{language === 'en' ? 'Cancel' : 'বাতিল'}</Button>
                               <Button size="sm" onClick={() => {
                                 setDeviceUrl(localDeviceUrl);
                                 connectDevice();
                                 setShowWifiConnect(false);
                               }}>{language === 'en' ? 'Connect' : 'সংযোগ করুন'}</Button>
                             </div>
                          </div>
                       </div>
                     )}
                   </>
                 )}
               </div>
            )}
        </div>
      </div>

      {!activeSession?.isRunning ? (
        <Card className="min-h-[400px] flex items-center justify-center border-dashed">
          <CardContent className="text-center space-y-4 pt-6">
            <Activity className="w-16 h-16 mx-auto text-muted-foreground opacity-30 animate-pulse" />
            <h2 className="text-2xl font-semibold">{language === 'en' ? 'Waiting for Doctor' : 'ডাক্তারের জন্য অপেক্ষা করছি'}</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {language === 'en' ? 'Please ensure your device is powered on and connected. Your doctor will start the session remotely when they are ready.' : 'অনুগ্রহ করে নিশ্চিত করুন যে আপনার ডিভাইস চালু এবং সংযুক্ত। আপনার ডাক্তার প্রস্তুত হলে দূরবর্তীভাবে সেশন শুরু করবেন।'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {deviceError && pairedDeviceId === 'ESP32-Network-Device' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
               <div>
                  <p className="font-semibold text-sm">{language === 'en' ? 'Device Connection Interrupted' : 'ডিভাইস সংযোগ বিঘ্নিত'}</p>
                  <p className="text-sm mt-1">{deviceError}. {language === 'en' ? 'The session will resume when the connection is restored.' : 'সংযোগ পুনরায় স্থাপিত হলে সেশন আবার শুরু হবে।'}</p>
               </div>
            </div>
          )}

          {deviceTelemetry?.overload && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse">
               <AlertTriangle className="w-6 h-6" />
               {language === 'en' ? 'DEVICE OVERLOAD DETECTED - PLEASE RELAX HAND' : 'ডিভাইস ওভারলোড শনাক্ত করা হয়েছে - হাত রিল্যাক্স করুন'}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">{language === 'en' ? 'Session Target' : 'সেশনের লক্ষ্য'}</div>
                <div className="text-2xl font-bold">{localizeNumber(activeSession.config.durationMinutes, language)} {language === 'en' ? 'min' : 'মিনিট'}</div>
             </div>
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">{language === 'en' ? 'Grip Force (Load)' : 'গ্রিপ ফোর্স (লোড)'}</div>
                <div className="text-2xl font-bold">
                   {localizeNumber(deviceTelemetry?.load1 !== undefined ? deviceTelemetry.load1.toFixed(1) : activeSession.currentGripForce.toFixed(1), language)} <span className="text-sm font-normal text-muted-foreground">{language === 'en' ? 'N' : 'নি.'}</span>
                </div>
             </div>
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">{language === 'en' ? 'System Voltage' : 'সিস্টেম ভোল্টেজ'}</div>
                <div className="text-2xl font-bold text-amber-600">
                   {deviceTelemetry?.volt !== undefined ? localizeNumber(deviceTelemetry.volt.toFixed(1), language) : '--'} <span className="text-sm font-normal text-muted-foreground">{language === 'en' ? 'V' : 'ভি'}</span>
                </div>
             </div>
             <div className="bg-white border p-4 rounded-xl text-center">
                <div className="text-sm text-muted-foreground mb-1">{language === 'en' ? 'Current Draw' : 'কারেন্ট ড্র'}</div>
                <div className="flex justify-center gap-4 text-lg font-bold">
                  <div><span className="text-blue-600">{deviceTelemetry?.curr1 !== undefined ? localizeNumber(deviceTelemetry.curr1.toFixed(0), language) : '--'}</span><span className="text-xs font-normal text-muted-foreground">{language === 'en' ? 'mA' : 'মিলি অ্যা.'}</span></div>
                  <div><span className="text-emerald-600">{deviceTelemetry?.curr2 !== undefined ? localizeNumber(deviceTelemetry.curr2.toFixed(0), language) : '--'}</span><span className="text-xs font-normal text-muted-foreground">{language === 'en' ? 'mA' : 'মিলি অ্যা.'}</span></div>
                </div>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
               <Card className="bg-primary text-primary-foreground border-none">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-primary-foreground/90 font-medium text-sm flex items-center justify-between">
                      {language === 'en' ? 'Session Active' : 'সেশন সক্রিয়'}
                      {activeSession.isPaused ? (
                         <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-100">{language === 'en' ? 'Paused' : 'স্থগিত'}</span>
                      ) : (
                         <span className="px-2 py-0.5 rounded text-xs bg-black/20 animate-pulse text-white">{language === 'en' ? 'Live' : 'লাইভ'}</span>
                      )}
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-5xl font-mono font-bold">
                      {localizeNumber(Math.floor(activeSession.elapsedSeconds / 60).toString().padStart(2, '0'), language)}:{localizeNumber((activeSession.elapsedSeconds % 60).toString().padStart(2, '0'), language)}
                   </div>
                   <div className="mt-4 flex flex-col gap-1 text-sm text-primary-foreground/80">
                      <div className="flex justify-between"><span>{language === 'en' ? 'Speed:' : 'গতি:'}</span> <span>{localizeNumber(activeSession.config.speedPercentage, language)}%</span></div>
                      <div className="flex justify-between"><span>{language === 'en' ? 'Resistance:' : 'প্রতিরোধ:'}</span> <span>{language === 'en' ? 'Level' : 'লেভেল'} {localizeNumber(activeSession.config.resistanceLevel, language)}</span></div>
                   </div>
                 </CardContent>
               </Card>

               <Card className="border-red-200 bg-red-50 ">
                 <CardContent className="p-4">
                    <Button variant="destructive" className="w-full gap-2 h-14 text-lg">
                       <AlertTriangle className="w-5 h-5" /> {language === 'en' ? 'Request Pause' : 'বিরতির অনুরোধ করুন'}
                    </Button>
                    <p className="text-xs text-center mt-2 text-red-600 ">{language === 'en' ? 'Alerts your doctor immediately.' : 'আপনার ডাক্তারকে অবিলম্বে সতর্ক করে।'}</p>
                 </CardContent>
               </Card>
            </div>

            <Card className="md:col-span-2">
              <CardHeader>
                 <CardTitle>{language === 'en' ? 'Range of Motion' : 'গতির পরিসর'}</CardTitle>
                 <CardDescription>{language === 'en' ? 'Live feedback from your device sensors' : 'আপনার ডিভাইস সেন্সর থেকে লাইভ ফিডব্যাক'}</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex justify-evenly items-end h-64 gap-4 mt-8">
                    {fingers.map((finger, i) => {
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
                               {localizeNumber(Math.round(heightPercentage), language)}°
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
