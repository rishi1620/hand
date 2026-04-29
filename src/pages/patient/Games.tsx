import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/components";
import { Button } from "@/components/ui/button";
import { PlayCircle, Target, Trophy, Flame } from "lucide-react";

export default function PatientGames() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gamified Exercises</h1>
        <p className="text-muted-foreground">Make your rehabilitation fun and engaging with interactive games.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-blue-500 transition-colors group cursor-pointer overflow-hidden flex flex-col">
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 h-32 flex items-center justify-center p-6 relative overflow-hidden">
             <Target className="w-16 h-16 text-white/20 absolute -right-4 -bottom-4 transform rotate-12 scale-150 transition-transform group-hover:scale-110" />
             <Trophy className="w-12 h-12 text-white z-10" />
          </div>
          <CardHeader>
            <CardTitle>Grip & Catch</CardTitle>
            <CardDescription>Squeeze the device to catch falling objects to improve reaction time and peak force.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <div className="flex justify-between items-center text-sm mb-4 text-slate-500">
               <span className="flex items-center"><Flame className="w-4 h-4 mr-1 text-orange-500" /> High Score: 1240</span>
               <span>Level: 3</span>
             </div>
             <Button className="w-full gap-2">
               <PlayCircle className="w-4 h-4" /> Play Now
             </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-500 transition-colors group cursor-pointer overflow-hidden flex flex-col">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-600 h-32 flex items-center justify-center p-6 relative overflow-hidden">
             <PlayCircle className="w-16 h-16 text-white/20 absolute -right-4 -bottom-4 transform rotate-12 scale-150 transition-transform group-hover:scale-110" />
             <Target className="w-12 h-12 text-white z-10" />
          </div>
          <CardHeader>
            <CardTitle>Steady Hold</CardTitle>
            <CardDescription>Maintain a constant grip force within the target zone to keep the spaceship flying straight.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <div className="flex justify-between items-center text-sm mb-4 text-slate-500">
               <span className="flex items-center"><Flame className="w-4 h-4 mr-1 text-orange-500" /> High Score: 45s</span>
               <span>Level: 1</span>
             </div>
             <Button className="w-full gap-2">
               <PlayCircle className="w-4 h-4" /> Play Now
             </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-500 transition-colors group cursor-pointer overflow-hidden flex flex-col border-dashed opacity-70">
          <div className="bg-slate-100 h-32 flex items-center justify-center p-6 relative overflow-hidden">
             <span className="font-bold text-slate-400">Coming Soon</span>
          </div>
          <CardHeader>
            <CardTitle className="text-slate-500">Rhythm Flex</CardTitle>
            <CardDescription>Flex your fingers to the beat of the music to improve coordination.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <Button variant="secondary" className="w-full gap-2" disabled>
               Locked
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
