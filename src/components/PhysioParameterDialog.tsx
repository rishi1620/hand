import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ParameterProps {
  label: string;
  value: number;
  min: number;
  max: number;
  approvedMax: number;
  unit: string;
  onChange: (val: number) => void;
}

function ParameterSlider({ label, value, min, max, approvedMax, unit, onChange }: ParameterProps) {
  const isOverApproved = value > approvedMax;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-mono font-medium">
          {value} {unit}
        </span>
      </div>
      
      <div className="relative pt-1 pb-4">
        {/* Approved Limit Indicator */}
        <div 
          className="absolute top-0 bottom-0 border-r-2 border-emerald-500 z-10 pointer-events-none"
          style={{ left: `${((approvedMax - min) / (max - min)) * 100}%` }}
        >
          <div className="absolute top-full mt-1 -translate-x-1/2 text-[10px] font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            MD Max: {approvedMax} {unit}
          </div>
        </div>
        
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={1}
          onValueChange={(vals) => onChange(vals[0])}
          className={`${isOverApproved ? '[&_[role=slider]]:border-amber-500 [&_[role=slider]]:bg-amber-100 [&_.absolute.h-full.bg-primary]:bg-amber-500' : ''}`}
        />
      </div>

      {isOverApproved && (
        <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Value exceeds safely approved MD limits. Approval request required.</span>
        </div>
      )}
    </div>
  );
}

export function PhysioParameterDialog({ patientName, patientId, trigger }: { patientName: string, patientId: string, trigger?: React.ReactNode }) {
  // Local state for the parameters
  const [resistance, setResistance] = useState(5);
  const [speed, setSpeed] = useState(3);
  const [reps, setReps] = useState(20);
  const [rom, setRom] = useState(60);

  // Hardcoded simulated approved limits
  const limits = {
    resistance: 6,
    speed: 4,
    reps: 30,
    rom: 75,
  };

  const isAnyOverLimit = resistance > limits.resistance || speed > limits.speed || reps > limits.reps || rom > limits.rom;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-2">
            <Settings2 className="w-4 h-4" /> Parameters
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Therapy Parameters</DialogTitle>
          <DialogDescription>
            Configuring session limits for <span className="font-semibold text-slate-800">{patientName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <ParameterSlider
            label="Resistance Level"
            value={resistance}
            min={1}
            max={10}
            approvedMax={limits.resistance}
            unit="lvl"
            onChange={setResistance}
          />

          <ParameterSlider
            label="Movement Speed"
            value={speed}
            min={1}
            max={10}
            approvedMax={limits.speed}
            unit="lvl"
            onChange={setSpeed}
          />

          <ParameterSlider
            label="Repetition Count"
            value={reps}
            min={5}
            max={50}
            approvedMax={limits.reps}
            unit="reps"
            onChange={setReps}
          />

          <ParameterSlider
            label="Range of Motion (ROM)"
            value={rom}
            min={10}
            max={100}
            approvedMax={limits.rom}
            unit="%"
            onChange={setRom}
          />
        </div>

        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
           <DialogClose asChild>
             <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
           </DialogClose>
           <Button 
             className={`w-full sm:w-auto ${isAnyOverLimit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
           >
             {isAnyOverLimit ? (
               <><AlertTriangle className="w-4 h-4 mr-2" /> Request MD Approval</>
             ) : (
               <><ShieldCheck className="w-4 h-4 mr-2" /> Apply Safely</>
             )}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
