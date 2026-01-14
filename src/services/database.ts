import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  set,
  push,
  query as rQuery,
  orderByChild,
} from "firebase/database";
import {db, rtdb} from "./firebase";
import {
  Alert,
  COLLECTIONS,
  EmergencyContact,
  Location,
  RT_PATHS,
  SafetyTimer,
} from "../types";

export const getUserContacts = async (
  userId: string,
): Promise<EmergencyContact[]> => {
  const q = query(
    collection(db, COLLECTIONS.CONTACTS),
    where("userId", "==", userId),
    orderBy("priority", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({id: d.id, ...(d.data() as Omit<EmergencyContact, "id">)}),
  );
};

export const getUserAlerts = async (userId: string): Promise<Alert[]> => {
  const q = query(
    collection(db, COLLECTIONS.ALERTS),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({id: d.id, ...(d.data() as Omit<Alert, "id">)}),
  );
};

export const addEmergencyContact = async (
  contact: Omit<EmergencyContact, "id" | "createdAt">,
): Promise<string> => {
  const now = Date.now();
  const docRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), {
    ...contact,
    createdAt: now,
  });
  return docRef.id;
};

export const updateEmergencyContact = async (
  id: string,
  updates: Partial<EmergencyContact>,
) => {
  const refDoc = doc(db, COLLECTIONS.CONTACTS, id);
  await updateDoc(refDoc, updates);
};

export const deleteEmergencyContact = async (id: string) => {
  const refDoc = doc(db, COLLECTIONS.CONTACTS, id);
  await deleteDoc(refDoc);
};

export const createAlert = async (
  alert: Omit<Alert, "id" | "timestamp" | "notificationsSent">,
): Promise<string> => {
  const now = Date.now();
  const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), {
    ...alert,
    timestamp: now,
    notificationsSent: [],
  });

  // Mirror to Realtime DB for live tracking
  const rtRef = ref(
    rtdb,
    `${RT_PATHS.ACTIVE_ALERTS}/${docRef.id}`,
  );
  await set(rtRef, {
    userId: alert.userId,
    location: alert.location,
    timestamp: now,
    status: alert.status,
  });

  return docRef.id;
};

export const updateAlertStatus = async (
  alertId: string,
  updates: Partial<Alert>,
) => {
  const refDoc = doc(db, COLLECTIONS.ALERTS, alertId);
  await updateDoc(refDoc, updates);

  const rtRef = ref(
    rtdb,
    `${RT_PATHS.ACTIVE_ALERTS}/${alertId}`,
  );
  await set(rtRef, {
    status: updates.status,
    resolvedAt: updates.resolvedAt || null,
  });
};

export const createSafetyTimer = async (
  timer: Omit<SafetyTimer, "id" | "startTime" | "endTime" | "status"> & {
    duration: number;
  },
): Promise<string> => {
  const now = Date.now();
  const endTime = now + timer.duration * 60 * 1000;
  const docRef = await addDoc(collection(db, COLLECTIONS.TIMERS), {
    ...timer,
    startTime: now,
    endTime,
    status: "active",
    checkpoints: [],
  });
  return docRef.id;
};

export const saveUserLocation = async (userId: string, location: Location) => {
  const locationsRef = ref(
    rtdb,
    `${RT_PATHS.LOCATIONS}/${userId}`,
  );
  const newRef = push(locationsRef);
  await set(newRef, location);
};

export const getActiveAlertsRef = () => {
  return rQuery(
    ref(rtdb, RT_PATHS.ACTIVE_ALERTS),
    orderByChild("timestamp"),
  );
};

