import React from "react";
import {TouchableOpacity, Text, StyleSheet, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";

interface Props {
  onPress: () => void;
  active?: boolean;
}

const SOSButton: React.FC<Props> = ({onPress, active}) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={active ? ["#FF5F6D", "#FFC371"] : ["#FF3B30", "#FF5F6D"]}
        style={[styles.button, active && styles.buttonActive]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="alert" size={32} color={COLORS.text} />
        </View>
        <Text style={styles.text}>{active ? "SOS ACTIVE" : "PRESS SOS"}</Text>
        <Text style={styles.subtext}>Notifies your trusted contacts</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    marginVertical: 24,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#FF3B30",
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 10},
  },
  buttonActive: {
    shadowColor: "#FFC371",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  text: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  subtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});

export default SOSButton;

