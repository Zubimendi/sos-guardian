import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {COLORS} from "../constants/colors";
import Button from "../components/common/Button";
import {registerForPushNotificationsAsync} from "../services/notifications";
import {requestLocationPermission} from "../services/location";

type Props = NativeStackScreenProps<any>;

const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const handleContinue = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    navigation.replace("Auth");
  };

  const handleEnableNotifications = async () => {
    await registerForPushNotificationsAsync();
  };

  const handleEnableLocation = async () => {
    await requestLocationPermission();
  };

  const handleAddContact = () => {
    navigation.navigate("AddContact");
  };

  return (
    <LinearGradient
      colors={["#050816", "#0B1020", "#050816"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.text} />
          </View>
          <Text style={styles.appName}>SOS Guardian</Text>
        </View>

        <Text style={styles.heading}>Your pocket safety companion</Text>
        <Text style={styles.subheading}>
          Set up SOS Guardian so trusted contacts can be notified instantly if
          you feel unsafe.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconPill}>
              <Ionicons name="alert" size={18} color={COLORS.text} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Instant SOS alerts</Text>
              <Text style={styles.cardText}>
                One tap shares your live location with trusted contacts via SMS.
              </Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.iconPill}>
              <Ionicons name="time" size={18} color={COLORS.text} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Safety timers</Text>
              <Text style={styles.cardText}>
                Start a timer for walks home and get reminded if you don&apos;t
                check in.
              </Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.iconPill}>
              <Ionicons name="people" size={18} color={COLORS.text} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Trusted contacts</Text>
              <Text style={styles.cardText}>
                Choose who gets notified when you trigger SOS.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Enable notifications" onPress={handleEnableNotifications} />
          <Button title="Enable location" onPress={handleEnableLocation} />
          <TouchableOpacity onPress={handleAddContact}>
            <Text style={styles.secondaryLink}>Add your first emergency contact</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 16}}>
          <Button title="Continue" onPress={handleContinue} />
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
    paddingHorizontal: 20,
    paddingTop: 64,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  appName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },
  heading: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subheading: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  cardText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    marginTop: 24,
  },
  secondaryLink: {
    color: COLORS.secondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});

export default OnboardingScreen;

