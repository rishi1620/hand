import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/components";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlayCircle, Target, Trophy, Flame, Keyboard, AlertTriangle, Battery, ShieldAlert, Award, ArrowRight, Activity } from "lucide-react";
import { useStore } from "@/store";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

// 1. Personalized Rehab Profile (Simulated backend data)
const PATIENT_PROFILE = {
  baselineForce: 30, // N
  maxSafeForce: 85, // N
  romFlexion: 60, // degrees
  stage: "mid", // early, mid, advanced
  streakDays: 4,
};

export default function PatientGames() {
  const { language } = useStore();
  const [activeGame, setActiveGame] = useState<'grip' | 'steady' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionPaused, setSessionPaused] = useState<string | null>(null); // "fatigue", "overexertion"

  // Adaptive Engine State
  const [difficultyParams, setDifficultyParams] = useState({
    targetSize: 30, // % of the bar
    speedMs: 1000, 
    requiredForce: PATIENT_PROFILE.baselineForce,
    level: 1
  });

  // Game Metrics
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gripForce, setGripForce] = useState(0);
  const [forceHistory, setForceHistory] = useState<{time: number, force: number}[]>([]);
  const [successRounds, setSuccessRounds] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [fatigueWarning, setFatigueWarning] = useState(false);

  // Safety Trackers
  const forceDropsRef = useRef(0);
  const lastForceRef = useRef(0);
  const lowForceTimeRef = useRef(0);

  // 4. Fatigue & Safety Detection Logic
  const checkSafetyConstraints = useCallback((currentForce: number) => {
    // Overexertion Detection
    if (currentForce > PATIENT_PROFILE.maxSafeForce) {
      setSessionPaused('overexertion');
      setIsPlaying(false);
      return;
    }

    let isFatigued = false;

    // Fatigue Detection (sudden drops)
    if (currentForce < lastForceRef.current - 15) {
      forceDropsRef.current += 1;
      if (forceDropsRef.current > 3) {
         isFatigued = true;
      }
    }

    // Sustained low force output (less than baseline for 30 ticks ~ 3 seconds)
    if (currentForce < PATIENT_PROFILE.baselineForce - 10) {
        lowForceTimeRef.current += 1;
        if (lowForceTimeRef.current > 30) {
            isFatigued = true;
        }
    } else if (currentForce > PATIENT_PROFILE.baselineForce) {
        lowForceTimeRef.current = 0;
        forceDropsRef.current = Math.max(0, forceDropsRef.current - 1);
    }
    
    if (isFatigued) {
      setFatigueWarning(true);
      setSessionPaused('fatigue');
      setIsPlaying(false);
      forceDropsRef.current = 0; // reset after warning
      lowForceTimeRef.current = 0;
      // 3. Adaptive Engine: Reduce intensity due to fatigue
      setDifficultyParams(p => ({
        ...p,
        targetSize: Math.min(50, p.targetSize + 10),
        requiredForce: Math.max(20, p.requiredForce - 5),
        speedMs: p.speedMs + 200
      }));
    }

    lastForceRef.current = currentForce;
  }, []);

  // Simulate device stream
  useEffect(() => {
    if (!activeGame || !isPlaying) return;
    const interval = setInterval(() => {
      setGripForce(prev => {
        const next = Math.max(0, prev - 2);
        checkSafetyConstraints(next);
        return next;
      });
      setForceHistory(prev => [...prev.slice(-30), { time: Date.now(), force: gripForce }]);
    }, 100);
    return () => clearInterval(interval);
  }, [activeGame, isPlaying, gripForce, checkSafetyConstraints]);

  // 3. Adaptive Difficulty Engine logic
  useEffect(() => {
    if (totalRounds > 0 && totalRounds % 5 === 0) {
      const successRate = successRounds / totalRounds;
      if (successRate > 0.8) {
        // Increase difficulty
        setDifficultyParams(p => ({
           ...p, 
           level: p.level + 1,
           targetSize: Math.max(10, p.targetSize - 5),
           requiredForce: Math.min(PATIENT_PROFILE.maxSafeForce - 10, p.requiredForce + 5)
        }));
      } else if (successRate < 0.5) {
        // Decrease difficulty, motivating patient
        setDifficultyParams(p => ({
           ...p, 
           targetSize: Math.min(40, p.targetSize + 5),
           requiredForce: Math.max(10, p.requiredForce - 5)
        }));
      }
    }
  }, [totalRounds, successRounds]);

  // Game timer loop
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

      // Steady hold scoring
      if (activeGame === 'steady') {
        setGripForce(force => {
          const targetMin = 50 - (difficultyParams.targetSize / 2);
          const targetMax = 50 + (difficultyParams.targetSize / 2);
          if (force >= targetMin && force <= targetMax) {
            setScore(s => s + 10);
            setSuccessRounds(s => s + 1);
          }
          setTotalRounds(t => t + 1);
          return force;
        });
      }
    }, difficultyParams.speedMs);
    return () => clearInterval(tick);
  }, [isPlaying, activeGame, difficultyParams]);

  // Squeeze simulation
  const inputForce = () => {
    if (!isPlaying) return;
    setGripForce(prev => {
      // 2. Motion-Based Interaction: Scaling input based on capability
      // Adjust sensitivity based on stage
      const sensitivityMultipler = PATIENT_PROFILE.stage === 'early' ? 2.5 : 1.5;
      const newForce = Math.min(100, prev + (15 * sensitivityMultipler));
      
      checkSafetyConstraints(newForce);

      if (activeGame === 'grip' && prev < difficultyParams.requiredForce && newForce >= difficultyParams.requiredForce) {
        setScore(s => s + 50);
        setSuccessRounds(s => s + 1);
        setTotalRounds(t => t + 1);
      }
      return newForce;
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && isPlaying) {
      e.preventDefault();
      inputForce();
    }
  }, [isPlaying, inputForce]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startGame = (type: 'grip' | 'steady') => {
    setActiveGame(type);
    setScore(0);
    setTimeLeft(60);
    setGripForce(0);
    setForceHistory([]);
    setSuccessRounds(0);
    setTotalRounds(0);
    setFatigueWarning(false);
    setSessionPaused(null);
    setDifficultyParams({ targetSize: 30, speedMs: 1000, requiredForce: PATIENT_PROFILE.baselineForce, level: 1 });
    
    setTimeout(() => setIsPlaying(true), 100);
  };

  const closeGame = () => {
    setActiveGame(null);
    setIsPlaying(false);
    setSessionPaused(null);
  };

  const getSystemMessage = () => {
    if (sessionPaused === 'overexertion') return language === 'bn' ? 'অতিরিক্ত চাপ শনাক্ত হয়েছে! অনুগ্রহ করে বিরতি নিন।' : 'Force limit exceeded! System paused for your safety.';
    if (sessionPaused === 'fatigue') return language === 'bn' ? 'ক্লান্তি শনাক্ত হয়েছে। বিরতি নেওয়ার সময়।' : 'Fatigue patterns detected. Let\'s take a rest.';
    if (!isPlaying && timeLeft === 0) return language === 'bn' ? 'অসাধারণ কাজ! আপনার উন্নতি হয়েছে।' : 'Great effort! You maintained a solid 85% accuracy.';
    return language === 'bn' ? 'খেলা চলছে...' : 'Session in progress...';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{language === 'bn' ? 'গ্যামিফাইড পুনর্বাসন' : 'Adaptive Rehab Games'}</h1>
          <p className="text-slate-500 mt-2 text-lg">{language === 'bn' ? 'ইন্টারেক্টিভ গেমগুলির মাধ্যমে আপনার শক্তি উন্নত করুন।' : 'Intelligent exercises that adapt to your physical capability in real-time.'}</p>
        </div>
        {/* 5. Reward & Motivation System */}
        <div className="flex gap-4">
          <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl flex items-center gap-3">
             <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Flame className="w-5 h-5" /></div>
             <div>
               <p className="text-xs font-bold uppercase text-orange-600/70">{language === 'en' ? 'Recovery Streak' : 'ধারাবাহিকতা'}</p>
               <p className="font-bold text-orange-700">{PATIENT_PROFILE.streakDays} {language === 'en' ? 'Days' : 'দিন'}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all group overflow-hidden border-blue-100">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-40 flex items-center justify-center p-6 relative">
             <Target className="w-24 h-24 text-white/10 absolute -right-6 -bottom-6 transform rotate-12 scale-150 transition-transform group-hover:scale-110" />
             <Trophy className="w-14 h-14 text-white z-10" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Grip & Catch</CardTitle>
            <CardDescription className="text-base leading-relaxed">Squeeze to catch falling objects. Adapts target force dynamically based on your grip strength.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <Button className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700" onClick={() => startGame('grip')}>
               <PlayCircle className="w-5 h-5 mr-2" /> Play Adaptive Session
             </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all group overflow-hidden border-emerald-100">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-600 h-40 flex items-center justify-center p-6 relative">
             <Activity className="w-24 h-24 text-white/10 absolute -right-6 -bottom-6 transform rotate-12 scale-150 transition-transform group-hover:scale-110" />
             <Target className="w-14 h-14 text-white z-10" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Steady Spaceship</CardTitle>
            <CardDescription className="text-base leading-relaxed">Maintain stable force to navigate the ship. Prevents extreme flexions and trains muscle endurance.</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
             <Button className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700" onClick={() => startGame('steady')}>
               <PlayCircle className="w-5 h-5 mr-2" /> Play Adaptive Session
             </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 opacity-60 bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
           <div className="bg-slate-200 p-4 rounded-full mb-4">
              <Award className="w-8 h-8 text-slate-400" />
           </div>
           <p className="font-bold text-slate-500 mb-1">Rhythm Flex</p>
           <p className="text-sm text-slate-400 text-center px-6">Unlocks at Mid-Stage Phase 2</p>
        </Card>
      </div>

      {/* Game Dialog UI */}
      <Dialog open={activeGame !== null} onOpenChange={(open) => !open && closeGame()}>
        <DialogContent className="sm:max-w-3xl overflow-hidden p-0 border-0 shadow-2xl rounded-2xl">
          {sessionPaused === 'overexertion' && (
            <div className="absolute inset-0 bg-red-900/95 z-50 flex items-center justify-center flex-col text-white p-8 text-center animate-in fade-in">
              <ShieldAlert className="w-20 h-20 mb-6 text-red-400" />
              <h2 className="text-3xl font-bold mb-4">Safety Pause Triggered</h2>
              <p className="text-xl text-red-100 mb-8 max-w-lg">Maximum safe force exceeded ({gripForce}N &gt; {PATIENT_PROFILE.maxSafeForce}N). We've paused the game to prevent strain.</p>
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg" onClick={closeGame}>Exit Session & Rest</Button>
            </div>
          )}

          {sessionPaused === 'fatigue' && (
            <div className="absolute inset-0 bg-amber-900/95 z-50 flex items-center justify-center flex-col text-white p-8 text-center animate-in fade-in">
              <Battery className="w-20 h-20 mb-6 text-amber-400" />
              <h2 className="text-3xl font-bold mb-4">Fatigue Detected</h2>
              <p className="text-xl text-amber-100 mb-8 max-w-lg">We noticed your force output dropping or staying low. We recommend taking a break. The game intensity has been reduced for when you resume.</p>
              <div className="flex gap-4">
                 <Button size="lg" variant="secondary" className="h-14 px-8 text-lg text-slate-800" onClick={closeGame}>Exit Session & Rest</Button>
                 <Button size="lg" className="h-14 px-8 text-lg bg-amber-600 hover:bg-amber-500" onClick={() => { setSessionPaused(null); setIsPlaying(true); }}>Resume (Lower Intensity)</Button>
              </div>
            </div>
          )}

          <div className="bg-slate-900 text-white p-6 md:p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  {activeGame === 'grip' ? 'Grip & Catch' : 'Steady Spaceship'}
                </DialogTitle>
                <div className="flex items-center gap-3">
                   <span className="bg-blue-500/20 text-blue-300 py-1 px-3 rounded-full text-sm font-semibold border border-blue-500/30">
                     Adaptive Level {difficultyParams.level}
                   </span>
                   {fatigueWarning && (
                     <span className="bg-yellow-500/20 text-yellow-300 py-1 px-3 rounded-full text-sm font-semibold border border-yellow-500/30 flex items-center gap-1 animate-pulse">
                       <Battery className="w-4 h-4" /> Fatigue detected - lowering intensity
                     </span>
                   )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black tabular-nums text-emerald-400">{score}</div>
                <div className="text-slate-400 font-medium uppercase text-xs tracking-wider">Score</div>
              </div>
            </div>
            
            {/* Main Game Stage */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-inner mb-6 relative">
              <div className="absolute top-4 right-6 text-2xl font-bold tabular-nums text-slate-300">
                0:{timeLeft.toString().padStart(2, '0')}
              </div>

              {/* Patient Insight Graph */}
              <div className="h-24 w-full mb-6 relative opacity-70">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forceHistory}>
                       <Line type="monotone" dataKey="force" stroke="#818cf8" strokeWidth={3} dot={false} isAnimationActive={false} />
                       <YAxis domain={[0, 100]} hide />
                    </LineChart>
                 </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-slate-400">
                   <span>Force Output</span>
                   <span className="tabular-nums">{Math.round(gripForce)} N / {PATIENT_PROFILE.maxSafeForce} N</span>
                </div>
                
                {/* 9. Accessibility Enhancements: Large simple progress visual */}
                <div className="h-16 bg-slate-900 rounded-2xl overflow-hidden relative border-2 border-slate-700">
                  {/* Targets based on game mode & adaptive params */}
                  {activeGame === 'steady' && (
                    <div 
                      className="absolute top-0 bottom-0 bg-emerald-500/30 z-0 border-x-4 border-emerald-400 transition-all duration-1000"
                      style={{ 
                         left: `${50 - (difficultyParams.targetSize/2)}%`, 
                         width: `${difficultyParams.targetSize}%` 
                      }} 
                    />
                  )}
                  {activeGame === 'grip' && (
                    <div 
                      className="absolute top-0 bottom-0 bg-blue-500/30 z-0 border-l-4 border-blue-400 transition-all duration-1000"
                      style={{ 
                         left: `${difficultyParams.requiredForce}%`, 
                         right: 0
                      }} 
                    />
                  )}
                  
                  {/* The interactive indicator */}
                  <div 
                    className={`h-full transition-all duration-75 z-10 relative ${
                       gripForce >= difficultyParams.requiredForce ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 
                       'bg-slate-400'
                    }`}
                    style={{ width: `${gripForce}%` }}
                  />
                </div>
                
                <p className="text-center text-lg font-medium text-slate-300 mt-4 h-6">
                   {getSystemMessage()}
                </p>
              </div>
            </div>

            {/* Interaction Area */}
            {isPlaying ? (
              <Button 
                 variant="outline"
                 className="w-full h-24 text-2xl font-bold select-none active:scale-95 transition-transform bg-transparent border-slate-600 hover:bg-slate-800 text-white"
                 onPointerDown={(e) => {
                   e.preventDefault();
                   inputForce();
                 }}
              >
                <Keyboard className="mr-3 h-8 w-8 text-slate-400" />
                TAP OR PRESS SPACE TO SQUEEZE
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button variant="secondary" className="flex-1 h-16 text-lg bg-slate-700 hover:bg-slate-600 text-white border-0" onClick={closeGame}>Exit Game</Button>
                <Button className="flex-1 h-16 text-lg bg-indigo-600 hover:bg-indigo-500" onClick={() => startGame(activeGame!)}>
                  Play Again <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
