import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/components";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MonitorUp } from "lucide-react";
import { useState } from "react";

export default function PatientTeleRehab() {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tele-Rehab Consultation</h1>
        <p className="text-muted-foreground">Connect with your doctor for a guided session.</p>
      </div>

      <Card className="overflow-hidden bg-slate-900 border-0 flex flex-col relative aspect-video shadow-2xl">
        <div className="flex-1 flex justify-center items-center">
          <span className="text-slate-500 font-medium tracking-widest uppercase">Waiting for doctor to initiate...</span>
        </div>
        
        {/* Self View (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-32 md:w-48 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl flex justify-center items-center">
           <span className="text-slate-500 text-xs font-medium">Your Camera</span>
           {isVideoMuted && <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center backdrop-blur-sm"><VideoOff className="w-5 h-5 text-slate-400" /></div>}
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl">
          <Button 
            size="icon" 
            variant={isAudioMuted ? "destructive" : "secondary"} 
            className="rounded-full"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
          >
            {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button 
            size="icon" 
            variant={isVideoMuted ? "destructive" : "secondary"} 
            className="rounded-full"
            onClick={() => setIsVideoMuted(!isVideoMuted)}
          >
            {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </Button>
          <Button variant="destructive" className="rounded-full px-6 font-bold" onClick={() => window.history.back()}>
            <PhoneOff className="w-4 h-4 mr-2" /> Leave
          </Button>
        </div>
      </Card>
    </div>
  );
}
