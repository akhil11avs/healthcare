// ==========================================
// HEALTHOS — Shared TypeScript Types
// ==========================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  avatarUrl?: string;
}

export type PatientStatus = 'Active' | 'Discharged' | 'Critical' | 'Recovering' | 'Scheduled';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Vital {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: string;
}

export interface Visit {
  id: string;
  date: string;
  type: string;
  doctor: string;
  notes: string;
  diagnosis: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  condition: string;
  status: PatientStatus;
  doctor: string;
  department: string;
  admittedDate: string;
  avatarInitials: string;
  avatarColor: string;
  insurance: string;
  vitals: Vital[];
  visits: Visit[];
  medications: string[];
  allergies: string[];
}

export interface AnalyticsDataPoint {
  month: string;
  admissions: number;
  discharges: number;
  revenue: number;
}

export interface DiagnosisData {
  name: string;
  value: number;
  color: string;
}

export interface DepartmentData {
  department: string;
  patients: number;
  capacity: number;
  utilization: number;
}

export interface KPICard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
  trend: number[];
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctor: string;
  time: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'critical';
}

export type ViewMode = 'grid' | 'list';
