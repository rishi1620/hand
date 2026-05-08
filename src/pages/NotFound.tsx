import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";

export default function NotFound() {
  const navigate = useNavigate();
  const { language } = useStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted  px-6 text-center">
      <h1 className="text-7xl font-extrabold text-slate-800 tracking-tighter mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-6">{language === 'en' ? 'Page Not Found' : 'পৃষ্ঠা পাওয়া যায়নি'}</h2>
      <p className="text-slate-500 max-w-md mb-8">
        {language === 'en' ? "The page you are looking for doesn't exist or has been moved. Check the URL or navigate back home." : "আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে। URL চেক করুন বা মূল পৃষ্ঠায় ফিরে যান।"}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          {language === 'en' ? 'Go Back' : 'ফিরে যান'}
        </Button>
        <Button onClick={() => navigate("/")}>{language === 'en' ? 'Return Home' : 'হোম এ ফিরে যান'}</Button>
      </div>
    </div>
  );
}
