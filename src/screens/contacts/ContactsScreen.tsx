import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, FlatList} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {COLORS} from "../../constants/colors";
import Button from "../../components/common/Button";
import Screen from "../../components/common/Screen";
import SectionHeader from "../../components/common/SectionHeader";
import ContactCard from "../../components/contacts/ContactCard";
import {EmergencyContact} from "../../types";
import {useAuth} from "../../context/AuthContext";
import {
  getUserContacts,
  deleteEmergencyContact,
} from "../../services/database";

type Props = NativeStackScreenProps<any>;

const ContactsScreen: React.FC<Props> = ({navigation}) => {
  const {firebaseUser} = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  const loadContacts = async () => {
    if (!firebaseUser) return;
    const data = await getUserContacts(firebaseUser.uid);
    setContacts(data);
  };

  useEffect(() => {
    void loadContacts();
  }, [firebaseUser]);

  const handleDelete = async (id: string) => {
    await deleteEmergencyContact(id);
    void loadContacts();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <SectionHeader
          title="Emergency contacts"
          subtitle="People we notify when you trigger an SOS."
          right={
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={22} color={COLORS.text} />
            </View>
          }
        />

        <Button
          title="Add contact"
          onPress={() => navigation.navigate("AddContact")}
        />

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <ContactCard
              contact={item}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No contacts yet. Add at least one trusted person so we can notify
              them in an emergency.
            </Text>
          }
          contentContainerStyle={{paddingBottom: 40}}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  empty: {
    color: COLORS.textSecondary,
    marginTop: 20,
  },
});

export default ContactsScreen;

