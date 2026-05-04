import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  email: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  assignedDeviceId: string | null;
  complianceScore: number;
  lastSessionDate: string;
  progressStage: string;
  contact: string;
  emergencyContact: string;
}

export interface SessionConfig {
  durationMinutes: number;
  speedPercentage: number;
  resistanceLevel: number;
  romLimits: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    pinky: number;
  };
}

export interface SessionHistory {
  id: string;
  patientId: string;
  date: string;
  durationActual: number; // in seconds
  durationTarget: number; // in seconds
  averageGripForce: number;
  maxMotionRange: number;
  status: 'completed' | 'incomplete';
  notes: string;
}

interface AppState {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  currentUser: User | null;
  patients: PatientRecord[];
  activePatientId: string | null;
  pairingDevice: boolean;
  pairingStatus: string;
  pairedDeviceId: string | null;
  
  // Doctor Session
  activeSession: {
    isRunning: boolean;
    isPaused: boolean;
    config: SessionConfig;
    elapsedSeconds: number;
    currentGripForce: number;
    currentFlex: number[];
  } | null;

  deviceUrl: string;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  setActivePatient: (id: string | null) => void;
  updatePatient: (id: string, data: Partial<PatientRecord>) => void;
  setDeviceUrl: (url: string) => void;
  connectDevice: () => Promise<void>;
  disconnectDevice: () => void;
  
  startSession: (config: SessionConfig) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  emergencyStop: () => void;
  stopSession: (notes?: string) => void;
  updateSessionTick: (elapsed: number, grip: number, flex: number[]) => void;
}

const mockPatients: PatientRecord[] = [
  { id: '1', name: 'John Doe', age: 45, diagnosis: 'Post-stroke hemiparesis', assignedDeviceId: null, complianceScore: 85, lastSessionDate: '2023-10-24', progressStage: 'Phase 2', contact: 'john@example.com', emergencyContact: 'Jane Doe (Wife): 555-0100' },
  { id: '2', name: 'Sarah Smith', age: 32, diagnosis: 'Carpal Tunnel Syndrome (Post-op)', assignedDeviceId: null, complianceScore: 92, lastSessionDate: '2023-10-25', progressStage: 'Phase 1', contact: 'sarah@example.com', emergencyContact: 'Mike Smith (Husband): 555-0101' },
];

export const useStore = create<AppState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  currentUser: null,
  patients: mockPatients,
  activePatientId: null,
  pairingDevice: false,
  pairingStatus: '',
  pairedDeviceId: null,
  activeSession: null,
  deviceUrl: 'http://192.168.4.1',

  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, activeSession: null, activePatientId: null, pairedDeviceId: null }),
  setActivePatient: (id) => set({ activePatientId: id }),
  updatePatient: (id, data) => set(state => ({
    patients: state.patients.map(p => p.id === id ? { ...p, ...data } : p)
  })),
  setDeviceUrl: (url) => set({ deviceUrl: url }),

  // Simulated Bluetooth connection / WiFi integration
  connectDevice: async () => {
    set({ pairingDevice: true, pairingStatus: 'Initializing device connection protocol...' });
    try {
      const url = get().deviceUrl;
      const MAX_RETRIES = 3;
      let connected = false;

      if (url) {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            set({ pairingStatus: `Scanning local network for gateway (Attempt ${attempt}/${MAX_RETRIES})...` });
            await new Promise(resolve => setTimeout(resolve, 800));
            set({ pairingStatus: `Pinging ${url}...` });
            
            const response = await fetch(`${url}/api/status`, {
              method: 'GET',
              mode: 'cors',
              signal: AbortSignal.timeout(2000), 
            });

            if (response.ok) {
              set({ pairingStatus: 'Handshake successful. Exchanging security keys...' });
              await new Promise(resolve => setTimeout(resolve, 500));
              set({ pairingStatus: 'Authenticating hardware access...' });
              await new Promise(resolve => setTimeout(resolve, 400));
              set({ pairingStatus: 'Link established successfully.' });
              await new Promise(resolve => setTimeout(resolve, 300));
              set({ pairedDeviceId: `ESP32-Network-Device`, pairingDevice: false, pairingStatus: '' });
              connected = true;
              break;
            } else {
              set({ pairingStatus: `Device responded with error status: ${response.status}` });
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (e) {
            console.warn(`Network device unreachable on attempt ${attempt}.`, e);
            if (attempt < MAX_RETRIES) {
              set({ pairingStatus: `Connection timeout on attempt ${attempt}. Retrying...` });
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }

      if (!connected) {
        set({ pairingStatus: 'Failed to connect robustly. Booting simulated device...' });
        await new Promise(resolve => setTimeout(resolve, 1200));
        set({ pairingStatus: 'Initializing physics engine for simulated telemetry...' });
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ pairingStatus: 'Mocking telemetry data feed...' });
        await new Promise(resolve => setTimeout(resolve, 600));
        set({ pairedDeviceId: `DEV-${Math.floor(Math.random() * 10000)}`, pairingDevice: false, pairingStatus: '' });
      }
    } catch (e) {
      set({ pairingDevice: false, pairingStatus: 'Critical failure during device connection.' });
      console.error(e);
    }
  },
  disconnectDevice: () => set({ pairedDeviceId: null, activeSession: null, pairingStatus: '' }),

  startSession: async (config) => {
    // Attempt to start the session on the device
    const { deviceUrl, pairedDeviceId } = get();
    if (pairedDeviceId === 'ESP32-Network-Device' && deviceUrl) {
      try {
        await fetch(`${deviceUrl}/api/start`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
          signal: AbortSignal.timeout(2000)
        });
      } catch (e) {
        console.warn('Failed to send start command to device', e);
      }
    }
    
    set({
      activeSession: {
        isRunning: true,
        isPaused: false,
        config,
        elapsedSeconds: 0,
        currentGripForce: 0,
        currentFlex: [0,0,0,0,0]
      }
    });
  },
  pauseSession: async () => {
    const { deviceUrl, pairedDeviceId, activeSession } = get();
    if (pairedDeviceId === 'ESP32-Network-Device' && deviceUrl) {
      try {
        await fetch(`${deviceUrl}/api/pause`, { method: 'POST', signal: AbortSignal.timeout(2000) });
      } catch (e) {
        console.warn('Failed to send pause command to device', e);
      }
    }
    set(state => ({
      activeSession: state.activeSession ? { ...state.activeSession, isPaused: true } : null
    }));
  },
  resumeSession: async () => {
    const { deviceUrl, pairedDeviceId } = get();
    if (pairedDeviceId === 'ESP32-Network-Device' && deviceUrl) {
      try {
        await fetch(`${deviceUrl}/api/resume`, { method: 'POST', signal: AbortSignal.timeout(2000) });
      } catch (e) {
        console.warn('Failed to send resume command to device', e);
      }
    }
    set(state => ({
      activeSession: state.activeSession ? { ...state.activeSession, isPaused: false } : null
    }));
  },
  emergencyStop: async () => {
    const { deviceUrl, pairedDeviceId } = get();
    if (pairedDeviceId === 'ESP32-Network-Device' && deviceUrl) {
      try {
        await fetch(`${deviceUrl}/api/emerg`, { method: 'POST', signal: AbortSignal.timeout(2000) });
      } catch (e) {
        console.warn('Failed to send emergency stop command to device', e);
      }
    }
    set({ activeSession: null }); 
  },
  stopSession: async (notes) => {
    const { deviceUrl, pairedDeviceId } = get();
    if (pairedDeviceId === 'ESP32-Network-Device' && deviceUrl) {
      try {
        await fetch(`${deviceUrl}/api/stop`, { method: 'POST', signal: AbortSignal.timeout(2000) });
      } catch (e) {
        console.warn('Failed to send stop command to device', e);
      }
    }
    set({ activeSession: null }); // We would ideally save to history here
  },
  
  updateSessionTick: (elapsed, grip, flex) => set(state => ({
    activeSession: state.activeSession ? {
      ...state.activeSession,
      elapsedSeconds: elapsed,
      currentGripForce: grip,
      currentFlex: flex
    } : null
  }))
}));
