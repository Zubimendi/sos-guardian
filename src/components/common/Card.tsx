import React, {ReactNode} from "react";
import {View, StyleSheet, ViewStyle} from "react-native";
import {COLORS} from "../../constants/colors";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

const Card: React.FC<Props> = ({children, style}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default Card;

