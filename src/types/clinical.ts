export interface Assessment {
  id: string;
  patientId: string;
  type: 'Barthel Index' | 'Berg Balance Scale' | 'Modified Ashworth Scale';
  date: string;
  assessorId: string;
  assessorName: string;
  totalScore: number;
  interpretation: string;
  clinicalNotes: string;
  recommendedPlan: string;
  details: any;
}

export interface BarthelIndexDetails {
  feeding: number;
  bathing: number;
  grooming: number;
  dressing: number;
  bowels: number;
  bladder: number;
  toiletUse: number;
  transfers: number;
  mobility: number;
  stairs: number;
}

export interface BergBalanceScaleDetails {
  sittingToStanding: number;
  standingUnsupported: number;
  sittingUnsupported: number;
  standingToSitting: number;
  transfers: number;
  standingEyesClosed: number;
  standingFeetTogether: number;
  reachingForward: number;
  retrievingObject: number;
  turningBehind: number;
  turning360: number;
  alternateFootOnStool: number;
  standingOneFootFront: number;
  standingOnOneFoot: number;
}

export interface MASMuscleEntry {
  muscleGroup: string;
  side: 'Left' | 'Right';
  beforeSessionScore: string;
  afterSessionScore: string;
  notes: string;
}

export interface ModifiedAshworthScaleDetails {
  entries: MASMuscleEntry[];
}
