// Types for Biologix API based on Manual_API_Biologix_exames.md

export interface SessionResponse {
  sessionId: string;
  userId: string;
  tokenStart: string;
  mfaVerified: boolean;
}

export interface ExamBaseDto {
  startTime: string; // UTC datetime
  durationSecs: number;
  conditions: string[];
  treatments: string[];
  symptoms: string[];
  illnesses: string[];
  medicines: string[];
  weightKg: number;
  heightCm: number;
}

export interface ExamResultSnoringDto {
  validDurationSecs: number;
  snoringDurationSecs: number;
  silentDurationPercent: number;
  lowDurationPercent: number;
  mediumDurationPercent: number;
  highDurationPercent: number;
}

export interface ExamResultOximetryDto {
  validDurationSecs: number;
  nbDesaturations: number;
  odi: number; // Índice de dessaturações de oxigênio (IDO)
  hypoxicBurden: number;
  odiCategory: number; // 0=Normal, 1=Leve, 2=Moderado, 3=Acentuado
  spO2Min: number;
  spO2Avg: number;
  spO2Max: number;
  spO2Under90Secs: number;
  spO2Under80Secs: number;
  hrMin: number;
  hrAvg: number;
  hrMax: number;
  sleepLatencySecs: number;
  sleepDurationSecs: number;
  sleepEfficiencyPercent: number;
  wakeTimeAfterSleepSecs: number;
  nbHypoxemiaEvents: number;
  hypoxemiaTotalDurationSecs: number;
}

export interface ExamResultCardiologyDto {
  afNotification: number; // 0=Negativa, 1=Positiva, <0=Inconclusivo
}

export interface ExamResultDto {
  snoring?: ExamResultSnoringDto;
  oximetry?: ExamResultOximetryDto;
  cardiology?: ExamResultCardiologyDto;
}

export interface ExamPatientDto {
  name: string;
  gender: string; // 'f', 'm', 'o'
  email: string;
  phone: string;
  birthDate: string;
  age: number;
  username: string; // CPF is embedded in username
}

export interface ExamDto {
  base?: ExamBaseDto;
  examId: string;
  examKey: string;
  status: number; // 0=ISSUED, 1=STARTED, 2=CANCELLED, 3=SCHEDULED, 4=PROCESSING, 5=ERROR, 6=DONE, 7=PROCESS_ERROR
  type: number; // 0=Teste do Ronco, 1=Exame do Sono
  patientUserId: string;
  result?: ExamResultDto;
  patient: ExamPatientDto;
}

export interface ExamsResponse {
  exams: ExamDto[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

// Exam Status Constants
export const EXAM_STATUS = {
  ISSUED: 0,
  STARTED: 1,
  CANCELLED: 2,
  SCHEDULED: 3,
  PROCESSING: 4,
  ERROR: 5,
  DONE: 6,
  PROCESS_ERROR: 7,
} as const;

// Exam Type Constants
export const EXAM_TYPE = {
  RONCO: 0,
  SONO: 1,
} as const;

// IDO Category Constants
export const IDO_CATEGORY = {
  NORMAL: 0,
  LEVE: 1,
  MODERADO: 2,
  ACENTUADO: 3,
} as const;

