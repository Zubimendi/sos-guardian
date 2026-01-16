import * as Notifications from "expo-notifications";
import {collection, query, where, getDocs} from "firebase/firestore";
import {db} from "./firebase";
import {COLLECTIONS} from "../types";

/**
 * Send push notification via Expo Push Notification service (FREE!)
 * This works on Firebase free tier - no Blaze plan needed
 */
export const sendPushNotification = async (
  expoPushToken: string,
  title: string,
  body: string,
  data?: any,
) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: data || {},
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

/**
 * Check if a phone number belongs to a registered user
 * Returns the user's push token if they exist
 */
export const getUserByPhone = async (
  phone: string,
): Promise<{userId: string; pushToken: string | null} | null> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where("phone", "==", phone),
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const userData = snap.docs[0].data();
    return {
      userId: snap.docs[0].id,
      pushToken: userData.pushToken || null,
    };
  } catch (error) {
    console.error("Error finding user by phone:", error);
    return null;
  }
};

/**
 * Notify an emergency contact that they've been added
 * If they're a user, send push notification. Otherwise, they'll get SMS when SOS is triggered.
 */
export const notifyContactAdded = async (
  contactPhone: string,
  addedByName: string,
) => {
  const user = await getUserByPhone(contactPhone);

  if (user && user.pushToken) {
    // They're a user! Send push notification
    await sendPushNotification(
      user.pushToken,
      "You've been added as an emergency contact",
      `${addedByName} added you as an emergency contact in SOS Guardian. You'll receive instant alerts if they need help.`,
      {
        type: "contact_added",
        addedBy: addedByName,
      },
    );
    return {sent: true, method: "push"};
  }

  // Not a user yet - they'll get SMS when SOS is triggered
  return {sent: false, method: "sms_fallback"};
};
