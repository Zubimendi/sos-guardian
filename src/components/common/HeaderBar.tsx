import React from "react";
import {View, Text, StyleSheet, ViewStyle} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";

interface Props {
  style?: ViewStyle;
}

const HeaderBar: React.FC<Props> = ({style}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoRow}>
        <View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.text} />
        </View>
        <Text style={styles.appName}>SOS Guardian</Text>
      </View>
      <Text style={styles.tagline}>Personal safety, one tap away.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  appName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});

export default HeaderBar;

