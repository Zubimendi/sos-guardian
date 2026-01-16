export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  emergencyContacts: string[];
  safePlaces: SafePlace[];
  lastKnownLocation: Location | null;
  sosActive: boolean;
  sosStartTime: number | null;
  createdAt: number;
  updatedAt: number;
  settings: UserSettings;
  pushToken?: string; // Expo push notification token
}

export interface UserSettings {
  shakeToSOS: boolean;
  sosPin: string | null;
  autoDeleteLocationAfter: number;
  notificationSound: boolean;
  vibration: boolean;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  priority: number;
  verified: boolean;
  createdAt: number;
}

export interface SafePlace {
  id: string;
  name: string;
  type: "police" | "hospital" | "campus_security" | "store" | "custom";
  location: Location;
  address?: string;
  phone?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
}

export interface Alert {
  id: string;
  userId: string;
  type: "sos" | "timer" | "manual";
  location: Location;
  timestamp: number;
  status: "active" | "resolved" | "false_alarm";
  contactsNotified: string[];
  notificationsSent: NotificationLog[];
  resolvedAt?: number;
  resolvedBy?: string;
  notes?: string;
}

export interface NotificationLog {
  contactId: string;
  method: "sms" | "push";
  sentAt: number;
  status: "sent" | "delivered" | "failed";
  message: string;
}

export interface SafetyTimer {
  id: string;
  userId: string;
  duration: number;
  startTime: number;
  endTime: number;
  status: "active" | "completed" | "expired" | "cancelled";
  checkpoints: TimerCheckpoint[];
  route?: Location[];
}

export interface TimerCheckpoint {
  timestamp: number;
  location: Location;
  status: "ok" | "missed";
}

export const COLLECTIONS = {
  USERS: "users",
  ALERTS: "alerts",
  CONTACTS: "contacts",
  TIMERS: "safetyTimers",
} as const;

export const RT_PATHS = {
  LOCATIONS: "locations",
  ACTIVE_ALERTS: "activeAlerts",
} as const;

