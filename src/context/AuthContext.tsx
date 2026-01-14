import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {User as FirebaseUser} from "firebase/auth";
import {listenToAuthChanges, signInWithEmail, signOutUser, signUpWithEmail} from "../services/auth";
import {User} from "../types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToAuthChanges(async (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (params: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    setLoading(true);
    try {
      const user = await signUpWithEmail(
        params.email,
        params.password,
        params.name,
        params.phone,
      );
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await signOutUser();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

