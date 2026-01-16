import axios from "axios";
import {collection, addDoc} from "firebase/firestore";
import {db} from "./firebase";
import {APP_CONFIG} from "../constants/config";

export interface SmsPayload {
  to: string;
  message: string;
}

// Mock mode: Set to false when you have Firebase Functions deployed
const USE_MOCK_SMS = true;

/**
 * Mock SMS service that logs to Firestore instead of sending real SMS
 * Perfect for demos and testing without requiring a paid Firebase plan
 */
const sendMockSms = async ({to, message}: SmsPayload) => {
  try {
    // Log the SMS to Firestore for demo purposes
    await addDoc(collection(db, "smsLogs"), {
      to,
      message,
      status: "sent",
      sentAt: Date.now(),
      mock: true, // Flag to indicate this is a mock SMS
    });

    console.log(`[MOCK SMS] To: ${to}`);
    console.log(`[MOCK SMS] Message: ${message}`);

    return {
      success: true,
      sid: `mock_${Date.now()}`,
      mock: true,
    };
  } catch (error) {
    console.error("Failed to log mock SMS:", error);
    return {
      success: false,
      error: "Failed to log SMS",
      mock: true,
    };
  }
};

/**
 * Real SMS service using Firebase Cloud Functions + Twilio
 * Use this when you upgrade to Firebase Blaze plan
 */
const sendRealSms = async ({to, message}: SmsPayload) => {
  const url = `${APP_CONFIG.FUNCTIONS_BASE_URL}/sendAlertSms`;
  const response = await axios.post(url, {to, message});
  return response.data;
};

export const sendSmsAlert = async (payload: SmsPayload) => {
  if (USE_MOCK_SMS) {
    return sendMockSms(payload);
  }
  return sendRealSms(payload);
};
