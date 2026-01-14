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
});

export default Screen;

