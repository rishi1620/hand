import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppStrings } from "@/config/strings";
import { useStore } from "@/store";
import { localizeNumber } from "@/lib/utils";
import { 
  Activity, Stethoscope, UserCircle, Globe, ChevronRight, CheckCircle2, 
  ActivitySquare, ShieldCheck, FileBarChart, Gamepad2, HeartHandshake,
  ArrowRight, PlayCircle
} from "lucide-react";
import { LiveDeviceDemo } from '@/components/LiveDeviceDemo';

export default function LandingPage() {
  const navigate = useNavigate();
  const setLogin = useStore((state) => state.login);
  const { language, setLanguage } = useStore();
  const strings = AppStrings[language];
  
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const planARef = useRef<HTMLDivElement>(null);
  const planBRef = useRef<HTMLDivElement>(null);
  const planBPlusRef = useRef<HTMLDivElement>(null);

  const scrollToPlan = (plan: string, ref: React.RefObject<HTMLDivElement>) => {
    setActivePlan(plan);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Auth simulators
  const handleDoctorLogin = () => {
    setLogin({ id: "doc-1", name: "Dr. Emily Chen", role: "doctor", email: "doc@handrehab.pro" });
    navigate("/doctor/dashboard");
  };

  const handlePatientLogin = () => {
    setLogin({ id: "1", name: "John Doe", role: "patient", email: "john@example.com" });
    navigate("/patient/dashboard");
  };

  const handlePhysioLogin = () => {
    setLogin({ id: "physio-1", name: "Sarah Jenkins, PT", role: "physiotherapist", email: "sarah@handrehab.pro" });
    navigate("/physio/dashboard");
  };

  const handleAdminLogin = () => {
    setLogin({ id: "admin-1", name: "System Admin", role: "admin", email: "admin@handrehab.pro" });
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Navigation */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">{strings.AppName}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/contact")}>
              {language === 'en' ? 'Contact' : 'যোগাযোগ'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePatientLogin}>
              <UserCircle className="w-4 h-4 mr-2 text-slate-500" />
              {strings.PatientLoginBtn}
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePhysioLogin}>
              <ActivitySquare className="w-4 h-4 mr-2 text-slate-500" />
              {strings.PhysioLoginBtn}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDoctorLogin}>
              <Stethoscope className="w-4 h-4 mr-2 text-slate-500" />
              {strings.DoctorLoginBtn}
            </Button>
            
            <div className="pl-4 border-l ml-2 flex items-center gap-2">
              <Button aria-label="Toggle Language" variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "bn" : "en")} className="gap-2 font-medium">
                <Globe aria-hidden="true" className="w-4 h-4" />
                {language === "en" ? "বাংলা" : "English"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-48 overflow-hidden min-h-[85vh] flex items-center justify-center">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-1000" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=2000&q=80')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            opacity: 0.15
          }} 
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-white/60 to-white/90 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4">
              <ShieldCheck className="w-4 h-4" />
              {language === 'en' ? 'Clinical-Grade Robotic Therapy' : 'ক্লিনিক্যাল-গ্রেড রোবোটিক থেরাপি'}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              {language === 'en' ? 'Smart Hand Rehabilitation,' : 'স্মার্ট হাতের পুনর্বাসন,'} <br/>
              <span className="text-blue-600">{language === 'en' ? 'Remotely Supervised by Experts' : 'বিশেষজ্ঞদের দ্বারা রিমোট তত্ত্বাবধান'}</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {strings.Description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-blue-600/20" onClick={() => navigate("/contact")}>
                {strings.BookDemoBtn} <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white" onClick={handlePatientLogin}>
                <PlayCircle className="w-5 h-5 mr-2 text-blue-600" />
                {language === 'en' ? 'See How it Works' : 'এটি কীভাবে কাজ করে দেখুন'}
              </Button>
            </div>

            {/* Quick Admin Access for Demo Purposes */}
            <div className="pt-8 text-sm text-slate-400">
              <span className="cursor-pointer hover:text-slate-600 transition-colors" onClick={handleAdminLogin}>System Admin Login (Demo)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: How It Works */}
      <section className="py-24 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{language === 'en' ? 'Platform Capabilities' : 'প্ল্যাটফর্মের ক্ষমতা'}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {language === 'en' ? 'An end-to-end framework strictly connecting hardware telemetry with clinical oversight.' : 'হার্ডওয়্যার টেলিমেট্রিকে ক্লিনিক্যাল তত্ত্বাবধানের সাথে যুক্ত করার একটি প্রান্ত-থেকে-প্রান্ত কাঠামো।'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Gamepad2, title: "Remote Robotic Device Control", desc: "Clinicians dynamically adjust resistance, speed, and ROM safely.", bnTitle: "রিমোট রোবোটিক কন্ট্রোল", bnDesc: "ক্লিনিশিয়ানরা নিরাপদে প্রতিরোধ, গতি এবং রোম সেট করেন।" },
              { icon: Activity, title: "Live ROM & Grip Monitoring", desc: "Sub-millisecond latency on patient biometric feedback streams.", bnTitle: "লাইভ রোম ও গ্রিপ মনিটরিং", bnDesc: "রোগীর বায়োমেট্রিক ফিডব্যাকে সাব-মিলিসেকেন্ড লেটেন্সি।" },
              { icon: ShieldCheck, title: "Safety & Clinical Governance", desc: "Hardcoded safety thresholds with timestamped audit logging.", bnTitle: "নিরাপত্তা ও ক্লিনিক্যাল সুশাসন", bnDesc: "টাইমস্ট্যাম্পযুক্ত অডিট লগিং সহ হার্ডকোডেড নিরাপত্তা থ্রেশহোল্ড।" },
              { icon: FileBarChart, title: "Reports & Analytics", desc: "Automated progress tracking and PDF export generation.", bnTitle: "রিপোর্ট ও অ্যানালিটিক্স", bnDesc: "স্বয়ংক্রিয় অগ্রগতি ট্র্যাকিং এবং পিডিএফ এক্সপোর্ট।" }
            ].map((ft, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ft.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{language === 'en' ? ft.title : ft.bnTitle}</h3>
                <p className="text-slate-600 leading-relaxed">{language === 'en' ? ft.desc : ft.bnDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing / Subscription Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a1128] to-slate-900">
        {/* Subtle glowing backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-[40%] right-[10%] w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-[20%] left-[30%] w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-20" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-[60%] right-[30%] w-4 h-4 bg-white rounded-full animate-pulse opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {language === 'en' ? 'Choose Your Rehabilitation Plan' : 'আপনার পুনর্বাসন পরিকল্পনা চয়ন করুন'}
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {language === 'en' ? 'Flexible therapy options for every recovery journey' : 'প্রতিটি পুনরুদ্ধারের যাত্রার জন্য নমনীয় থেরাপি বিকল্প'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {/* Plan A */}
            <div 
              onClick={() => scrollToPlan('A', planARef)} 
              className={`bg-white/5 backdrop-blur-xl border p-8 rounded-3xl relative overflow-hidden hover:bg-white/10 transition-all cursor-pointer ${activePlan === 'A' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-white/10'}`}
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <PlayCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{language === 'en' ? 'Plan A' : 'প্ল্যান এ'}</h3>
              <p className="text-blue-300 font-medium mb-6">{language === 'en' ? 'Self-Guided Recovery' : 'স্ব-নির্দেশিত রিকভারি'}</p>
              
              <div className="mb-8">
                <span className="text-sm text-slate-400 font-medium">{language === 'en' ? 'Affordable Monthly Subscription' : 'সাশ্রয়ী মূল্যের মাসিক সাবস্ক্রিপশন'}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  language === 'en' ? 'Guided exercise tutorials' : 'নির্দেশিত ব্যায়াম টিউটোরিয়াল',
                  language === 'en' ? 'Basic rehabilitation dashboard' : 'মৌলিক পুনর্বাসন ড্যাশবোর্ড',
                  language === 'en' ? 'Daily activity tracking' : 'দৈনন্দিন কার্যকলাপ ট্র্যাকিং',
                  language === 'en' ? 'Home-based self therapy' : 'বাড়িতে স্ব-থেরাপি',
                  language === 'en' ? 'No physical device included' : 'কোন শারীরিক ডিভাইস অন্তর্ভুক্ত নেই'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                     <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-blue-600/20 hover:bg-blue-600 border border-blue-500/50 text-blue-300 hover:text-white transition-all">{language === 'en' ? 'Get Started' : 'শুরু করুন'}</Button>
            </div>

            {/* Plan B (Most Popular) */}
            <div 
              onClick={() => scrollToPlan('B', planBRef)} 
              className={`bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border p-8 rounded-3xl relative overflow-hidden transform md:-translate-y-4 shadow-2xl transition-all cursor-pointer ${activePlan === 'B' ? 'border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.5)]' : 'border-cyan-500/50 shadow-cyan-900/20'}`}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              <div className="absolute top-4 right-4 bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30">
                {language === 'en' ? 'Most Popular' : 'সবচেয়ে জনপ্রিয়'}
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <ActivitySquare className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{language === 'en' ? 'Plan B' : 'প্ল্যান বি'}</h3>
              <p className="text-cyan-300 font-medium mb-6">{language === 'en' ? 'Guided Device Rehabilitation' : 'নির্দেশিত ডিভাইস রিহ্যাবিলিটেশন'}</p>
              
              <div className="mb-8">
                <span className="text-sm text-slate-400 font-medium">{language === 'en' ? 'Device + Therapy Package' : 'ডিভাইস + থেরাপি প্যাকেজ'}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  language === 'en' ? 'Smart rehabilitation device access' : 'স্মার্ট রিহ্যাবিলিটেশন ডিভাইস অ্যাক্সেস',
                  language === 'en' ? 'Device purchase or rental option' : 'ডিভাইস ক্রয় বা ভাড়ার বিকল্প',
                  language === 'en' ? 'Therapist-guided sessions' : 'থেরাপিস্ট-পরিচালিত সেশন',
                  language === 'en' ? '15 / 30 day therapy packages' : '১৫ / ৩০ দিনের থেরাপি প্যাকেজ',
                  language === 'en' ? 'Real-time monitoring' : 'রিয়েল-টাইম মনিটরিং',
                  language === 'en' ? 'Progress analytics' : 'অগ্রগতির বিশ্লেষণ',
                  language === 'en' ? 'Remote therapist support' : 'দূরবর্তী থেরাপিস্ট সমর্থন',
                  language === 'en' ? 'Live sensor-based game demo' : 'লাইভ সেন্সর-ভিত্তিক গেম ডেমো'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-200 text-sm font-medium">
                     <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToPlan('B', planBRef);
                    setTimeout(() => {
                      document.getElementById('live-demo-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border-0"
                >
                  {language === 'en' ? 'Try Live Demo' : 'লাইভ ডেমো ব্যবহার করুন'}
                </Button>
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30">{language === 'en' ? 'Choose Therapist' : 'থেরাপিস্ট নির্বাচন করুন'}</Button>
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30">{language === 'en' ? 'Explore Devices' : 'ডিভাইসগুলি ঘুরে দেখুন'}</Button>
              </div>
            </div>

            {/* Plan B+ */}
            <div 
              onClick={() => scrollToPlan('B+', planBPlusRef)} 
              className={`bg-white/5 backdrop-blur-xl border p-8 rounded-3xl relative overflow-hidden hover:bg-white/10 transition-all cursor-pointer ${activePlan === 'B+' ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'border-white/10'}`}
            >
              <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">
                {language === 'en' ? 'Advanced Care' : 'অ্যাডভান্সড কেয়ার'}
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Stethoscope className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{language === 'en' ? 'Plan B+' : 'প্ল্যান বি+'}</h3>
              <p className="text-purple-300 font-medium mb-6">{language === 'en' ? 'Specialist Assisted Recovery' : 'বিশেষজ্ঞ সহায়ক রিকভারি'}</p>
              
              <div className="mb-8">
                <span className="text-sm text-slate-400 font-medium">{language === 'en' ? 'Premium Consultation Package' : 'প্রিমিয়াম কন্সালটেশন প্যাকেজ'}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  language === 'en' ? 'Everything in Plan B' : 'প্ল্যান বি এর সবকিছু',
                  language === 'en' ? 'Specialist doctor appointments' : 'বিশেষজ্ঞ ডাক্তারের অ্যাপয়েন্টমেন্ট',
                  language === 'en' ? 'Personalized recovery plans' : 'ব্যক্তিগত রিকভারি প্ল্যান',
                  language === 'en' ? 'Advanced analytics' : 'অ্যাডভান্সড অ্যানালিটিক্স',
                  language === 'en' ? 'Priority consultation support' : 'অগ্রাধিকার কন্সালটেশন সমর্থন',
                  language === 'en' ? 'AI-assisted progress insights' : 'এআই-সহায়তা অগ্রগতির অন্তর্দৃষ্টি'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                     <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-purple-600/20 hover:bg-purple-600 border border-purple-500/50 text-purple-300 hover:text-white transition-all">{language === 'en' ? 'Go Premium' : 'প্রিমিয়ামে যান'}</Button>
            </div>
          </div>

          {/* Bottom Comparison Strip */}
          <div className="mt-16 pt-8 border-t border-white/10 max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              language === 'en' ? 'Affordable Entry' : 'সাশ্রয়ী মূল্যের এন্ট্রি',
              language === 'en' ? 'Remote Monitoring' : 'দূরবর্তী মনিটরিং',
              language === 'en' ? 'Smart Rehabilitation' : 'স্মার্ট পুনর্বাসন',
              language === 'en' ? 'Specialist Support' : 'বিশেষজ্ঞ সহায়তা',
              language === 'en' ? 'Data-Driven Recovery' : 'ডেটা-চালিত রিকভারি'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <span className="text-emerald-400">✔</span> {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan A Detailed Section */}
      <div 
        ref={planARef}
        className={`transition-all duration-1000 overflow-hidden ${activePlan === 'A' ? 'max-h-[5000px] opacity-100 py-24' : 'max-h-0 opacity-0 py-0'}`}
        style={{ backgroundColor: '#0f172a' }}
      >
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{language === 'en' ? 'Self-Guided Recovery Dashboard' : 'স্ব-নির্দেশিত রিকভারি ড্যাশবোর্ড'}</h2>
              <p className="text-xl text-blue-200">{language === 'en' ? 'Your personal space for independent home-based hand therapy.' : 'স্বাধীন হোম-ভিত্তিক হ্যান্ড থেরাপির জন্য আপনার ব্যক্তিগত স্থান।'}</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Daily Streak & Analytics */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-blue-500/20 rounded-3xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{language === 'en' ? 'Recovery Progress' : 'পুনরুদ্ধারের অগ্রগতি'}</h3>
                <div className="flex items-center justify-between mb-8">
                  <div className="text-center">
                     <div className="text-3xl font-bold text-blue-400">{localizeNumber(12, language)}</div>
                     <div className="text-sm text-slate-400">{language === 'en' ? 'Day Streak' : 'দিনের ধারাবাহিকতা'}</div>
                  </div>
                  <div className="h-12 w-px bg-slate-700"></div>
                  <div className="text-center">
                     <div className="text-3xl font-bold text-emerald-400">{localizeNumber(68, language)}%</div>
                     <div className="text-sm text-slate-400">{language === 'en' ? 'Goal Met' : 'লক্ষ্য অর্জিত'}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-300">{language === 'en' ? 'Wrist Mobility' : 'কব্জির গতিশীলতা'}</span>
                       <span className="text-blue-400">{localizeNumber(75, language)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-3/4 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-300">{language === 'en' ? 'Finger Extension' : 'আঙুলের প্রসারণ'}</span>
                       <span className="text-emerald-400">{localizeNumber(40, language)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-2/5 shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise Library */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-blue-500/20 rounded-3xl p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-semibold text-white">{language === 'en' ? 'Exercise Library' : 'ব্যায়ামের লাইব্রেরি'}</h3>
                   <span className="text-sm text-blue-400 cursor-pointer">{language === 'en' ? 'View Roadmap' : 'রোডম্যাপ দেখুন'}</span>
                 </div>
                 <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { 
                        title: language === 'en' ? "Finger Tendon Glides" : "আঙুলের টেন্ডন গাইড", 
                        time: language === 'en' ? "10 mins" : `${localizeNumber(10, language)} মিনিট`, 
                        level: language === 'en' ? "Beginner" : "শিক্ষানবিস" 
                      },
                      { 
                        title: language === 'en' ? "Wrist Flexion Stretch" : "কব্জি নমনীয় স্ট্রেচ", 
                        time: language === 'en' ? "5 mins" : `${localizeNumber(5, language)} মিনিট`, 
                        level: language === 'en' ? "Beginner" : "শিক্ষানবিস" 
                      },
                      { 
                        title: language === 'en' ? "Thumb Oppositions" : "থাম্ব অপজিশন", 
                        time: language === 'en' ? "8 mins" : `${localizeNumber(8, language)} মিনিট`, 
                        level: language === 'en' ? "Intermediate" : "মধ্যবর্তী" 
                      },
                      { 
                        title: language === 'en' ? "Grip Strengthening" : "গ্রিপ শক্তিশালীকরণ", 
                        time: language === 'en' ? "12 mins" : `${localizeNumber(12, language)} মিনিট`, 
                        level: language === 'en' ? "Beginner" : "শিক্ষানবিস" 
                      },
                    ].map((ex, i) => (
                      <div key={i} className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-2xl hover:bg-slate-800 hover:border-blue-500/30 border border-transparent transition-all cursor-pointer group">
                         <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                           <PlayCircle className="w-6 h-6 text-blue-400" />
                         </div>
                         <div>
                            <h4 className="font-medium text-slate-100">{ex.title}</h4>
                            <p className="text-xs text-slate-400">{ex.time} • {ex.level}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
               <Button className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] border-none transition-all">{language === 'en' ? 'Start Your Session' : 'আপনার সেশন শুরু করুন'}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan B Detailed Section */}
      <div 
        ref={planBRef}
        className={`transition-all duration-1000 overflow-hidden ${activePlan === 'B' ? 'max-h-[5000px] opacity-100 py-24' : 'max-h-0 opacity-0 py-0'}`}
        style={{ backgroundColor: '#08101a' }}
      >
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-16">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">{language === 'en' ? 'Guided Device Rehabilitation Ecosystem' : 'নির্দেশিত ডিভাইস রিহ্যাবিলিটেশন ইকোসিস্টেম'}</h2>
              <p className="text-xl text-cyan-200/80 max-w-2xl mx-auto">{language === 'en' ? 'Connect your physical therapy with real-time feedback and professional guidance.' : 'রিয়েল-টাইম ফিডব্যাক এবং পেশাদার নির্দেশনার সাথে আপনার ফিজিক্যাল থেরাপি সংযোগ করুন।'}</p>
            </div>
            
            {/* Split layout for Dashboard and Devices */}
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Smart Dashboard */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white border-b border-white/10 pb-4">{language === 'en' ? 'Smart Rehabilitation Dashboard' : 'স্মার্ট রিহ্যাবিলিটেশন ড্যাশবোর্ড'}</h3>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 shadow-2xl shadow-cyan-900/20">
                  <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                    <div className="relative">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute"></div>
                      <div className="w-3 h-3 bg-cyan-400 rounded-full relative"></div>
                    </div>
                    <span className="text-slate-300 font-medium">{language === 'en' ? 'Device Connected:' : 'ডিভাইস সংযুক্ত:'} <span className="text-cyan-400">HandRehab Pro v2</span></span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-sm text-slate-400 mb-1">{language === 'en' ? 'Live ROM (Wrist)' : 'লাইভ রম (কব্জি)'}</div>
                        <div className="text-2xl font-bold text-white">{localizeNumber(45.2, language)}°</div>
                     </div>
                     <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-sm text-slate-400 mb-1">{language === 'en' ? 'Grip Force' : 'গ্রিপ বল'}</div>
                        <div className="text-2xl font-bold text-white">{localizeNumber(12.4, language)} {language === 'en' ? 'kg' : 'কেজি'}</div>
                     </div>
                  </div>
                  
                  <div className="h-32 bg-white/5 rounded-2xl p-4 flex items-end gap-2 shrink-0 border border-white/5">
                     {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                       <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600/50 to-cyan-400 rounded-t-sm" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
                </div>
              </div>

              {/* Therapist System & Marketplace */}
              <div className="space-y-8">
                <div>
                   <h3 className="text-2xl font-semibold text-white border-b border-white/10 pb-4 mb-6">{language === 'en' ? 'Therapist System' : 'থেরাপিস্ট সিস্টেম'}</h3>
                   <div className="flex gap-4 items-center bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 hover:border-cyan-500/30 transition-all cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-cyan-900/30 overflow-hidden flex-shrink-0">
                         <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200" alt="Dr. Sarah Jenkins" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-white font-medium">{language === 'en' ? 'Dr. Sarah Jenkins' : 'ডা. সারা জেনকিন্স'}</h4>
                         <p className="text-sm text-cyan-400">{language === 'en' ? 'Orthopedic Physiotherapist • 8 yrs exp' : 'অর্থোপেডিক ফিজিওথেরাপিস্ট • ৮ বছরের অভিজ্ঞতা'}</p>
                         <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                           <span>⭐ {localizeNumber(4.9, language)} ({localizeNumber(120, language)} {language === 'en' ? 'reviews' : 'রিভিউ'})</span>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500 hover:text-white bg-transparent">{language === 'en' ? 'Choose' : 'নির্বাচন করুন'}</Button>
                   </div>
                </div>

                <div>
                   <h3 className="text-2xl font-semibold text-white border-b border-white/10 pb-4 mb-6">{language === 'en' ? 'Device Marketplace' : 'ডিভাইস মার্কেটপ্লেস'}</h3>
                   <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                      <div>
                         <h4 className="text-white font-medium">{language === 'en' ? 'HandRehab Pro Kit' : 'হ্যান্ডরিহ্যাব প্রো কিট'}</h4>
                         <p className="text-sm text-slate-400 mb-2">{language === 'en' ? 'Includes Exoskeleton + Sensors' : 'এক্সোস্কেলিটন + সেন্সর অন্তর্ভুক্ত'}</p>
                         <span className="text-cyan-400 font-bold">${localizeNumber(99, language)}/{language === 'en' ? 'mo' : 'মাস'} <span className="text-xs text-slate-500 font-normal">{language === 'en' ? 'Rental bundle' : 'ভাড়া বান্ডিল'}</span></span>
                      </div>
                      <Button size="sm" className="bg-white/10 hover:bg-cyan-500 text-white border-none">{language === 'en' ? 'Add to Plan' : 'প্ল্যানে যোগ করুন'}</Button>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Live Device Game Demo Section */}
            <LiveDeviceDemo />
          </div>
        </div>
      </div>

      {/* Plan B+ Detailed Section */}
      <div 
        ref={planBPlusRef}
        className={`transition-all duration-1000 overflow-hidden ${activePlan === 'B+' ? 'max-h-[5000px] opacity-100 py-24' : 'max-h-0 opacity-0 py-0'}`}
        style={{ backgroundColor: '#0f0a1f' }}
      >
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                {language === 'en' ? 'Enterprise Healthcare' : 'এন্টারপ্রাইজ হেলথকেয়ার'}
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">{language === 'en' ? 'Specialist Assisted Portal' : 'বিশেষজ্ঞ সহায়ক পোর্টাল'}</h2>
              <p className="text-xl text-purple-200/70">{language === 'en' ? 'The ultimate medical management experience for complete recovery.' : 'সম্পূর্ণ পুনরুদ্ধারের জন্য চরম চিকিৎসা ব্যবস্থাপনা অভিজ্ঞতা।'}</p>
            </div>
            
            <div className="grid lg:grid-cols-12 gap-8">
               {/* Left Column - Doctor profiles & Schedule */}
               <div className="lg:col-span-4 space-y-6">
                 <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
                    <h3 className="text-lg font-semibold text-white mb-4">{language === 'en' ? 'Your Specialist Team' : 'আপনার বিশেষজ্ঞ দল'}</h3>
                    <div className="space-y-4">
                       {[
                         { name: language === 'en' ? "Dr. Robert Chen" : "ডা. রবার্ট চেন", role: language === 'en' ? "Chief Neurologist" : "প্রধান নিউরোলজিস্ট", status: "Online" },
                         { name: language === 'en' ? "Linda Maxwell" : "লিন্ডা ম্যাক্সওয়েল", role: language === 'en' ? "Senior Rehab Specialist" : "সিনিয়র রিহ্যাব বিশেষজ্ঞ", status: "In Session" }
                       ].map((doc, i) => (
                         <div key={i} className="flex gap-3 items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex flex-shrink-0 items-center justify-center text-purple-300 font-bold">
                              {doc.name.charAt(language==='en' ? 4 : 0)}
                            </div>
                            <div className="flex-1">
                               <div className="text-sm font-medium text-white">{doc.name}</div>
                               <div className="text-xs text-purple-300/70">{doc.role}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full shadow-[0_0_5px_rgba(168,85,247,0.8)]" style={{ backgroundColor: doc.status === 'Online' ? '#10b981' : '#f59e0b'}}></div>
                         </div>
                       ))}
                    </div>
                    <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border-0">{language === 'en' ? 'Request Video Consult' : 'ভিডিও পরামর্শের অনুরোধ করুন'}</Button>
                 </div>
               </div>

               {/* Center/Right Column - Insights, Analytics, Reports */}
               <div className="lg:col-span-8 space-y-6">
                 <div className="grid sm:grid-cols-2 gap-6">
                    {/* Insights Widget */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-colors cursor-default">
                       <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-all"></div>
                       <h3 className="text-lg font-semibold text-white mb-3">{language === 'en' ? 'AI Recovery Insights' : 'এআই রিকভারি ইনসাইট'}</h3>
                       <p className="text-sm text-slate-300 leading-relaxed">
                         {language === 'en' ? '"Patient is showing 22% faster progression in grasp force than average. Recommendation: Increase resistance profile by 5% on next session."' : '"রোগী গড়ের চেয়ে গ্রাস ফোর্সে ২২% দ্রুত অগ্রগতি দেখাচ্ছে। সুপারিশ: পরবর্তী সেশনে প্রতিরোধের প্রোফাইল ৫% বাড়ান।"'}
                       </p>
                       <div className="mt-5 text-xs font-bold text-purple-400 tracking-wide uppercase flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div> {language === 'en' ? 'Positive Outlook' : 'ইতিবাচক দৃষ্টিভঙ্গি'}
                       </div>
                    </div>

                    {/* Prescription Widget */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6">
                       <h3 className="text-lg font-semibold text-white mb-4">{language === 'en' ? 'Prescription & Reports' : 'প্রেসক্রিপশন এবং রিপোর্ট'}</h3>
                       <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent mb-3 hover:bg-white/10 hover:border-purple-500/30 cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                             <FileBarChart className="w-5 h-5 text-purple-400" />
                             <span className="text-sm text-white font-medium">Q2 Clinical Assessment.pdf</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:bg-white/10 hover:border-purple-500/30 cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                             <ActivitySquare className="w-5 h-5 text-purple-400" />
                             <span className="text-sm text-white font-medium">Updated Therapy Plan</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Advanced Charts fake */}
                 <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 h-64 flex flex-col justify-between overflow-hidden relative">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                       <h3 className="text-lg font-semibold text-white">{language === 'en' ? 'Full Recovery Trajectory' : 'সম্পূর্ণ রিকভারি ট্রাজেক্টরি'}</h3>
                       <span className="text-xs text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-md font-medium shadow-[0_0_10px_rgba(168,85,247,0.2)]">{language === 'en' ? 'Expected timeline: 4wks' : `প্রত্যাশিত সময়রেখা: ${localizeNumber(4, language)} সপ্তাহ`}</span>
                    </div>
                    {/* Fake complex graph */}
                    <div className="flex-1 relative w-full mt-2 h-full z-0">
                       {/* Grid lines */}
                       <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                          <div className="w-full h-px bg-purple-400"></div>
                          <div className="w-full h-px bg-purple-400"></div>
                          <div className="w-full h-px bg-purple-400"></div>
                          <div className="w-full h-px bg-purple-400"></div>
                       </div>
                       <svg className="absolute inset-0 w-full h-[120%] overflow-visible -mt-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" preserveAspectRatio="none">
                          <path d="M0,150 Q100,140 200,90 T400,60 T600,10" fill="none" stroke="url(#purpleGradient)" strokeWidth="6"/>
                          <defs>
                             <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                               <stop offset="0%" stopColor="#c084fc"/>
                               <stop offset="100%" stopColor="#d8b4fe"/>
                             </linearGradient>
                          </defs>
                       </svg>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Patient Workflow */}
            <div className="space-y-6">
              <div className="text-blue-600 font-bold tracking-widest uppercase text-sm">{language === 'en' ? 'Patient Recovery Journey' : 'রোগীর পুনরুদ্ধারের যাত্রা'}</div>
              <h3 className="text-3xl font-bold text-slate-900">{language === 'en' ? 'Empowering At-Home Recovery' : 'বাড়িতে রিকভারি ক্ষমতায়ন'}</h3>
              <p className="text-slate-600">{language === 'en' ? 'Patients engage with gamified, precise therapies from home while remaining connected to their care team securely.' : 'রোগীরা নিরাপদে তাদের কেয়ার টিমের সাথে সংযুক্ত থেকে বাড়ি থেকে গ্যামিফাইড, সুনির্দিষ্ট থেরাপি গ্রহণ করে।'}</p>
              <ul className="space-y-3 pt-4">
                {[
                  language === 'en' ? 'Live progress charts' : 'লাইভ অগ্রগতি চার্ট', 
                  language === 'en' ? 'Pain/fatigue check-ins' : 'ব্যথা/ক্লান্তি চেক-ইন', 
                  language === 'en' ? 'Video instructions' : 'ভিডিও নির্দেশাবলী'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-4" onClick={handlePatientLogin}>{language === 'en' ? 'Patient Login' : 'রোগীর লগইন'} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>

            {/* Physio Workflow */}
            <div className="bg-white rounded-3xl border shadow-xl p-8 z-10 lg:-mt-8 lg:-mb-8 flex flex-col">
              <div className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-6">{language === 'en' ? 'Physiotherapist Workflow' : 'ফিজিওথেরাপিস্ট ওয়ার্কফ্লো'}</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">{language === 'en' ? 'Drive Active Rehabilitation' : 'সক্রিয় পুনর্বাসন ড্রাইভ করুন'}</h3>
              <p className="text-slate-600 mb-6">{language === 'en' ? 'Physiotherapists manage day-to-day session compliance, adjust dynamic intensities within doctor limits, and compile daily shift notes.' : 'ফিজিওথেরাপিস্টরা প্রতিদিনের সেশন পরিচালনা করে, ডাক্তারের সীমার মধ্যে গতিশীল তীব্রতা সামঞ্জস্য করে এবং দৈনিক শিফট নোট কম্পাইল করে।'}</p>
              <ul className="space-y-3 pt-4 mb-8 flex-1">
                {[
                  language === 'en' ? 'Build custom exercise plans' : 'উন্নত ব্যায়াম পরিকল্পনা তৈরি', 
                  language === 'en' ? 'Adjust device parameters remotely' : 'দূরবর্তীভাবে ডিভাইস পরামিতি সামঞ্জস্য', 
                  language === 'en' ? 'Auto-flag abnormal pain readings' : 'অস্বাভাবিক ব্যথার পাঠ্য স্বয়ংক্রিয়ভাবে ফ্ল্যাগ'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                     <CheckCircle2 className="w-5 h-5 text-indigo-500" /> {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handlePhysioLogin}>{language === 'en' ? 'Physiotherapist Login' : 'ফিজিওথেরাপিস্ট লগইন'} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>

            {/* Doctor Workflow */}
            <div className="space-y-6 lg:pl-8">
              <div className="text-emerald-600 font-bold tracking-widest uppercase text-sm">{language === 'en' ? 'Doctor Supervision' : 'ডাক্তারের তত্ত্বাবধান'}</div>
              <h3 className="text-3xl font-bold text-slate-900">{language === 'en' ? 'Clinical Oversight & Safety' : 'ক্লিনিকাল ওভারসাইট এবং নিরাপত্তা'}</h3>
              <p className="text-slate-600">{language === 'en' ? 'Specialists maintain high-level supervision, approving therapy plans, setting hard physiological safety thresholds, and auditing outcomes.' : 'বিশেষজ্ঞরা উচ্চ-পর্যায়ের তত্ত্বাবধান বজায় রাখে, থেরাপি পরিকল্পনার অনুমোদন দেয়, শারীরবৃত্তীয় নিরাপত্তার সীমা নির্ধারণ করে এবং ফলাফলের নিরীক্ষা করে।'}</p>
              <ul className="space-y-3 pt-4">
                {[
                  language === 'en' ? 'Approve/modify therapy plans' : 'থেরাপি পরিকল্পনা অনুমোদন/পরিবর্তন', 
                  language === 'en' ? 'Review secure clinical notes' : 'নিরাপদ ক্লিনিকাল নোট বিশ্লেষণ', 
                  language === 'en' ? 'Finalize medical reports' : 'মেডিকেল রিপোর্ট চূড়ান্তকরণ'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
               <Button variant="outline" className="mt-4" onClick={handleDoctorLogin}>{language === 'en' ? 'Doctor Login' : 'ডাক্তারের লগইন'} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Compliance */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Activity className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold">{strings.AppName}</span>
            </div>
            <p className="text-sm max-w-md">
              {language === 'en' 
                ? 'Providing medical-grade telemetry, clinical governance, and robust RBAC for remote robotic physiotherapy.' 
                : 'রিমোট রোবোটিক ফিজিওথেরাপির জন্য মেডিকেল-গ্রেড টেলিমেট্রি, ক্লিনিক্যাল সুশাসন এবং শক্তিশালী RBAC প্রদান করে।'}
            </p>
          </div>
          <div className="md:text-right text-xs space-y-2">
            <p className="font-semibold text-slate-300">MEDICAL DISCLAIMER</p>
            <p>This platform supports rehabilitation supervision but does not replace emergency medical care. Consult your physician in an emergency.</p>
            <div className="flex gap-4 md:justify-end pt-4">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
