import {Alert as AppAlert, EmergencyContact, Location} from "../types";
import {createAlert, getUserContacts, updateAlertStatus} from "./database";
import {sendSmsAlert} from "./sms";
import {reverseGeocodeLocation} from "./geocoding";
import {getUserByPhone, sendPushNotification} from "./pushNotifications";

export const triggerSosAlert = async (params: {
  userId: string;
  location: Location;
}) => {
  const contacts: EmergencyContact[] = await getUserContacts(params.userId);

  const geocoded = await reverseGeocodeLocation(params.location);
  const locationText =
    geocoded?.formatted ||
    `Lat: ${params.location.latitude.toFixed(
      4,
    )}, Lng: ${params.location.longitude.toFixed(4)}`;

  const alertId = await createAlert({
    userId: params.userId,
    type: "sos",
    location: params.location,
    status: "active",
    contactsNotified: contacts.map((c) => c.id),
  } as Omit<AppAlert, "id" | "timestamp" | "notificationsSent">);

  const smsMessage = `SOS Guardian Alert!\nA SOS was triggered.\nLocation: ${locationText}`;

  // Notify contacts - prioritize push notifications for users, fallback to SMS
  await Promise.allSettled(
    contacts.map(async (contact) => {
      // Check if contact is a user with push token
      const user = await getUserByPhone(contact.phone);

      if (user && user.pushToken) {
        // They're a user! Send instant push notification with live location
        try {
          await sendPushNotification(
            user.pushToken,
            "🚨 SOS Alert - Immediate Action Required",
            `A SOS alert was triggered. Tap to view live location on map.`,
            {
              type: "sos_alert",
              alertId,
              userId: params.userId,
              location: params.location,
              locationText,
            },
          );
          console.log(`[PUSH] Sent to user: ${contact.name}`);
        } catch (error) {
          console.error(`[PUSH] Failed for ${contact.name}:`, error);
          // Fallback to SMS if push fails
          await sendSmsAlert({
            to: contact.phone,
            message: smsMessage,
          });
        }
      } else {
        // Not a user or no push token - send SMS
        await sendSmsAlert({
          to: contact.phone,
          message: smsMessage,
        });
      }
    }),
  );

  return alertId;
};

export const resolveAlert = async (alertId: string) => {
  await updateAlertStatus(alertId, {
    status: "resolved",
    resolvedAt: Date.now(),
  });
};

