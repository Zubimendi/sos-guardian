import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {z} from "zod";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {COLORS} from "../../constants/colors";
import {useAuth} from "../../context/AuthContext";

type Props = NativeStackScreenProps<any>;

const signupSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+()\s-]+$/, "Phone can only contain numbers and symbols"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

const SignupScreen: React.FC<Props> = ({navigation}) => {
  const {signUp} = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignupForm, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setFieldErrors({});
    const result = signupSchema.safeParse({
      name,
      phone,
      email: email.trim(),
      password,
    });

    if (!result.success) {
      const errors: Partial<Record<keyof SignupForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof SignupForm;
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await signUp(result.data);
    } catch (e: any) {
      setError(e?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#040613", "#070a1f", "#050509"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Set up SOS Guardian so your trusted contacts can be notified in
          emergencies.
        </Text>

        <Input
          label="Full name"
          value={name}
          onChangeText={setName}
          error={fieldErrors.name}
        />
        <Input
          label="Phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          error={fieldErrors.phone}
        />
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
        />
        <Input
          label="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          }
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title="Create account"
          onPress={handleSignup}
          loading={loading}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.switchText}>
            Already have an account?{" "}
            <Text style={{color: COLORS.primary}}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  error: {
    color: COLORS.error,
    marginVertical: 8,
  },
  switchText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 16,
  },
});

export default SignupScreen;

