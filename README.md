# SOS Guardian

![Tech Stack](https://img.shields.io/badge/tech-stack-Expo%20React%20Native%20%7C%20Firebase%20%7C%20Twilio-informational)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Live Demo

Not deployed yet – run locally with Expo.

## 📱 Mobile App

Pending store publication.

- Android: Play Store link coming soon  
- iOS: App Store link coming soon

## 📖 Description

**SOS Guardian** is a personal safety companion app that lets users trigger an SOS alert, share live location with trusted contacts, and manage emergency settings.  
It’s built for quick access, clear UX under stress, and robust backend tracking via Firebase and Twilio SMS.

## ✨ Features

- **Instant SOS Alerts**
  - One-tap SOS button with prominent, high-contrast design.
  - Sends SMS alerts to trusted contacts using Twilio.
  - Includes user’s latest known location (with optional reverse geocoded address).

- **Safety Timer**
  - Start a timed safety session (e.g. 30 minutes when walking home).
  - On expiry, sends a reminder notification to confirm safety.
  - Timers are stored in Firestore for history/analytics.

- **Trusted Contacts**
  - Add, view, and remove emergency contacts.
  - Each contact stored in Firestore and used during SOS flows.
  - Clean, card-based UI with validation for contact details.

- **Live Location Integration**
  - Uses `expo-location` to fetch and track current position.
  - Displays user position on an in-app map (`react-native-maps`).
  - Mirrors active alerts to Firebase Realtime Database for live tracking.

- **Push & Local Notifications**
  - Uses `expo-notifications` to schedule reminders for timers.
  - Notification and vibration preferences configurable in Settings.

- **Secure Authentication**
  - Email/password signup and login with Firebase Auth.
  - User profiles stored in Firestore, including settings and metadata.

- **Professional UI/UX**
  - Dark, safety-focused theme with gradients and iconography.
  - Tabbed navigation (Home, Contacts, Alerts, Settings).
  - Zod-based form validation for robust input handling.

## 🛠️ Tech Stack

- **Mobile / Frontend**
  - Expo (React Native 0.81)
  - React Navigation (native stack + bottom tabs)
  - `react-native-maps`, `expo-location`, `expo-notifications`, `expo-linear-gradient`
  - `zod` for schema-based validation

- **Backend**
  - Firebase Authentication
  - Cloud Firestore
  - Realtime Database
  - Firebase Cloud Functions (TypeScript)

- **Messaging / Integrations**
  - Twilio (SMS alerts)
  - OpenCage (optional reverse geocoding)

- **Dev & Tooling**
  - TypeScript (for functions and typings)
  - Expo CLI
  - npm

## 🏗️ Architecture

### Mobile App (Expo React Native)

- `App.js` wraps:
  - `AuthProvider` (Firebase auth state, signup/login)
  - `AlertProvider` (SOS orchestration, active alert state)
  - `AppNavigator` (auth flow + main tabs)
- Screens:
  - `auth/` – login & signup flows.
  - `home/` – SOS button, map, safety timer.
  - `contacts/` – list & add emergency contacts.
  - `alerts/` – alert history surface.
  - `settings/` – user preferences & sign-out.

### Service Layer

- `services/firebase.ts` – initializes app, Auth, Firestore, RTDB.
- `services/auth.ts` – signup/login, user profile and settings.
- `services/database.ts` – CRUD for contacts, alerts, timers, locations.
- `services/location.ts` – permission + current location/watching.
- `services/sms.ts` – HTTP client for the Twilio Cloud Function.
- `services/alert.ts` – high-level SOS flow (contacts + location + SMS).
- `services/notifications.ts` – push token + local scheduling.
- `services/geocoding.ts` – optional reverse geocode via OpenCage.

### Backend (Firebase)

- **Cloud Functions**
  - `sendAlertSms` – HTTPS function that:
    - Reads Twilio config from `functions.config()`.
    - Sends SMS to a destination phone with alert message.
    - Exposed at:  
      `https://us-central1-[PROJECT_ID].cloudfunctions.net/sendAlertSms`

- **Datastores**
  - Firestore collections: `users`, `alerts`, `contacts`, `safetyTimers`.
  - Realtime DB paths: `locations/{userId}`, `activeAlerts/{alertId}`.

## 🔧 Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/sos-guardian.git
cd sos-guardian/frontend
```

### 2. Install dependencies

```bash
npm install
npx expo install react-native-gesture-handler react-native-reanimated
```

### 3. Configure Firebase

Create `src/config/firebase.config.ts`:

```ts
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

Set Firestore + Realtime Database security rules as per your backend design (users/alerts/contacts/timers + locations/activeAlerts).

### 4. Configure Twilio (Cloud Functions)

From `frontend/functions`:

```bash
cd functions
npm install

firebase functions:config:set \
  twilio.account_sid="YOUR_TWILIO_SID" \
  twilio.auth_token="YOUR_TWILIO_AUTH_TOKEN" \
  twilio.phone_number="+1234567890"

npm run deploy   # or: firebase deploy --only functions
cd ..
```

Update `src/constants/config.ts`:

```ts
export const APP_CONFIG = {
  // ...
  FUNCTIONS_BASE_URL: "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net",
  OPENCAGE_API_KEY: "YOUR_OPENCAGE_API_KEY", // or leave default
} as const;
```

### 5. Environment variables (optional)

Create `.env` in the project root if you also want to keep Twilio keys locally:

```bash
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

Ensure `.env` is included in `.gitignore`.

### 6. Run the app

```bash
npm run start   # starts Expo
```

Scan the QR code with **Expo Go** (Android/iOS) or run on an emulator.

## 📚 API Documentation

The app mainly uses Firebase SDKs directly. Custom HTTP API surface is small:

- **POST** `{{FUNCTIONS_BASE_URL}}/sendAlertSms`  
  - **Body:**
    - `to: string` – destination phone number.
    - `message: string` – SMS text.
  - **Response:**
    - `200`: `{ success: true, sid: string }`
    - `4xx/5xx`: `{ success: false, error: string }`

Firestore and Realtime Database schemas follow the interfaces in `src/types/index.ts` (`User`, `EmergencyContact`, `Alert`, `SafetyTimer`, etc.).

## 🔒 Security Features

- **Authentication**
  - Firebase email/password auth.
  - Per-user access rules in Firestore and Realtime Database (only owners can read/write their own data).

- **Data Protection**
  - Firestore/RTDB security rules limit:
    - `users/{userId}` to authenticated owner.
    - `contacts` and `safetyTimers` to the owning user.
    - `alerts` to creator and notified contacts.
  - Optional automatic deletion window for location history via `autoDeleteLocationAfter`.

- **Network / API**
  - Twilio credentials stored in **Firebase Functions config**, not in the client.
  - HTTPS Cloud Function endpoint for SMS dispatch.

- **Client-Side**
  - Zod validation on auth and contact forms to reduce bad data and edge cases.
  - Explicit runtime permission requests for location access.

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.  
2. Create a feature branch: `git checkout -b feature/awesome-improvement`.  
3. Commit changes: `git commit -m "Add awesome improvement"`.  
4. Push the branch: `git push origin feature/awesome-improvement`.  
5. Open a Pull Request.

Please open an issue first if you’re proposing a significant architectural change.

## 📄 License

MIT License. You’re free to use, modify, and distribute this project under the terms of the MIT license.

