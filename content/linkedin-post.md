### 🚨 I built “SOS Guardian” – a personal safety app with real-time alerts, Firebase, and Twilio

Over the last few weeks I’ve been building **SOS Guardian**, a mobile app focused on one thing: helping people feel safer when they’re walking home, travelling, or meeting someone new.

The app lets you:
- Trigger an **SOS alert** that instantly shares your live location with trusted contacts via **Twilio SMS**.
- Start **safety timers** for journeys, with mid-way check-ins and end-of-timer reminders using **Expo Notifications**.
- Manage **trusted contacts**, view **alert history**, and fine-tune settings like vibration, sounds, and automatic location history cleanup.

Under the hood:
- **Frontend:** Expo + React Native, React Navigation, custom design system, zod validation.
- **Backend:** Firebase Authentication, Firestore, Realtime Database.
- **Cloud Functions:** TypeScript functions for secure Twilio SMS dispatch.

This project was a great way to combine **mobile UX**, **real-time data**, and **secure, serverless backend** patterns in one place.

If you’re interested in safety tech, mobile development, or want to see how I structured the app:
- 📦 GitHub: (link to repo)
- 📝 Blog post (build + architecture deep dive): (link to Medium/Dev.to)

I’d love any feedback on the UX, architecture, or ideas for taking this further (e.g. caregiver dashboards, campus safety integrations, or geofenced safe zones). Feel free to drop thoughts or questions below. 👇

