import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import {triggerSosAlert, resolveAlert} from "../services/alert";
import {Location} from "../types";

interface AlertContextValue {
  activeAlertId: string | null;
  triggering: boolean;
  triggerSOS: (userId: string, location: Location) => Promise<void>;
  resolveActiveAlert: () => Promise<void>;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export const AlertProvider = ({children}: {children: ReactNode}) => {
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);

  const triggerSOS = async (userId: string, location: Location) => {
    setTriggering(true);
    try {
      const id = await triggerSosAlert({userId, location});
      setActiveAlertId(id);
    } finally {
      setTriggering(false);
    }
  };

  const resolveActiveAlert = async () => {
    if (!activeAlertId) return;
    await resolveAlert(activeAlertId);
    setActiveAlertId(null);
  };

  return (
    <AlertContext.Provider
      value={{
        activeAlertId,
        triggering,
        triggerSOS,
        resolveActiveAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

