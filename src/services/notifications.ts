import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {Platform} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async (): Promise<
  string | null
> => {
  if (!Device.isDevice) {
    return null;
  }

  const {status: existingStatus} =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  secondsFromNow: number,
) => {
  await Notifications.scheduleNotificationAsync({
    content: {title, body},
    trigger:
      Platform.OS === "web"
        ? null
        : {
            seconds: secondsFromNow,
          },
  });
};

