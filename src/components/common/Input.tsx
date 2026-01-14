import React, {ReactNode} from "react";
import {TextInput, TextInputProps, StyleSheet, View, Text} from "react-native";
import {COLORS} from "../../constants/colors";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: ReactNode;
}

const Input: React.FC<Props> = ({label, error, style, rightIcon, ...rest}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={COLORS.textSecondary}
          style={[styles.input, style]}
          {...rest}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontSize: 13,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  rightIcon: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;

