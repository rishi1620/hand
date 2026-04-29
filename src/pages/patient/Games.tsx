import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/components";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlayCircle, Target, Trophy, Flame, Keyboard } from "lucide-react";

export default function PatientGames() {
  const [activeGame, setActiveGame] = useState<'grip' | 'steady' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gripForce, setGripForce] = useState(0);

  // Simulate grip decay (spring-back)
  useEffect(() => {
    if (!activeGame) return;
    const interval = setInterval(() => {
      setGripForce(prev => Math.max(0, prev - 5));
    }, 100);
    return () => clearInterval(interval);
  }, [activeGame]);

  // Game timer & scoring loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const tick = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
      
      if (activeGame === 'steady') {
        setGripForce(force => {
          // Target zone between 40 and 60
          if (force >= 40 && force <= 60) setScore(s => s + 10);
          return force;
        });
      }
    }, 1000);
    
    return () => clearInterval(tick);
  }, [isPlaying, activeGame]);

  // Keyboard support for simulating device squeeze
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && isPlaying) {
      e.preventDefault();
      setGripForce(prev => {
        const newForce = Math.min(100, prev + 25); // Jump up 25% on space
        if (activeGame === 'grip' && prev < 80 && newForce >= 80) {
          setScore(s => s + 50);
        }
        return newForce;
      });
    }
  }, [activeGame, isPlaying]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startGame = (type: 'grip' | 'steady') => {
    setActiveGame(type);
    setScore(0);
    setTimeLeft(30);
    setGripForce(0);
    setIsPlaying(true);
  };

  const closeGame = () => {
    setActiveGame(null);
    setIsPlaying(false);
  };

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
             <Button className="w-full gap-2" onClick={() => startGame('grip')}>
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
             <Button className="w-full gap-2" onClick={() => startGame('steady')}>
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

      <Dialog open={activeGame !== null} onOpenChange={(open) => !open && closeGame()}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {activeGame === 'grip' ? 'Grip & Catch' : 'Steady Hold'}
            </DialogTitle>
            <DialogDescription>
              {isPlaying 
                ? "Interactive Simulation Mode running." 
                : "Session Completed!"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="flex justify-between text-lg font-bold px-2">
              <div className="text-blue-600 tabular-nums">Time: {timeLeft}s</div>
              <div className="text-emerald-600 tabular-nums">Score: {score}</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-500 px-1">
                 <span>Simulated Grip Force</span>
                 <span className="tabular-nums">{gripForce}%</span>
              </div>
              <div className="h-10 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200 shadow-inner">
                {activeGame === 'steady' && (
                  <div className="absolute top-0 bottom-0 left-[40%] w-[20%] bg-emerald-200/60 z-0 border-x border-emerald-300" />
                )}
                {activeGame === 'grip' && (
                  <div className="absolute top-0 bottom-0 left-[80%] w-[20%] bg-blue-200/60 z-0 border-l border-blue-300" />
                )}
                <div 
                  className={`h-full transition-all duration-75 z-10 relative ${
                     gripForce >= 80 ? 'bg-indigo-500' : 
                     gripForce >= 40 ? 'bg-blue-500' : 'bg-blue-400'
                  }`}
                  style={{ width: `${gripForce}%` }}
                />
              </div>
              
              {activeGame === 'steady' && (
                <p className="text-xs text-slate-500 font-medium">Keep the bar inside the light green zone!</p>
              )}
              {activeGame === 'grip' && (
                <p className="text-xs text-slate-500 font-medium">Repeatedly squeeze past the 80% mark!</p>
              )}
            </div>

            <Button 
               size="lg" 
               className="w-full h-16 text-lg font-bold select-none active:scale-95 transition-transform bg-slate-900 hover:bg-slate-800"
               onPointerDown={(e) => {
                 e.preventDefault();
                 if (isPlaying) {
                    setGripForce(prev => {
                      const newForce = Math.min(100, prev + 25);
                      if (activeGame === 'grip' && prev < 80 && newForce >= 80) {
                        setScore(s => s + 50);
                      }
                      return newForce;
                    });
                 }
               }}
            >
              <Keyboard className="mr-2 h-5 w-5" />
              {isPlaying ? "TAP HERE OR PRESS SPACE" : "GAME OVER"}
            </Button>
          </div>

          {!isPlaying && (
            <DialogFooter className="sm:justify-center">
              <Button variant="secondary" onClick={closeGame}>Exit</Button>
              <Button onClick={() => startGame(activeGame!)}>Play Again</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
