import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppStrings } from "@/config/strings";
import { useStore } from "@/store";
import { 
  Activity, Stethoscope, UserCircle, Globe, ChevronRight, CheckCircle2, 
  ActivitySquare, ShieldCheck, FileBarChart, Gamepad2, HeartHandshake,
  ArrowRight, PlayCircle
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const setLogin = useStore((state) => state.login);
  const { language, setLanguage } = useStore();
  const strings = AppStrings[language];

  // Auth simulators
  const handleDoctorLogin = () => {
    navigate("/login/doctor");
  };

  const handlePatientLogin = () => {
    navigate("/login/patient");
  };

  const handlePhysioLogin = () => {
    navigate("/login/physiotherapist");
  };

  const handleAdminLogin = () => {
    navigate("/login/admin");
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
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
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
            <div className="pt-12 text-sm text-slate-400">
              <span className="cursor-pointer hover:text-slate-600 transition-colors" onClick={handleAdminLogin}>System Admin Login (Demo)</span>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none" />
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

      {/* Roles Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Patient Workflow */}
            <div className="space-y-6">
              <div className="text-blue-600 font-bold tracking-widest uppercase text-sm">{language === 'en' ? 'Patient Recovery Journey' : 'রোগীর পুনরুদ্ধারের যাত্রা'}</div>
              <h3 className="text-3xl font-bold text-slate-900">Empowering At-Home Recovery</h3>
              <p className="text-slate-600">Patients engage with gamified, precise therapies from home while remaining connected to their care team securely.</p>
              <ul className="space-y-3 pt-4">
                {['Live progress charts', 'Pain/fatigue check-ins', 'Video instructions'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-4" onClick={handlePatientLogin}>Patient Login <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>

            {/* Physio Workflow */}
            <div className="bg-white rounded-3xl border shadow-xl p-8 z-10 lg:-mt-8 lg:-mb-8 flex flex-col">
              <div className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-6">{language === 'en' ? 'Physiotherapist Workflow' : 'ফিজিওথেরাপিস্ট ওয়ার্কফ্লো'}</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Drive Active Rehabilitation</h3>
              <p className="text-slate-600 mb-6">Physiotherapists manage day-to-day session compliance, adjust dynamic intensities within doctor limits, and compile daily shift notes.</p>
              <ul className="space-y-3 pt-4 mb-8 flex-1">
                {['Build custom exercise plans', 'Adjust device parameters remotely', 'Auto-flag abnormal pain readings'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                     <CheckCircle2 className="w-5 h-5 text-indigo-500" /> {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handlePhysioLogin}>Physiotherapist Login <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>

            {/* Doctor Workflow */}
            <div className="space-y-6 lg:pl-8">
              <div className="text-emerald-600 font-bold tracking-widest uppercase text-sm">{language === 'en' ? 'Doctor Supervision' : 'ডাক্তারের তত্ত্বাবধান'}</div>
              <h3 className="text-3xl font-bold text-slate-900">Clinical Oversight & Safety</h3>
              <p className="text-slate-600">Specialists maintain high-level supervision, approving therapy plans, setting hard physiological safety thresholds, and auditing outcomes.</p>
              <ul className="space-y-3 pt-4">
                {['Approve/modify therapy plans', 'Review secure clinical notes', 'Finalize medical reports'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
               <Button variant="outline" className="mt-4" onClick={handleDoctorLogin}>Doctor Login <ArrowRight className="w-4 h-4 ml-2" /></Button>
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
