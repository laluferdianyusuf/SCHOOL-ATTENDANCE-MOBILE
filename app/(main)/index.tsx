import { View, Text, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useTheme } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "@/redux/slicer/adminSlice";
import { Admin } from "@/types/types";

export default function App() {
  const dispatch: AppDispatch = useDispatch();
  const animation = useRef<LottieView>(null);

  const { colors } = useTheme();
  const navigateTo = (path: any, isAdmin: boolean, user?: Admin) => {
    router.push({
      pathname: path,
      params: { isAdmin: isAdmin.toString(), user: JSON.stringify(user) },
    });
  };

  useEffect(() => {
    dispatch(currentUser()).unwrap();
  }, [dispatch]);

  const { admin } = useSelector((state: RootState) => state.auth);

  const navigateParentScreen = async () => {
    if (admin && admin?.role === "parent") {
      navigateTo("/(tabs)", false, admin);
    } else {
      navigateTo("/(parent)/login", false);
    }
  };

  const navigateAdminScreen = () => {
    if ((admin && admin?.role === "admin") || admin?.role === "superadmin") {
      navigateTo("/(tabs)", true, admin);
    } else {
      navigateTo("/(admin)/login", true);
    }
  };

  return (
    <View
      className={`flex-1 justify-center items-center px-6 bg-${colors.background}`}
    >
      <View className="justify-center items-center mb-7">
        <Text
          className="text-3xl font-bold capitalize"
          style={{ fontFamily: "Kanit", color: colors.text }}
        >
          Type of account
        </Text>
        <Text
          className="text-center opacity-50 px-12"
          style={{ fontFamily: "Kanit", color: colors.text }}
        >
          Choose type of your account, be careful to change it is impossible
        </Text>
      </View>
      <View className="w-full flex-col gap-5">
        <Animated.View
          className="h-60 w-full p-5 px-8 rounded-xl "
          style={{ backgroundColor: colors.border }}
          entering={FadeInDown.duration(300).delay(200).springify()}
        >
          <Pressable
            onPress={navigateParentScreen}
            className="flex-row  items-center w-full justify-between"
          >
            <View className="flex-col justify-between h-full flex-1">
              <Text
                className="font-extrabold text-3xl text-custom-green-2"
                style={{ fontFamily: "Kanit" }}
              >
                Sign in as Parent
              </Text>
              <Text style={{ fontFamily: "Kanit", color: colors.text }}>
                The easiest way to monitoring your child's attendance.
              </Text>
            </View>
            <View className="rounded-full overflow-hidden items-center flex-1 ">
              <FontAwesome6
                name="user-graduate"
                color={colors.text}
                size={80}
              />
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View
          className="h-60 w-full p-5 px-8 rounded-xl "
          style={{ backgroundColor: colors.border }}
          entering={FadeInDown.duration(300).delay(300).springify()}
        >
          <Pressable
            onPress={navigateAdminScreen}
            className="flex-row  items-center w-full  justify-between"
          >
            <View className="flex-col justify-between h-full flex-1">
              <Text
                className="font-extrabold text-3xl text-custom-green-2"
                style={{ fontFamily: "Kanit" }}
              >
                Sign in as Teacher
              </Text>
              <Text style={{ fontFamily: "Kanit", color: colors.text }}>
                The easiest way to manage your school information.
              </Text>
            </View>
            <View className="rounded-full overflow-hidden items-center flex-1 ">
              <FontAwesome6 name="user-tie" color={colors.text} size={80} />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
