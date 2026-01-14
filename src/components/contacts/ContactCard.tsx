import React from "react";
import {View, Text, StyleSheet} from "react-native";
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
          <View style={styles.actions}>
            <Button title="Remove" onPress={onDelete} />
          </View>
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
});

export default ContactCard;

