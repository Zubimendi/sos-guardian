# Testing Push Notifications with 2 Accounts

## Quick Start - Local Development Build

For testing push notifications, we'll use a local development build which is faster and more reliable than EAS Build for testing.

### Option 1: Local Development Build (Recommended)

#### For Android:
```bash
# Make sure you have Android Studio and Android SDK installed
npx expo run:android
```

#### For iOS (Mac only):
```bash
# Make sure you have Xcode installed
npx expo run:ios
```

This creates a development build on your device/emulator that supports push notifications.

### Option 2: EAS Development Build (If local doesn't work)

If you want to use EAS Build, try again later (might be a temporary network issue):

```bash
# For Android
eas build --platform android --profile development

# For iOS
eas build --platform ios --profile development
```

Then install the APK/IPA on your devices.

---

## Testing Push Notifications - Step by Step

### Prerequisites
1. Two physical devices (or one device + emulator)
2. Two different accounts (email addresses)
3. Both devices connected to internet

### Test Scenario 1: Contact Added Notification

**Device 1 (Account A):**
1. Sign up/Login with Account A
2. Add Account B's phone number as emergency contact
3. ✅ Account B should receive push notification: "You've been added as an emergency contact"

**Device 2 (Account B):**
1. Sign up/Login with Account B (using the phone number you added)
2. ✅ Should see push notification when Account A adds them

### Test Scenario 2: SOS Alert Push Notification

**Device 1 (Account A):**
1. Make sure Account B is added as emergency contact
2. Trigger SOS button
3. ✅ Account B should receive push notification with SOS alert

**Device 2 (Account B):**
1. Should receive instant push notification
2. Tap notification → Should navigate to alerts screen
3. Can see Account A's live location on map

### Test Scenario 3: SMS Logs Verification

**Device 1 (Account A):**
1. Trigger SOS
2. Go to Alerts tab → Tap "SMS Logs"
3. ✅ Should see SMS log entry with:
   - Account B's phone number
   - Message content
   - Timestamp
   - Status: "sent"
   - Mock badge (since we're in demo mode)

### Test Scenario 4: Emergency Contact Network

**Setup:**
- Account A has Account B as contact
- Account B has Account A as contact

**Test:**
1. Account A triggers SOS
2. ✅ Account B gets **push notification** (instant, because they're a user)
3. Account B triggers SOS
4. ✅ Account A gets **push notification** (instant, because they're a user)

This demonstrates the "Emergency Contact Network" - users get instant push, non-users get SMS.

---

## Troubleshooting

### Push Notifications Not Working?

1. **Check permissions:**
   - Go to device Settings → Apps → SOS Guardian → Notifications
   - Make sure notifications are enabled

2. **Check push token:**
   - In app, check console logs for push token
   - Should see: `ExponentPushToken[...]`

3. **Check Firebase:**
   - Go to Firebase Console → Firestore
   - Check `users` collection
   - Verify `pushToken` field is saved for both accounts

4. **Check network:**
   - Both devices need internet connection
   - Push notifications use Expo's service (free)

### SMS Logs Not Showing?

1. **Check Firestore:**
   - Go to Firebase Console → Firestore
   - Check `smsLogs` collection
   - Should see entries when SOS is triggered

2. **Check app:**
   - Make sure you're logged in
   - Go to Alerts tab → SMS Logs
   - Pull to refresh

### Notifications Not Appearing?

1. **Check notification handler:**
   - App.js has notification listeners
   - Check console logs for "Notification received"

2. **Check Expo Push Token:**
   - Should be generated on signup/login
   - Check Firebase users collection for `pushToken`

---

## Expected Console Logs

When testing, you should see these logs:

**On Account A (when adding contact):**
```
[PUSH] Sent to user: Contact Name
```

**On Account B (when receiving notification):**
```
Notification received: { ... }
Notification tapped: { ... }
```

**On Account A (when triggering SOS):**
```
[PUSH] Sent to user: Contact Name
[MOCK SMS] To: +1234567890
[MOCK SMS] Message: SOS Guardian Alert!...
```

---

## What to Look For

✅ **Success Indicators:**
- Push notifications appear on recipient device
- SMS logs show entries in Firestore
- Notifications are tappable and navigate correctly
- Live location updates in real-time
- Emergency Contact Network works (push for users, SMS for non-users)

❌ **Issues to Report:**
- Push notifications not received
- SMS logs not appearing
- Notifications not tappable
- Location not updating
- App crashes when receiving notifications

---

## Next Steps After Testing

Once you confirm everything works:
1. Record demo video showing both accounts
2. Show push notifications in action
3. Show SMS logs verification
4. Show Emergency Contact Network feature
5. Highlight unique differentiators vs WhatsApp

Good luck with your testing! 🚀
