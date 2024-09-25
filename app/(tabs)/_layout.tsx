import { Tabs, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useIsFocused,
  useTheme,
  useNavigation,
} from "@react-navigation/native";
import {
  AppState,
  AppStateStatus,
  BackHandler,
  ToastAndroid,
} from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { dark } = useTheme();
  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const [appExited, setAppExited] = useState<boolean>(false);
  const navigation = useNavigation();
  const { user } = useLocalSearchParams();
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState === "background" && nextAppState === "active" && appExited) {
        resetAppState();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState, appExited]);

  const resetAppState = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "(main)/index" } as any],
    });
    setAppExited(false);
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 3000);

        return true;
      } else {
        clearTimeout(backPressTimer.current as NodeJS.Timeout);
        BackHandler.exitApp();
        setAppExited(true);
        return true;
      }
    };

    if (isFocused) {
      backPressCount.current = 0;
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      clearTimeout(backPressTimer.current as NodeJS.Timeout);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      clearTimeout(backPressTimer.current as NodeJS.Timeout);
    };
  }, [isFocused]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#14B8A6",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          height: 55,
          backgroundColor: Colors[colorScheme ?? "light"].background,
          paddingBottom: 5,
          elevation: 0,
          borderTopWidth: 1,
          borderColor: dark ? "#041f1b" : "#c5e0dd",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Kanit",
        },
        tabBarIconStyle: {
          marginTop: 5,
        },

        tabBarVisibilityAnimationConfig: {
          show: {
            animation: "timing",
            config: {
              duration: 500,
            },
          },
          hide: {
            animation: "timing",
            config: {
              duration: 500,
            },
          },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={({ route, navigation }) => ({
          title: navigation.getState().index === 0 ? "Home" : "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={navigation.getState().index === 0 ? "home" : "home-outline"}
              color={color}
              size={navigation.getState().index === 0 ? 22 : 20}
            />
          ),
        })}
      />

      <Tabs.Screen
        name="course"
        options={({ route, navigation }) => ({
          title: navigation.getState().index === 1 ? "Course" : "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={
                navigation.getState().index === 1 ? "albums" : "albums-outline"
              }
              color={color}
              size={navigation.getState().index === 1 ? 22 : 20}
            />
          ),
          tabBarButton: parsedUser.role === "parent" ? undefined : () => null,
        })}
      />
      <Tabs.Screen
        name="profile"
        options={({ route, navigation }) => ({
          title: navigation.getState().index === 2 ? "Profile" : "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={
                navigation.getState().index === 2
                  ? "person-circle-sharp"
                  : "person-circle-outline"
              }
              color={color}
              size={navigation.getState().index === 2 ? 22 : 20}
            />
          ),
        })}
      />
    </Tabs>
  );
}
