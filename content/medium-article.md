## Building “SOS Guardian”: A Mobile Safety App with Firebase, Twilio, and Expo

Staying safe when walking home late, commuting, or travelling alone is a real concern for many people. I wanted to build something practical that could help in those moments — a small, focused app that turns your phone into a **personal safety companion**.

That’s how **SOS Guardian** was born.

In this post I’ll walk through:

- The **problem** SOS Guardian tries to solve  
- The **architecture** (Expo + Firebase + Twilio)  
- Key **features and implementation details**  
- Selected **code snippets**  
- A few **lessons learned** along the way

---

## The Problem: “Let me know when you get home”

We’ve all heard or said it:

> “Text me when you get home so I know you’re safe.”

The problem is, people forget — or worse, something happens and they can’t text.

I wanted an app that:

- Makes it very easy to trigger an **SOS** when you feel unsafe.  
- Automatically shares your **live location** with trusted contacts.  
- Includes **timers** for walks/commutes so the app checks in even if you forget.  
- Gives you control over **privacy and settings** so it still feels respectful.

---

## High-Level Architecture

SOS Guardian is a mobile-only app built with:

- **Expo / React Native** for the client.
- **Firebase** for authentication and data:
  - Authentication (email/password)
  - Cloud Firestore (users, alerts, contacts, timers)
  - Realtime Database (live locations, active alerts)
- **Firebase Cloud Functions (TypeScript)** to integrate with:
  - **Twilio** for SMS alerts to emergency contacts.
- **Expo services**:
  - `expo-location` for GPS.
  - `expo-notifications` for local reminders.
  - `expo-linear-gradient` for styling.

### Data Model (simplified)

Key collections and paths defined in `src/types/index.ts`:

- `users` – profile + settings (e.g. `shakeToSOS`, `notificationSound`, `autoDeleteLocationAfter`).
- `contacts` – emergency contacts tied to a user.
- `alerts` – SOS and timer alerts with location, status, and logs.
- `safetyTimers` – timers with duration, start/end, and optional route.
- Realtime DB:
  - `locations/{userId}` – location history.
  - `activeAlerts/{alertId}` – live alerts for quick lookups and presence.

---

## Core Features and How They Work

### 1. Authentication & Profiles

Users sign up with **email + password**, and the backend stores a corresponding `User` document in Firestore:

- Persistent auth with `initializeAuth` + AsyncStorage.
- Profile includes:
  - Name, phone, emergency contacts (ids)
  - Last known location
  - Boolean `sosActive` and `sosStartTime`
  - `settings` object for notification/vibration and safety preferences.

On the frontend, an `AuthContext` wraps the app and exposes:

- `signIn(email, password)`
- `signUp({ name, email, phone, password })`
- `signOut()`

Zod is used to validate login/signup forms before calling Firebase, so error messages are clean and immediate.

---

### 2. Triggering an SOS Alert

The Home screen centres on a large, animated **SOS button**:

- When pressed:
  - Reads the current user and location.
  - Calls a high-level `triggerSosAlert` service.
  - Creates an `Alert` document in Firestore.
  - Writes an entry under `activeAlerts` in the Realtime Database.
  - Dispatches SMS notifications to all emergency contacts using Twilio via a Cloud Function.

The Cloud Function:

- Reads Twilio credentials from `functions.config().twilio`.
- Exposes an HTTPS endpoint `sendAlertSms`.
- Sends SMS from a configured Twilio number with the alert message and location (optionally reverse-geocoded).

Contacts see a human-readable message like:

> “SOS Guardian Alert! A SOS was triggered. Location: [address or lat/lng].”

---

### 3. Safety Timers with Check-Ins

Safety timers are for when you *expect* to arrive safely but want a backup check.

Implementation:

- User taps a **Safety Timer** component on Home.
- They choose a preset (15 / 30 / 45 / 60 minutes).
- Starting a timer:
  - Creates a `safetyTimers` document in Firestore with:
    - `userId`, `duration`, `startTime`, `endTime`, `status`.
  - Schedules **two local notifications** via `expo-notifications`:
    - Mid-way check-in: “Tap to confirm you’re safe. If not, use SOS.”
    - End-of-timer reminder: “Confirm you’re safe or trigger SOS if you need help.”

This keeps the logic simple but opens the door to future enhancements like auto-SOS if the user doesn’t respond.

---

### 4. Trusted Contacts Management

The Contacts screen lets users:

- Add, view, and remove **emergency contacts**.
- Each contact includes:
  - Name, phone, relationship, priority, verification flag.
- Contacts are stored under the `contacts` collection in Firestore.

The UI uses a consistent design system:

- `Screen` wrapper for gradient background and padding.
- `SectionHeader` for titles + subtitles.
- Card-based `ContactCard` components for each person.

Zod validation ensures phone numbers and names are well-formed before saving.

---

### 5. Alerts Overview + Real-Time Presence

The Alerts tab has two main functions:

1. **Alert History**
   - Lists past SOS and timer alerts from Firestore.
   - Shows:
     - Type (SOS / Timer)
     - Time
     - Location snippet (lat/lng)
     - Color-coded status chip (“Active”, “Resolved”, “False alarm”).

2. **Live Active Alert Banner**
   - Subscribes to `activeAlerts` in Realtime Database for the current user.
   - If an alert is active, shows a highlighted banner:
     - “Active alert” + last update time.
     - This updates in real time as Realtime Database changes.

This combination of **history + live state** gives a more complete picture of the user’s safety events.

---

### 6. Settings & Personalisation

The Settings screen reads and writes `UserSettings` from Firestore:

- **Shake to SOS** (future trigger toggle)
- **Notification sound** (on/off)
- **Vibration** (on/off)
- **Location history retention** (~X hours, currently display-only)

Each toggle:

- Updates local state for instant UI feedback.
- Persists changes via `updateUserSettings` in the auth service.

---

### 7. UX and Visual Design

From a UX perspective, the goal was to feel **calm and trustworthy**, not flashy:

- **Onboarding Screen**:
  - Introduces the app.
  - Offers one-tap actions to enable notifications, enable location, and add the first contact.
  - Only shown on first launch via a simple `hasOnboarded` flag in AsyncStorage.

- **Theming & Layout**:
  - Custom deep-indigo dark theme (less harsh than pure black).
  - Gradient backgrounds with soft **floating shapes** added via layered views in a `Screen` component.
  - Shared components like `SectionHeader`, `Card`, `Button`, `Input` enforce consistency.

- **SOS Button Animation**:
  - Uses React Native’s `Animated` API to **pulse** the SOS button while an alert is active.
  - Subtle motion draws attention without being overwhelming.

Overall, the app aims to balance urgency (SOS context) with a reassuring, readable UI.

---

## Lessons Learned

1. **Design around stress, not just aesthetics**  
   In an emergency, users won’t read. The primary actions (SOS, Timer) must be obvious, large, and require minimal cognitive load.

2. **Serverless is a great fit for safety apps**  
   Firebase + Cloud Functions made it easy to wire Authentication, Firestore, Realtime DB, and Twilio together without running servers.

3. **Security and secrets management matter**  
   Twilio credentials were kept out of the client and stored in Firebase Functions config. I also enforced `.env` ignores and cleaned git history to avoid leaked secrets.

4. **Type safety + validation pay off**  
   Strong TypeScript typings and zod validation reduced edge cases and improved error messaging for forms.

5. **Think in evolvable slices**  
   Features like the Safety Timer and real-time presence were built with future enhancements in mind (auto-SOS, caregiver dashboards, web clients).

---

## Next Steps

Things I’d like to explore next:

- Caregiver / family **dashboard** (web) to monitor active alerts.  
- **Geofenced safe zones** (home, campus, work) with automatic behaviour changes.  
- **Multi-language support** and accessibility improvements.  
- Automated tests and CI for production-grade reliability.

---

## Links

- 📦 GitHub repository: (link to repo)  
- 📱 App (Expo build / store links): (to be added)  

If you have thoughts on improving the safety model, UX suggestions, or want to discuss the architecture, feel free to comment or reach out — I’d love to hear your feedback. 🙌

