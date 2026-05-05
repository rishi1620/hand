import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold mb-4">Contact HandRehab Pro</h1>
      <p className="text-slate-600 mb-8">Request a demo, ask a question, or report an issue.</p>
      
      <form className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm" onSubmit={(e) => { e.preventDefault(); alert('Demo contact submitted successfully.'); }}>
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input required type="text" className="w-full border rounded-lg p-3" placeholder="Dr. Smith" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input required type="email" className="w-full border rounded-lg p-3" placeholder="email@clinic.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea required className="w-full border rounded-lg p-3 h-32" placeholder="How can we help?" />
        </div>
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
    </div>
  );
}
