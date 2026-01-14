import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {COLORS} from "../../constants/colors";
import Button from "../common/Button";
import {APP_CONFIG} from "../../constants/config";

interface Props {
  durationMinutes?: number;
  onStart: (duration: number) => void;
  remainingSeconds?: number | null;
}

const SafetyTimer: React.FC<Props> = ({
  durationMinutes = APP_CONFIG.DEFAULT_SAFETY_TIMER,
  onStart,
  remainingSeconds,
}) => {
  const [selected, setSelected] = useState<number>(durationMinutes);

  const presets =
    APP_CONFIG.SAFETY_TIMER_OPTIONS && APP_CONFIG.SAFETY_TIMER_OPTIONS.length
      ? APP_CONFIG.SAFETY_TIMER_OPTIONS
      : [15, 30, 45, 60];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Safety Timer</Text>
      <Text style={styles.description}>
        Start a countdown so we check in if you don&apos;t confirm you&apos;re
        safe.
      </Text>
      <View style={styles.pillRow}>
        {presets.map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.pill,
              selected === m && styles.pillSelected,
            ]}
            onPress={() => setSelected(m)}
          >
            <Text
              style={[
                styles.pillText,
                selected === m && styles.pillTextSelected,
              ]}
            >
              {m} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {typeof remainingSeconds === "number" && remainingSeconds > 0 && (
        <Text style={styles.timerText}>
          Timer running:{" "}
          {`${Math.floor(remainingSeconds / 60)}:${`${remainingSeconds % 60}`.padStart(2, "0")}`}
        </Text>
      )}
      <Button
        title={`Start ${selected} min timer`}
        onPress={() => onStart(selected)}
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
  timerText: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
    marginBottom: 6,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  pillTextSelected: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

export default SafetyTimer;

