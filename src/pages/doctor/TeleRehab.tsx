import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/components";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MonitorUp, PhoneCall } from "lucide-react";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function DoctorTeleRehab() {
  const {
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoMuted,
    isConnected,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useWebRTC("demo-rehab-room");
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tele-Rehab Consultation</h1>
        <p className="text-muted-foreground">Conduct remote video consultations with your patients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden bg-slate-900 border-0 flex flex-col relative aspect-video">
            <div className="flex-1 flex justify-center items-center relative overflow-hidden">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!isConnected && (
                <span className="text-slate-500 font-medium tracking-widest uppercase z-10">
                  Waiting for patient to join...
                </span>
              )}
            </div>
            
            {/* Self View (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-48 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl flex justify-center items-center">
               <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
               />
               {!localVideoRef.current?.srcObject && <span className="text-slate-500 text-xs font-medium z-10">Doctor Camera</span>}
               {isVideoMuted && <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center backdrop-blur-sm z-20"><VideoOff className="w-5 h-5 text-slate-400" /></div>}
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl z-20">
              <Button 
                size="icon" 
                variant={isAudioMuted ? "destructive" : "secondary"} 
                className="rounded-full"
                onClick={toggleAudio}
              >
                {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button 
                size="icon" 
                variant={isVideoMuted ? "destructive" : "secondary"} 
                className="rounded-full"
                onClick={toggleVideo}
              >
                {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full">
                <MonitorUp className="w-4 h-4" />
              </Button>
              <Button variant="destructive" className="rounded-full px-6 font-bold" onClick={endCall}>
                <PhoneOff className="w-4 h-4 mr-2" /> End
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
             <CardHeader>
               <CardTitle>Session Details</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-sm">
                <div className="space-y-1">
                   <div className="text-slate-500">Patient</div>
                   <div className="font-medium">Please select a patient</div>
                </div>
                <div className="space-y-1">
                   <div className="text-slate-500">Status</div>
                   <div className="font-medium">
                     {isConnected ? (
                        <span className="text-emerald-500 font-bold">Connected</span>
                     ) : (
                        <span className="text-amber-500 font-bold">Waiting...</span>
                     )}
                   </div>
                </div>
                <Button className="w-full mt-4" onClick={startCall} disabled={isConnected}>
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Start Call
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
