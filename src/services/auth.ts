import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {auth, db} from "./firebase";
import {COLLECTIONS, User} from "../types";
import {registerForPushNotificationsAsync} from "./notifications";

export const listenToAuthChanges = (
  callback: (user: FirebaseUser | null) => void,
) => {
  return onAuthStateChanged(auth, callback);
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  phone: string,
): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = cred.user;

  await updateProfile(fbUser, {displayName: name});

  // Register for push notifications
  const pushToken = await registerForPushNotificationsAsync();

  const userDocRef = doc(db, COLLECTIONS.USERS, fbUser.uid);
  const now = Date.now();

  const user: User = {
    id: fbUser.uid,
    email,
    name,
    phone,
    emergencyContacts: [],
    safePlaces: [],
    lastKnownLocation: null,
    sosActive: false,
    sosStartTime: null,
    createdAt: now,
    updatedAt: now,
    settings: {
      shakeToSOS: false,
      sosPin: null,
      autoDeleteLocationAfter: 24,
      notificationSound: true,
      vibration: true,
    },
    pushToken: pushToken || undefined,
  };

  await setDoc(userDocRef, {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
};

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  
  // Update push token on login
  const pushToken = await registerForPushNotificationsAsync();
  if (pushToken) {
    const userDocRef = doc(db, COLLECTIONS.USERS, cred.user.uid);
    await updateDoc(userDocRef, {
      pushToken,
      updatedAt: serverTimestamp(),
    });
  }
  
  return cred.user;
};

export const updateUserPushToken = async (userId: string, pushToken: string) => {
  const userDocRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userDocRef, {
    pushToken,
    updatedAt: serverTimestamp(),
  });
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const getCurrentUserProfile = async (): Promise<User | null> => {
  const fbUser = auth.currentUser;
  if (!fbUser) return null;

  const userDocRef = doc(db, COLLECTIONS.USERS, fbUser.uid);
  const snap = await getDoc(userDocRef);
  if (!snap.exists()) return null;

  return {
    id: fbUser.uid,
    ...(snap.data() as Omit<User, "id">),
  };
};

export const updateUserSettings = async (
  userId: string,
  settings: Partial<User["settings"]>,
) => {
  const userDocRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userDocRef, {
    settings,
    updatedAt: serverTimestamp(),
  });
};

