import React, {useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {z} from "zod";
import {COLORS} from "../../constants/colors";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {useAuth} from "../../context/AuthContext";
import {addEmergencyContact} from "../../services/database";
import {notifyContactAdded} from "../../services/pushNotifications";

type Props = NativeStackScreenProps<any>;

const contactSchema = z.object({
  name: z.string().min(2, "Enter a name"),
  relationship: z.string().min(2, "Enter a relationship"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+()\s-]+$/, "Phone can only contain numbers and symbols"),
});

type ContactForm = z.infer<typeof contactSchema>;

const AddContactScreen: React.FC<Props> = ({navigation}) => {
  const {firebaseUser} = useAuth();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactForm, string>>
  >({});

  const handleSave = async () => {
    if (!firebaseUser) return;
    setError(null);
    setFieldErrors({});

    const result = contactSchema.safeParse({name, relationship, phone});
    if (!result.success) {
      const errors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ContactForm;
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await addEmergencyContact({
        userId: firebaseUser.uid,
        ...result.data,
        priority: 1,
        verified: false,
      } as any);

      // Notify the contact if they're a user
      try {
        await notifyContactAdded(
          result.data.phone,
          firebaseUser.displayName || "Someone",
        );
      } catch (notifError) {
        // Don't fail the whole operation if notification fails
        console.log("Could not notify contact:", notifError);
      }

      navigation.goBack();
    } catch (e: any) {
      setError(e?.message || "Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add contact</Text>

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        error={fieldErrors.name}
      />
      <Input
        label="Relationship"
        value={relationship}
        onChangeText={setRelationship}
        error={fieldErrors.relationship}
      />
      <Input
        label="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        error={fieldErrors.phone}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Save" onPress={handleSave} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  error: {
    color: COLORS.error,
    marginVertical: 8,
  },
});

export default AddContactScreen;

