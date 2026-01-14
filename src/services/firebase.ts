import {initializeApp, getApps, getApp} from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getDatabase} from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {firebaseConfig} from "../config/firebase.config";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
try {
  // Initialize React Native specific auth persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Fallback if auth was already initialized
  auth = getAuth(app);
}

const db = getFirestore(app);
const rtdb = getDatabase(app);

export {app, auth, db, rtdb};

export const handleFirebaseError = (error: any): string => {
  const errorMessages: {[key: string]: string} = {
    "auth/invalid-email": "Invalid email address",
    "auth/user-not-found": "No account found with that email",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already in use",
    "auth/weak-password": "Password is too weak",
    "permission-denied": "You do not have permission to perform this action",
    unknown: "An unexpected error occurred. Please try again.",
  };

  return errorMessages[error?.code] || errorMessages.unknown;
};

