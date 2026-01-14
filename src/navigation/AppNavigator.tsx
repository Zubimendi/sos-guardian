import React, {useEffect, useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {ActivityIndicator, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../context/AuthContext";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/home/HomeScreen";
import ContactsScreen from "../screens/contacts/ContactsScreen";
import AddContactScreen from "../screens/contacts/AddContactScreen";
import AlertHistoryScreen from "../screens/alerts/AlertHistoryScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import {COLORS} from "../constants/colors";

const AuthStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {backgroundColor: COLORS.surface, borderTopColor: COLORS.border},
      tabBarIcon: ({color, size}) => {
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "Home") iconName = "shield-checkmark";
        if (route.name === "Contacts") iconName = "people";
        if (route.name === "Alerts") iconName = "alert-circle";
        if (route.name === "Settings") iconName = "settings";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Contacts" component={ContactsScreen} />
    <Tab.Screen name="Alerts" component={AlertHistoryScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const {firebaseUser, loading} = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(stored === "true");
    })();
  }, []);

  if (loading || hasOnboarded === null) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {!firebaseUser && !hasOnboarded && (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        {firebaseUser ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
        <RootStack.Screen
          name="AddContact"
          component={AddContactScreen}
          options={{presentation: "modal"}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

