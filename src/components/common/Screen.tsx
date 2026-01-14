import React, {ReactNode} from "react";
import {View, StyleSheet, ViewStyle} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {COLORS} from "../../constants/colors";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

const Screen: React.FC<Props> = ({children, style}) => {
  return (
    <LinearGradient
      colors={["#050816", "#0B1020", "#050816"]}
      style={styles.gradient}
    >
      <View pointerEvents="none" style={styles.shapes}>
        <View style={[styles.shape, styles.shapeTopRight]} />
        <View style={[styles.shape, styles.shapeBottomLeft]} />
        <View style={[styles.shapeSmall, styles.shapeCenter]} />
      </View>
      <View style={[styles.container, style]}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: "transparent",
  },
  shapes: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  shape: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,59,48,0.15)",
  },
  shapeSmall: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(0,122,255,0.18)",
  },
  shapeTopRight: {
    top: -80,
    right: -60,
  },
  shapeBottomLeft: {
    bottom: -100,
    left: -80,
  },
  shapeCenter: {
    top: "35%",
    right: -40,
  },
});

export default Screen;

