import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/components";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MonitorUp } from "lucide-react";
import { useStore } from "@/store";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function PatientTeleRehab() {
  const { language } = useStore();
  const {
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoMuted,
    isConnected,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useWebRTC("demo-rehab-room");
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{language === 'en' ? 'Tele-Rehab Consultation' : 'টেলি-রিহ্যাব পরামর্শ'}</h1>
        <p className="text-muted-foreground">{language === 'en' ? 'Connect with your doctor for a guided session.' : 'একটি নির্দেশিত সেশনের জন্য আপনার ডাক্তারের সাথে সংযুক্ত হন।'}</p>
      </div>

      <Card className="overflow-hidden bg-slate-900 border-0 flex flex-col relative aspect-video shadow-2xl">
        <div className="flex-1 flex justify-center items-center relative overflow-hidden">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!isConnected && (
            <span className="text-slate-500 font-medium tracking-widest uppercase z-10 text-center px-4">
              {language === 'en' ? 'Waiting for doctor to initiate...' : 'ডাক্তার শুরু করার জন্য অপেক্ষা করা হচ্ছে...'}
            </span>
          )}
        </div>
        
        {/* Self View (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-32 md:w-48 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl flex justify-center items-center">
           <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
           />
           {!localVideoRef.current?.srcObject && <span className="text-slate-500 text-xs font-medium z-10">{language === 'en' ? 'Your Camera' : 'আপনার ক্যামেরা'}</span>}
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
          <Button variant="destructive" className="rounded-full px-6 font-bold" onClick={() => { endCall(); window.history.back(); }}>
            <PhoneOff className="w-4 h-4 mr-2" /> {language === 'en' ? 'Leave' : 'ত্যাগ করুন'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

