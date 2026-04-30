import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppStrings } from "@/config/strings";
import { useStore } from "@/store";
import { Activity, Stethoscope, UserCircle, Globe } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const setLogin = useStore((state) => state.login);
  const { language, setLanguage } = useStore();
  const strings = AppStrings[language];

  const handleDoctorLogin = () => {
    setLogin({
      id: "doc-1",
      name: "Dr. Emily Chen",
      role: "doctor",
      email: "doc@example.com",
    });
    navigate("/doctor/dashboard");
  };

  const handlePatientLogin = () => {
    setLogin({
      id: "1",
      name: "John Doe",
      role: "patient",
      email: "john@example.com",
    });
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b flex justify-between items-center bg-white ">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{strings.AppName}</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <Button
            aria-label="Toggle Language"
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="gap-2"
          >
            <Globe aria-hidden="true" className="w-4 h-4" />
            {language === "en" ? "বাংলা" : "English"}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl">
            {strings.Tagline}
          </h1>
          <p className="text-xl text-muted-foreground  max-w-2xl">
            {strings.Description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              size="lg"
              className="h-14 px-8 text-lg gap-2"
              onClick={handleDoctorLogin}
            >
              <Stethoscope className="w-5 h-5" />
              {strings.DoctorLoginBtn}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg gap-2"
              onClick={handlePatientLogin}
            >
              <UserCircle className="w-5 h-5" />
              {strings.PatientLoginBtn}
            </Button>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Remote Control",
              desc: "Physiotherapists can adjust device resistance and speed remotely.",
            },
            {
              title: "Live Monitoring",
              desc: "Real-time feedback on range of motion and grip strength.",
            },
            {
              title: "Detailed Reports",
              desc: "Comprehensive analytics for tracking recovery progress over time.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-muted  border"
            >
              <h3 className="text-xl font-semibold mb-2">
                {language === "en"
                  ? feature.title
                  : feature.title === "Remote Control"
                    ? "রিমোট কন্ট্রোল"
                    : feature.title === "Live Monitoring"
                      ? "লাইভ মনিটরিং"
                      : "বিস্তারিত রিপোর্ট"}
              </h3>
              <p className="text-muted-foreground ">
                {language === "en"
                  ? feature.desc
                  : feature.title === "Remote Control"
                    ? "ফিজিওথেরাপিস্টরা ডিভাইসের প্রতিরোধ এবং গতি রিমোটভাবে সেট করতে পারেন।"
                    : feature.title === "Live Monitoring"
                      ? "মোশন সীমা এবং মুষ্টির শক্তির রিয়েল-টাইম প্রতিক্রিয়া।"
                      : "সময়ের সাথে পুনরুদ্ধারের অগ্রগতি ট্র্যাক করার জন্য বিস্তৃত বিশ্লেষণ।"}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
