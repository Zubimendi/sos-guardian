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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {signIn} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setFieldErrors({});
    const result = loginSchema.safeParse({email: email.trim(), password});
    if (!result.success) {
      const errors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LoginForm;
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await signIn(result.data.email, result.data.password);
    } catch (e: any) {
      setError(e?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#040613", "#060818", "#050509"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>SOS Guardian</Text>
        <Text style={styles.subtitle}>Sign in to stay safe everywhere.</Text>

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

        <Button title="Sign In" onPress={handleLogin} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.switchText}>
            New here?{" "}
            <Text style={{color: COLORS.primary}}>Create account</Text>
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
    fontSize: 28,
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

export default LoginScreen;

