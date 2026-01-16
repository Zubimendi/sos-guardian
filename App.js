import React, {useEffect, useRef} from "react";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import AppNavigator from "./src/navigation/AppNavigator";
import {AuthProvider} from "./src/context/AuthContext";
import {AlertProvider} from "./src/context/AlertContext";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Listen for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // Listen for user tapping on notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response);
        const data = response.notification.request.content.data;
        
        // Handle different notification types
        if (data?.type === "sos_alert") {
          // Navigate to alerts screen or show alert details
          console.log("SOS Alert received:", data);
        } else if (data?.type === "contact_added") {
          console.log("Contact added notification:", data);
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AlertProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AlertProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

