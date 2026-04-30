import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted  px-6 text-center">
      <h1 className="text-7xl font-extrabold text-slate-800 tracking-tighter mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-6">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. Check the
        URL or navigate back home.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    </div>
  );
}
