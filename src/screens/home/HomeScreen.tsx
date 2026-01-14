import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";
import SOSButton from "../../components/emergency/SOSButton";
import SafetyTimer from "../../components/emergency/SafetyTimer";
import MapView from "../../components/map/MapView";
import Screen from "../../components/common/Screen";
import {useAuth} from "../../context/AuthContext";
import {useAlert} from "../../context/AlertContext";
import {getCurrentLocation} from "../../services/location";
import {createSafetyTimer} from "../../services/database";
import {scheduleLocalNotification} from "../../services/notifications";
import {Location} from "../../types";

const HomeScreen: React.FC = () => {
  const {firebaseUser} = useAuth();
  const {activeAlertId, triggering, triggerSOS, resolveActiveAlert} =
    useAlert();
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    (async () => {
      const loc = await getCurrentLocation();
      if (loc) setLocation(loc);
    })();
  }, []);

  const handleSOS = async () => {
    if (!firebaseUser || !location) return;
    if (activeAlertId) {
      await resolveActiveAlert();
    } else {
      await triggerSOS(firebaseUser.uid, location);
    }
  };

  const handleStartTimer = async (duration: number) => {
    if (!firebaseUser || !location) return;

    await createSafetyTimer({
      userId: firebaseUser.uid,
      duration,
    });

    // Mid-way check-in
    await scheduleLocalNotification(
      "Safety check-in",
      "Tap to confirm you’re safe. If not, use SOS.",
      (duration * 60) / 2,
    );

    // Final reminder when timer ends
    await scheduleLocalNotification(
      "Safety timer ending",
      "Confirm you’re safe or trigger SOS if you need help.",
      duration * 60,
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{paddingBottom: 32}}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>
              You&apos;re protected{firebaseUser?.displayName ? "," : ""}
            </Text>
            {firebaseUser?.displayName ? (
              <Text style={styles.userName}>{firebaseUser.displayName}</Text>
            ) : null}
          </View>
          <View style={styles.shieldIcon}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.text} />
          </View>
        </View>

        <Text style={styles.subheading}>
          Press SOS if you feel unsafe. We&apos;ll notify your trusted contacts
          with your live location.
        </Text>

        <MapView location={location} />

        <SOSButton onPress={handleSOS} active={!!activeAlertId || triggering} />

        <SafetyTimer onStart={handleStartTimer} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  userName: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 2,
  },
  subheading: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 16,
  },
  shieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default HomeScreen;

