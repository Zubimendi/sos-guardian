import {Alert as AppAlert, EmergencyContact, Location} from "../types";
import {createAlert, getUserContacts, updateAlertStatus} from "./database";
import {sendSmsAlert} from "./sms";
import {reverseGeocodeLocation} from "./geocoding";

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

  // Fire and forget SMS sending
  await Promise.allSettled(
    contacts.map((contact) =>
      sendSmsAlert({
        to: contact.phone,
        message: smsMessage,
      }),
    ),
  );

  return alertId;
};

export const resolveAlert = async (alertId: string) => {
  await updateAlertStatus(alertId, {
    status: "resolved",
    resolvedAt: Date.now(),
  });
};

