import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";
import Card from "../common/Card";
import Button from "../common/Button";
import {EmergencyContact} from "../../types";

interface Props {
  contact: EmergencyContact;
  onDelete?: () => void;
}

const ContactCard: React.FC<Props> = ({contact, onDelete}) => {
  return (
    <Card>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.meta}>{contact.relationship}</Text>
          <Text style={styles.meta}>{contact.phone}</Text>
        </View>
        {onDelete ? (
          <TouchableOpacity style={styles.removePill} onPress={onDelete}>
            <Ionicons
              name="trash-outline"
              size={16}
              color={COLORS.textSecondary}
              style={{marginRight: 4}}
            />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    marginLeft: 12,
  },
  removePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  removeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});

export default ContactCard;

