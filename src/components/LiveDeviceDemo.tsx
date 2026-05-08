import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/components';
import { PlayCircle, Square, RefreshCw, Wifi, WifiOff, Zap, Activity, Gamepad2, Settings, Info } from 'lucide-react';
import { cn, localizeNumber } from '@/lib/utils';
import { useStore } from '@/store';

interface SensorData {
  init: boolean;
  a: boolean; // Active
  e: boolean; // Error
  c1: number; // Current 1
  l1: number; // Load 1
  c2: number; // Current 2
  l2: number; // Load 2
  rp: number; // Repetition Count
  p1: number; // Position 1
  p2: number; // Position 2
}

const DEFAULT_ENDPOINT = 'http://192.168.4.1/data';
const POLL_INTERVAL = 300; // ms

export function LiveDeviceDemo() {
  const { language } = useStore();
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'demo'>('disconnected');
  const [isRunning, setIsRunning] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  
  // Game state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'running' | 'hit' | 'demo'>('ready');
  
  const requestRef = useRef<number>();
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Game objects refs to avoid state dependency in animation loop
  const playerRef = useRef({ x: 50, y: 0, width: 20, height: 40, vy: 0, jumpPower: 0, isJumping: false });
  const obstaclesRef = useRef<{x: number, width: number, height: number, speed: number}[]>([]);
  const gameDataRef = useRef({ score: 0, activeCurrent: 0, groundY: 0, frameCount: 0 });
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const generateDemoData = (): SensorData => ({
    init: true,
    a: true,
    e: false,
    c1: Math.floor(Math.random() * 400) + 200 + (Math.sin(Date.now() / 500) * 200),
    l1: Math.floor(Math.random() * 20) + 20,
    c2: Math.floor(Math.random() * 400) + 200 + (Math.cos(Date.now() / 400) * 200),
    l2: Math.floor(Math.random() * 20) + 20,
    rp: Math.floor(Date.now() / 5000) % 20,
    p1: Math.floor(Math.random() * 50) + 90,
    p2: Math.floor(Math.random() * 50) + 90,
  });

  const fetchData = useCallback(async () => {
    if (!isRunning) return;
    
    try {
      if (statusRef.current === 'demo') {
        const data = generateDemoData();
        setSensorData(data);
        updateGameInput(data);
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        
        const res = await fetch(endpoint, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          setSensorData(data);
          updateGameInput(data);
          setStatus('connected');
        } else {
          throw new Error('Network response was not ok');
        }
      }
    } catch (error) {
      console.warn("Connection failed, switching to demo mode", error);
      setStatus('demo');
      setGameState('demo'); // Inform UI
      const data = generateDemoData();
      setSensorData(data);
      updateGameInput(data);
    }

    if (isRunning) {
      fetchTimeoutRef.current = setTimeout(fetchData, POLL_INTERVAL);
    }
  }, [endpoint, isRunning]);

  useEffect(() => {
    if (isRunning) {
      fetchData();
    } else {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    }
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [isRunning, fetchData]);

  const connectDevice = () => {
    setStatus('connecting');
    // Test connection immediately
    fetch(endpoint, { method: 'GET', mode: 'no-cors' }) // no-cors might just succeed without returning data, better to just try fetching in loop
      .then(() => setStatus('connected'))
      .catch(() => setStatus('demo'));
  };

  const startDemo = () => {
    setIsRunning(true);
    setGameState('running');
    restartGame();
  };

  const stopDemo = () => {
    setIsRunning(false);
    setGameState('ready');
  };

  // Game Logic
  const updateGameInput = (data: SensorData) => {
    const maxCurrent = 800; // configurable
    const activeCurrent = Math.max(data.c1, data.c2);
    gameDataRef.current.activeCurrent = activeCurrent;
    
    // Jump trigger
    if (activeCurrent > 400 && !playerRef.current.isJumping) {
      const normalizedCurrent = Math.min(activeCurrent / maxCurrent, 1);
      const jumpHeight = normalizedCurrent * 16; // Velocity
      playerRef.current.vy = -jumpHeight;
      playerRef.current.isJumping = true;
    }
  };

  const restartGame = () => {
    setScore(0);
    gameDataRef.current.score = 0;
    obstaclesRef.current = [];
    playerRef.current.y = 0;
    playerRef.current.vy = 0;
    playerRef.current.isJumping = false;
    setGameState(statusRef.current === 'demo' ? 'demo' : 'running');
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const { width, height } = canvas;
    const groundY = height - 40;
    gameDataRef.current.groundY = groundY;

    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw Background Grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<width; i+=40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for(let i=0; i<height; i+=40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // Draw Ground
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#06b6d4';
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(0, groundY, width, 40);
    ctx.shadowBlur = 0;

    if (gameState === 'running' || gameState === 'demo') {
      const p = playerRef.current;
      
      // Gravity
      p.vy += 0.8;
      p.y += p.vy;
      
      if (p.y > groundY - p.height) {
        p.y = groundY - p.height;
        p.vy = 0;
        p.isJumping = false;
      }

      // Obstacles
      gameDataRef.current.frameCount++;
      if (gameDataRef.current.frameCount % 90 === 0) { // spawn rate
        obstaclesRef.current.push({
          x: width,
          width: 20 + Math.random() * 20,
          height: 30 + Math.random() * 40,
          speed: 4 + Math.random() * 2
        });
      }

      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= obs.speed;
        
        // Draw Obstacle
        ctx.fillStyle = '#a855f7'; // Purple
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#a855f7';
        ctx.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);
        ctx.shadowBlur = 0;

        // Collision Check
        if (
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < groundY &&
          p.y + p.height > groundY - obs.height
        ) {
          setGameState('hit');
          setIsRunning(false);
        }

        // Passed
        if (obs.x + obs.width < 0) {
          obstaclesRef.current.splice(i, 1);
          gameDataRef.current.score += 10;
          setScore(gameDataRef.current.score);
        }
      }

      // Draw Player
      ctx.fillStyle = '#22d3ee'; // Cyan
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#22d3ee';
      
      // pulse effect based on current
      const pulse = Math.min((gameDataRef.current.activeCurrent / 1000) * 10, 10);
      ctx.shadowBlur = 10 + pulse;
      
      ctx.fillRect(p.x, p.y, p.width, p.height);
      ctx.shadowBlur = 0;
      
      // Draw active current bar on player
      if (gameDataRef.current.activeCurrent > 100) {
        ctx.fillStyle = 'white';
        const h = Math.min((gameDataRef.current.activeCurrent / 1000) * p.height, p.height);
        ctx.fillRect(p.x + 5, p.y + p.height - h, p.width - 10, h);
      }

    } else {
      // Draw idle player
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(playerRef.current.x, groundY - playerRef.current.height, playerRef.current.width, playerRef.current.height);
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-8 mt-16 pt-16 border-t border-cyan-500/20" id="live-demo-section">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-bold border border-cyan-500/20 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Gamepad2 className="w-4 h-4" /> {language === 'en' ? 'Live Device Game Demo' : 'লাইভ ডিভাইস গেম ডেমো'}
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">{language === 'en' ? 'Turn Effort Into Progress' : 'প্রচেষ্টাকে অগ্রগতিতে রূপান্তর করুন'}</h3>
        <p className="text-slate-300 max-w-2xl mx-auto">
          {language === 'en' ? 'Connect to your ESP32 rehabilitation device and control the therapy game using real-time sensor values. Higher muscle effort produces higher sensor values, helping the patient cross obstacles.' : 'আপনার ESP32 রিহ্যাবিলিটেশন ডিভাইসের সাথে সংযোগ করুন এবং রিয়েল-টাইম সেন্সর মান ব্যবহার করে থেরাপি গেম নিয়ন্ত্রণ করুন। উচ্চতর পেশী প্রচেষ্টায় উচ্চতর সেন্সর মান উৎপন্ন হয়, যা রোগীকে বাধা অতিক্রম করতে সাহায্য করে।'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Connection Panel */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full"></div>
          
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" /> {language === 'en' ? 'Connection Panel' : 'সংযোগ প্যানেল'}
          </h4>

          {/* Connection Status Badge */}
          <div className={cn(
            "px-4 py-3 rounded-xl border flex items-center gap-3 mb-6 font-medium text-sm transition-all shadow-lg",
            status === 'disconnected' ? "bg-slate-800 border-slate-700 text-slate-300" :
            status === 'connecting' ? "bg-amber-900/40 border-amber-500/50 text-amber-300 animate-pulse" :
            status === 'connected' ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20" :
            "bg-purple-900/40 border-purple-500/50 text-purple-300 shadow-purple-500/20"
          )}>
            {status === 'disconnected' && <WifiOff className="w-5 h-5" />}
            {status === 'connecting' && <RefreshCw className="w-5 h-5 animate-spin" />}
            {status === 'connected' && <Wifi className="w-5 h-5" />}
            {status === 'demo' && <Activity className="w-5 h-5" />}
            
            <span>
              {status === 'disconnected' ? (language === 'en' ? 'Device Not Connected' : 'ডিভাইস সংযুক্ত নেই') :
               status === 'connecting' ? (language === 'en' ? 'Connecting to Device...' : 'ডিভাইসের সাথে সংযুক্ত হচ্ছে...') :
               status === 'connected' ? (language === 'en' ? 'Device Connected' : 'ডিভাইস সংযুক্ত') :
               (language === 'en' ? 'Connection Failed — Running Demo Mode' : 'সংযোগ ব্যর্থ হয়েছে — ডেমো মোড চলছে')}
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1 font-mono uppercase tracking-wider">{language === 'en' ? 'ESP32 Wi-Fi Details' : 'ESP32 ওয়াই-ফাই বিবরণ'}</div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">{language === 'en' ? 'SSID:' : 'SSID:'} <span className="font-bold text-cyan-400">HandRehab</span></span>
                <span className="text-sm text-white">{language === 'en' ? 'Pass:' : 'পাসওয়ার্ড:'} <span className="font-bold text-cyan-400">{localizeNumber(12345678, language)}</span></span>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1 block">{language === 'en' ? 'Device Endpoint' : 'ডিভাইস এন্ডপয়েন্ট'}</label>
              <Input 
                value={endpoint} 
                onChange={(e) => setEndpoint(e.target.value)}
                className="bg-slate-950 border-slate-700 text-cyan-300 font-mono h-10"
                disabled={isRunning}
              />
            </div>
            
            <p className="text-xs text-slate-500 flex items-start gap-1.5">
               <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500/70" />
               {language === 'en' ? 'Connect to the ESP32 Wi-Fi network first, then click Connect.' : 'প্রথমে ESP32 ওয়াই-ফাই নেটওয়ার্কের সাথে সংযোগ করুন, তারপর কানেক্ট ক্লিক করুন।'}
            </p>
          </div>

          <div className="space-y-3">
             <Button 
               onClick={connectDevice} 
               disabled={isRunning || status === 'connecting' || status === 'connected'}
               className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white"
             >
               {language === 'en' ? 'Connect Device' : 'ডিভাইস কানেক্ট করুন'}
             </Button>
             
             <div className="grid grid-cols-2 gap-3">
               <Button 
                 onClick={startDemo} 
                 disabled={isRunning}
                 className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] border-0"
               >
                 <PlayCircle className="w-4 h-4 mr-2" /> {language === 'en' ? 'Start Demo' : 'ডেমো শুরু করুন'}
               </Button>
               <Button 
                 onClick={stopDemo} 
                 disabled={!isRunning}
                 variant="outline"
                 className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
               >
                 <Square className="w-4 h-4 mr-2" /> {language === 'en' ? 'Stop Demo' : 'ডেমো বন্ধ করুন'}
               </Button>
             </div>
          </div>
        </div>

        {/* Game Canvas & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {[
               { label: language === 'en' ? "Active Current" : "সক্রিয় কারেন্ট", val: sensorData ? Math.max(sensorData.c1, sensorData.c2) : 0, max: 1000, unit: "mA" },
               { label: language === 'en' ? "Servo 1 Load" : "সার্ভো ১ লোড", val: sensorData?.l1 || 0, max: 100, unit: "%" },
               { label: language === 'en' ? "Servo 2 Load" : "সার্ভো ২ লোড", val: sensorData?.l2 || 0, max: 100, unit: "%" },
               { label: language === 'en' ? "Reps" : "রেপস", val: sensorData?.rp || 0, max: 30, unit: "" },
             ].map((metric, i) => (
               <div key={i} className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between">
                 <div className="text-xs text-slate-400 font-medium mb-2 truncate">{metric.label}</div>
                 <div>
                   <div className="text-2xl font-bold text-white mb-2">{localizeNumber(typeof metric.val === 'number' ? Number(metric.val.toFixed(2)) : metric.val, language)}<span className="text-sm font-normal text-slate-500 ml-1">{metric.unit}</span></div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-cyan-400 rounded-full transition-all duration-300" 
                       style={{ 
                         width: `${Math.min((metric.val / metric.max) * 100, 100)}%`,
                         boxShadow: '0 0 10px rgba(34,211,238,0.5)'
                       }}
                     />
                   </div>
                 </div>
               </div>
             ))}
          </div>

          {/* Game Canvas container */}
          <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl overflow-hidden relative shadow-2xl shadow-cyan-900/20">
             
            {/* Overlay UI */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-start pointer-events-none z-10">
              <div>
                <div className="text-cyan-400 font-bold text-xl drop-shadow-md">{language === 'en' ? 'Score:' : 'স্কোর:'} {localizeNumber(score, language)}</div>
                {gameState === 'demo' && (
                  <div className="mt-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded text-xs text-purple-300 font-medium inline-block backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    {language === 'en' ? 'Demo Mode Active' : 'ডেমো মোড সক্রিয়'}
                  </div>
                )}
              </div>
              <div className="text-right">
                 <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">{language === 'en' ? 'Live Input Effort' : 'লাইভ ইনপুট প্রচেষ্টা'}</div>
                 <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden inline-[flex]">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-100"
                      style={{ 
                        width: `${Math.min(((sensorData ? Math.max(sensorData.c1, sensorData.c2) : 0) / 800) * 100, 100)}%`,
                        boxShadow: '0 0 10px rgba(52,211,153,0.5)'
                      }}
                    />
                 </div>
              </div>
            </div>

            {/* Hit State Overlay */}
            {gameState === 'hit' && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <div className="text-3xl font-bold text-rose-500 mb-2 drop-shadow-lg">{language === 'en' ? 'Obstacle Hit!' : 'বাধা আঘাত করেছে!'}</div>
                <div className="text-slate-300 mb-6 font-medium">{language === 'en' ? 'Final Score:' : 'চূড়ান্ত স্কোর:'} {localizeNumber(score, language)}</div>
                <Button 
                  onClick={restartGame} 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] px-8 pointer-events-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> {language === 'en' ? 'Play Again' : 'আবার খেলুন'}
                </Button>
              </div>
            )}
            
            {/* Ready State Overlay */}
            {gameState === 'ready' && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                <Button 
                  onClick={startDemo} 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] px-8 pointer-events-auto text-lg h-12"
                >
                  <PlayCircle className="w-5 h-5 mr-2" /> {language === 'en' ? 'Start Demo' : 'ডেমো শুরু করুন'}
                </Button>
              </div>
            )}

            <canvas 
              ref={canvasRef} 
              height={360} 
              className="w-full block"
            />
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-slate-400 flex gap-4">
             <Zap className="w-6 h-6 text-yellow-500 flex-shrink-0" />
             <p>
               <strong className="text-slate-200">{language === 'en' ? 'Therapy Benefit:' : 'থেরাপি সুবিধা:'}</strong> {language === 'en' ? 'The game translates your physical sensor data (motor currents) into jump velocity. Higher resistance in the real world directly corresponds to overcoming larger virtual obstacles, converting repetitive therapy into an engaging challenge.' : 'গেমটি আপনার শারীরিক সেন্সর ডেটাকে (মোটর কারেন্ট) জাম্প গতিতে রূপান্তর করে। বাস্তব জগতে উচ্চতর প্রতিরোধ সরাসরি বৃহত্তর ভার্চুয়াল বাধাগুলি অতিক্রম করার সাথে মিলে যায়, যা একটি পুনরাবৃত্ত থেরাপিকে আকর্ষক চ্যালেঞ্জে রূপান্তর করে।'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
