import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {COLORS} from "../../constants/colors";
import Button from "../common/Button";
import {APP_CONFIG} from "../../constants/config";

interface Props {
  durationMinutes?: number;
  onStart: (duration: number) => void;
}

const SafetyTimer: React.FC<Props> = ({
  durationMinutes = APP_CONFIG.DEFAULT_SAFETY_TIMER,
  onStart,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Safety Timer</Text>
      <Text style={styles.description}>
        Start a countdown so we check in if you don&apos;t confirm you&apos;re
        safe.
      </Text>
      <Button
        title={`Start ${durationMinutes} min timer`}
        onPress={() => onStart(durationMinutes)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
});

export default SafetyTimer;

