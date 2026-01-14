import React from "react";
import {View, Text, StyleSheet, ViewStyle} from "react-native";
import {COLORS} from "../../constants/colors";

interface Props {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  right?: React.ReactNode;
}

const SectionHeader: React.FC<Props> = ({title, subtitle, style, right}) => {
  return (
    <View style={[styles.row, style]}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});

export default SectionHeader;

