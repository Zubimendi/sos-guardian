/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import twilio from "twilio";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

const twilioConfig = functions.config().twilio || {};

const twilioClient = twilio(
  twilioConfig.account_sid,
  twilioConfig.auth_token,
);

export const sendAlertSms = onRequest(async (req, res) => {
  // Basic CORS support
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const {to, message} = req.body || {};

  if (!to || !message) {
    res.status(400).json({error: "Missing 'to' or 'message' in request body"});
    return;
  }

  if (!twilioConfig.phone_number) {
    res.status(500).json({error: "Twilio phone number is not configured"});
    return;
  }

  try {
    const result = await twilioClient.messages.create({
      from: twilioConfig.phone_number,
      to,
      body: message,
    });

    logger.info("SMS sent", {sid: result.sid, to});
    res.status(200).json({success: true, sid: result.sid});
  } catch (error: any) {
    logger.error("Failed to send SMS", {error: error?.message, to});
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to send SMS",
    });
  }
});

