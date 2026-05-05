export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white">System Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800">
          <h2 className="text-slate-400 text-sm font-bold uppercase mb-2">Total Patients</h2>
          <div className="text-4xl text-white font-mono">1,429</div>
        </div>
        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800">
          <h2 className="text-slate-400 text-sm font-bold uppercase mb-2">Active Devices</h2>
          <div className="text-4xl text-white font-mono">84</div>
        </div>
        <div className="p-6 bg-emerald-950/30 rounded-xl border border-emerald-900">
          <h2 className="text-emerald-500 text-sm font-bold uppercase mb-2">System Status</h2>
          <div className="text-4xl text-emerald-400 font-mono">100% UP</div>
        </div>
      </div>
    </div>
  );
}
