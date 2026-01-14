import axios from "axios";
import {APP_CONFIG} from "../constants/config";

export interface SmsPayload {
  to: string;
  message: string;
}

export const sendSmsAlert = async ({to, message}: SmsPayload) => {
  const url = `${APP_CONFIG.FUNCTIONS_BASE_URL}/sendAlertSms`;

  const response = await axios.post(url, {to, message});
  return response.data;
};

