import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { User, Patient, ViewMode, Notification } from '../types';
import { mockPatients } from '../data/patients';

// --- Auth Slice ---
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
}
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  authLoading: true,
  authError: null,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.authLoading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.authError = action.payload;
    },
  },
});
export const { setUser, setAuthLoading, setAuthError } = authSlice.actions;

// --- Patient Slice ---
interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  currentPage: number;
}
const initialPatientState: PatientState = {
  patients: mockPatients,
  selectedPatient: null,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'All',
  departmentFilter: 'All',
  currentPage: 1,
};
export const patientSlice = createSlice({
  name: 'patients',
  initialState: initialPatientState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.departmentFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});
export const { setViewMode, setSelectedPatient, setSearchQuery, setStatusFilter, setDepartmentFilter, setCurrentPage } = patientSlice.actions;

// --- Notification Slice ---
interface NotificationState {
  notifications: Notification[];
}
const initialNotificationState: NotificationState = {
  notifications: [
    {
      id: 'n-001',
      title: 'Critical Alert',
      message: "Patient Devendra Singh's O₂ saturation dropped to 91%",
      time: '2 min ago',
      read: false,
      type: 'critical',
    },
    {
      id: 'n-002',
      title: 'Appointment Reminder',
      message: 'Meera Reddy arriving in 30 minutes',
      time: '15 min ago',
      read: false,
      type: 'info',
    },
    {
      id: 'n-003',
      title: 'Lab Results Ready',
      message: "Nandini Kulkarni's CBC results are available",
      time: '1 hr ago',
      read: false,
      type: 'success',
    },
    {
      id: 'n-004',
      title: 'Medication Alert',
      message: "Lakshmi Iyer's Azithromycin dose is due",
      time: '2 hr ago',
      read: true,
      type: 'warning',
    },
  ],
};
export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'time' | 'read'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: `n-${Date.now()}`,
        time: 'Just now',
        read: false,
      });
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => { n.read = true; });
    },
    markRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
  },
});
export const { addNotification, markAllRead, markRead } = notificationSlice.actions;

// --- UI Slice ---
interface UIState {
  sidebarCollapsed: boolean;
}
const initialUIState: UIState = {
  sidebarCollapsed: false,
};
export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});
export const { toggleSidebar, setSidebarCollapsed } = uiSlice.actions;

// --- Store Configuration ---
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    patients: patientSlice.reducer,
    notifications: notificationSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
