import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/components";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlayCircle, Target, Trophy, Flame, Keyboard } from "lucide-react";
import { useStore } from "@/store";

export default function PatientGames() {
  const { language } = useStore();
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
    // Add small delay to avoid state transition clashes
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  const closeGame = () => {
    setActiveGame(null);
    setIsPlaying(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{language === 'bn' ? 'গ্যামিফাইড ব্যায়াম' : 'Gamified Exercises'}</h1>
        <p className="text-muted-foreground">{language === 'bn' ? 'ইন্টারেক্টিভ গেমগুলির মাধ্যমে আপনার পুনর্বাসনকে মজাদার এবং আকর্ষণীয় করুন।' : 'Make your rehabilitation fun and engaging with interactive games.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-blue-500 transition-colors group cursor-pointer overflow-hidden flex flex-col">
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 h-32 flex items-center justify-center p-6 relative overflow-hidden">
             <Target className="w-16 h-16 text-white/20 absolute -right-4 -bottom-4 transform rotate-12 scale-150 transition-transform group-hover:scale-110" />
             <Trophy className="w-12 h-12 text-white z-10" />
          </div>
          <CardHeader>
            <CardTitle>{language === 'bn' ? 'গ্রিপ এবং ক্যাচ' : 'Grip & Catch'}</CardTitle>
            <CardDescription>{language === 'bn' ? 'প্রতিক্রিয়া সময় এবং শক্তির উন্নতির জন্য পড়তে থাকা বস্তুগুলি ধরতে ডিভাইসটি চাপুন।' : 'Squeeze the device to catch falling objects to improve reaction time and peak force.'}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <div className="flex justify-between items-center text-sm mb-4 text-slate-500">
               <span className="flex items-center"><Flame className="w-4 h-4 mr-1 text-orange-500" /> {language === 'bn' ? 'সর্বোচ্চ স্কোর: ১২৪০' : 'High Score: 1240'}</span>
               <span>{language === 'bn' ? 'লেভেল: ৩' : 'Level: 3'}</span>
             </div>
             <Button className="w-full gap-2" onClick={() => startGame('grip')}>
               <PlayCircle className="w-4 h-4" /> {language === 'bn' ? 'এখন শুরু করুন' : 'Play Now'}
             </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-500 transition-colors group cursor-pointer overflow-hidden flex flex-col">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-600 h-32 flex items-center justify-center p-6 relative overflow-hidden">
             <PlayCircle className="w-16 h-16 text-white/20 absolute -right-4 -bottom-4 transform rotate-12 scale-150 transition-transform group-hover:scale-110" />
             <Target className="w-12 h-12 text-white z-10" />
          </div>
          <CardHeader>
            <CardTitle>{language === 'bn' ? 'অবিচল লক্ষ্য' : 'Steady Hold'}</CardTitle>
            <CardDescription>{language === 'bn' ? 'স্পেসশিপটি সোজা উড়তে রাখতে লক্ষ্য অঞ্চলের মধ্যে একটি ধ্রুবক গ্রিপ শক্তি বজায় রাখুন।' : 'Maintain a constant grip force within the target zone to keep the spaceship flying straight.'}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <div className="flex justify-between items-center text-sm mb-4 text-slate-500">
               <span className="flex items-center"><Flame className="w-4 h-4 mr-1 text-orange-500" /> {language === 'bn' ? 'সর্বোচ্চ সময়: ৪৫সে' : 'High Score: 45s'}</span>
               <span>{language === 'bn' ? 'লেভেল: ১' : 'Level: 1'}</span>
             </div>
             <Button className="w-full gap-2" onClick={() => startGame('steady')}>
               <PlayCircle className="w-4 h-4" /> {language === 'bn' ? 'এখন শুরু করুন' : 'Play Now'}
             </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-500 transition-colors group cursor-pointer overflow-hidden flex flex-col border-dashed opacity-70">
          <div className="bg-slate-100 h-32 flex items-center justify-center p-6 relative overflow-hidden">
             <span className="font-bold text-slate-400">{language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}</span>
          </div>
          <CardHeader>
            <CardTitle className="text-slate-500">{language === 'bn' ? 'ছন্দ ফ্লেক্স' : 'Rhythm Flex'}</CardTitle>
            <CardDescription>{language === 'bn' ? 'সমন্বয় উন্নত করতে সঙ্গীত এর ছন্দে আপনার আঙ্গুলগুলি ফ্লেক্স করুন।' : 'Flex your fingers to the beat of the music to improve coordination.'}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <Button variant="secondary" className="w-full gap-2" disabled>
               {language === 'bn' ? 'লকড' : 'Locked'}
             </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={activeGame !== null} onOpenChange={(open) => !open && closeGame()}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {activeGame === 'grip' ? (language === 'bn' ? 'গ্রিপ এবং ক্যাচ' : 'Grip & Catch') : (language === 'bn' ? 'অবিচল লক্ষ্য' : 'Steady Hold')}
            </DialogTitle>
            <DialogDescription>
              {isPlaying 
                ? (language === 'bn' ? 'ইন্টারেক্টিভ সিমুলেশন মোড চলছে।' : "Interactive Simulation Mode running.")
                : (language === 'bn' ? 'সেশন শেষ!' : "Session Completed!")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="flex justify-between text-lg font-bold px-2">
              <div className="text-blue-600 tabular-nums">{language === 'bn' ? 'সময়: ' : 'Time: '}{timeLeft}s</div>
              <div className="text-emerald-600 tabular-nums">{language === 'bn' ? 'স্কোর: ' : 'Score: '}{score}</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-500 px-1">
                 <span>{language === 'bn' ? 'সিমুলেটেড গ্রিপ ফোর্স' : 'Simulated Grip Force'}</span>
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
                <p className="text-xs text-slate-500 font-medium">{language === 'bn' ? 'হালকা সবুজ অঞ্চলে বার রাখুন!' : 'Keep the bar inside the light green zone!'}</p>
              )}
              {activeGame === 'grip' && (
                <p className="text-xs text-slate-500 font-medium">{language === 'bn' ? '৮০% মার্ক পার হয়ে বারবার চাপ দিন!' : 'Repeatedly squeeze past the 80% mark!'}</p>
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
              {isPlaying ? (language === 'bn' ? 'এখানে ট্যাপ করুন অথবা স্পেস চাপুন' : "TAP HERE OR PRESS SPACE") : (language === 'bn' ? 'খেলা শেষ' : "GAME OVER")}
            </Button>
          </div>

          {!isPlaying && (
            <DialogFooter className="sm:justify-center">
              <Button variant="secondary" onClick={closeGame}>{language === 'bn' ? 'প্রস্থান' : 'Exit'}</Button>
              <Button onClick={() => startGame(activeGame!)}>{language === 'bn' ? 'আবার খেলুন' : 'Play Again'}</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
