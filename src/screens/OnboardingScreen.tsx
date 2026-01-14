import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {COLORS} from "../constants/colors";
import Button from "../components/common/Button";
import Screen from "../components/common/Screen";
import {registerForPushNotificationsAsync} from "../services/notifications";
import {requestLocationPermission} from "../services/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../context/AuthContext";

type Props = NativeStackScreenProps<any>;

const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const {firebaseUser} = useAuth();

  const handleContinue = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    // If user is already logged in, go straight to the main app,
    // otherwise show the auth flow.
    if (firebaseUser) {
      navigation.replace("Main");
    } else {
      navigation.replace("Auth");
    }
  };

  const handleEnableNotifications = async () => {
    await registerForPushNotificationsAsync();
  };

  const handleEnableLocation = async () => {
    await requestLocationPermission();
  };

  const handleAddContact = () => {
    // Require auth before adding contacts
    if (firebaseUser) {
      navigation.navigate("AddContact");
    } else {
      navigation.replace("Auth");
    }
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 32}}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.text} />
          </View>
          <View>
            <Text style={styles.appName}>SOS Guardian</Text>
            <Text style={styles.appTagline}>Personal safety, one tap away.</Text>
          </View>
        </View>

        <Text style={styles.heading}>Feel safer getting home</Text>
        <Text style={styles.subheading}>
          Configure SOS Guardian in under a minute so your trusted contacts are ready
          when you need them most.
        </Text>

        <View style={styles.stepsRow}>
          <View style={styles.stepPill}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Enable alerts</Text>
          </View>
          <View style={styles.stepPill}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Allow location</Text>
          </View>
          <View style={styles.stepPill}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Add contacts</Text>
          </View>
        </View>

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
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleEnableNotifications}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons
                name="notifications-outline"
                size={16}
                color={COLORS.secondary}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.actionTitle}>Enable notifications</Text>
              <Text style={styles.actionText}>
                So we can remind you about timers and SOS state.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleEnableLocation}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.secondary}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.actionTitle}>Enable location</Text>
              <Text style={styles.actionText}>
                So your contacts receive accurate SOS locations.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAddContact}>
            <Text style={styles.secondaryLink}>
              Add your first emergency contact
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 16}}>
          <Button title="Get started" onPress={handleContinue} />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  appTagline: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 12,
    marginTop: 2,
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
  stepsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  stepNumber: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    marginRight: 4,
  },
  stepText: {
    color: COLORS.textSecondary,
    fontSize: 12,
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
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  actionIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  actionText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  secondaryLink: {
    color: COLORS.secondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});

export default OnboardingScreen;

