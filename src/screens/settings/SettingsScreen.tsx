import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Switch} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import {useAuth} from "../../context/AuthContext";
import {getCurrentUserProfile, updateUserSettings} from "../../services/auth";
import {UserSettings} from "../../types";

const SettingsScreen: React.FC = () => {
  const {firebaseUser, signOut} = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const profile = await getCurrentUserProfile();
      setSettings(profile?.settings || null);
      setLoading(false);
    })();
  }, []);

  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => {
    if (!firebaseUser || !settings) return;
    const next = {...settings, [key]: value};
    setSettings(next);
    await updateUserSettings(firebaseUser.uid, {[key]: value});
  };

  return (
    <LinearGradient
      colors={["#040613", "#060818", "#050509"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>
              Tune how SOS Guardian behaves when you need it.
            </Text>
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="settings" size={22} color={COLORS.text} />
          </View>
        </View>

        {settings && !loading && (
          <>
            <Card>
              <Text style={styles.sectionTitle}>Emergency triggers</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <Text style={styles.label}>Shake to SOS</Text>
                  <Text style={styles.description}>
                    Trigger SOS by shaking your phone (future enhancement).
                  </Text>
                </View>
                <Switch
                  value={settings.shakeToSOS}
                  onValueChange={(v) => updateSetting("shakeToSOS", v)}
                  thumbColor={settings.shakeToSOS ? COLORS.primary : "#777"}
                />
              </View>
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <Text style={styles.label}>Notification sound</Text>
                  <Text style={styles.description}>
                    Play a sound when SOS or timers fire.
                  </Text>
                </View>
                <Switch
                  value={settings.notificationSound}
                  onValueChange={(v) =>
                    updateSetting("notificationSound", v)
                  }
                  thumbColor={
                    settings.notificationSound ? COLORS.primary : "#777"
                  }
                />
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <Text style={styles.label}>Vibration</Text>
                  <Text style={styles.description}>
                    Vibrate on important safety alerts.
                  </Text>
                </View>
                <Switch
                  value={settings.vibration}
                  onValueChange={(v) => updateSetting("vibration", v)}
                  thumbColor={settings.vibration ? COLORS.primary : "#777"}
                />
              </View>
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>Location history</Text>
              <Text style={styles.description}>
                Automatically delete your location history after{" "}
                <Text style={styles.chip}>
                  {settings.autoDeleteLocationAfter}h
                </Text>
                . You can adjust this in a future version.
              </Text>
            </Card>
          </>
        )}

        <View style={{marginTop: 24}}>
          <Button title="Sign out" onPress={signOut} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  chip: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

export default SettingsScreen;

