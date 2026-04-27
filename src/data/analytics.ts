import type { AnalyticsDataPoint, DiagnosisData, DepartmentData } from '../types';

export const admissionsData: AnalyticsDataPoint[] = [
  { month: 'Jul', admissions: 134, discharges: 120, revenue: 285000 },
  { month: 'Aug', admissions: 148, discharges: 135, revenue: 312000 },
  { month: 'Sep', admissions: 142, discharges: 138, revenue: 298000 },
  { month: 'Oct', admissions: 162, discharges: 155, revenue: 341000 },
  { month: 'Nov', admissions: 158, discharges: 148, revenue: 327000 },
  { month: 'Dec', admissions: 171, discharges: 162, revenue: 368000 },
  { month: 'Jan', admissions: 185, discharges: 174, revenue: 392000 },
];

export const diagnosisData: DiagnosisData[] = [
  { name: 'Cardiology',    value: 28, color: '#3b82f6' },
  { name: 'Pulmonology',   value: 18, color: '#14b8a6' },
  { name: 'Orthopedics',   value: 15, color: '#a855f7' },
  { name: 'Oncology',      value: 12, color: '#f59e0b' },
  { name: 'Neurology',     value: 11, color: '#2dd4bf' },
  { name: 'Endocrinology', value: 9,  color: '#10b981' },
  { name: 'Other',         value: 7,  color: '#6366f1' },
];

export const departmentData: DepartmentData[] = [
  { department: 'Cardiology',     patients: 42, capacity: 50, utilization: 84 },
  { department: 'Orthopedics',    patients: 31, capacity: 40, utilization: 78 },
  { department: 'Oncology',       patients: 28, capacity: 35, utilization: 80 },
  { department: 'Pulmonology',    patients: 25, capacity: 30, utilization: 83 },
  { department: 'Neurology',      patients: 22, capacity: 30, utilization: 73 },
  { department: 'Endocrinology',  patients: 18, capacity: 25, utilization: 72 },
  { department: 'Psychiatry',     patients: 16, capacity: 20, utilization: 80 },
  { department: 'Urology',        patients: 14, capacity: 20, utilization: 70 },
];

export const kpiTrends = {
  patients:    [142, 148, 156, 158, 162, 168, 178, 182, 179, 185, 189, 194],
  revenue:     [285, 298, 312, 308, 327, 341, 335, 352, 368, 374, 386, 392],
  recoveryRate:[88, 89, 90, 89, 91, 92, 91, 93, 92, 94, 93, 95],
  appointments:[12, 14, 11, 16, 18, 15, 19, 17, 20, 18, 22, 24],
};
