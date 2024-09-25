import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import CustomInput from "@/components/CustomInput";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { changePassword } from "@/redux/slicer/adminSlice";
import { useLocalSearchParams } from "expo-router";
import * as Device from "expo-device";
import Button from "@/components/Button";
import AnimatedAlertNotification from "@/components/AlertNotification";
import LoadingModal from "@/components/LoadingModal";
import * as SecureStore from "expo-secure-store";

export const ChangePasswordScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userId, role } = useLocalSearchParams();
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reTypePassword, setReTypePassword] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangePassword = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        id: Number(userId),
        currentPassword: currentPassword,
        password: password,
        reTypePassword: reTypePassword,
        device: `${Device.manufacturer} ${Device.modelName}`,
        hardware: `${
          Device.deviceType === 0
            ? "Unknown"
            : Device.deviceType === 1
            ? "Phone"
            : Device.deviceType === 2
            ? "Tablet"
            : Device.deviceType === 3
            ? "TV"
            : "DESKTOP"
        }`,
      };

      if (role !== "admin") {
        await SecureStore.setItemAsync("parentPassword", password);
      } else {
        await SecureStore.setItemAsync("adminPassword", password);
      }
      await dispatch(changePassword(payload)).unwrap();
      setSuccess("Password changed");
      setCurrentPassword("");
      setPassword("");
      setReTypePassword("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="pt-16 px-6 flex-1">
      {error && (
        <AnimatedAlertNotification
          text={error}
          background="bg-custom-error-1"
          icon="alert-circle-sharp"
          textStyle="#E60000"
        />
      )}
      {success && (
        <AnimatedAlertNotification
          text={success}
          background="bg-custom-success-1"
          icon="checkmark-circle"
          textStyle="#008A2E"
        />
      )}
      <LoadingModal modalVisible={isLoading} />
      <View className="flex-row gap-3 items-center mb-3">
        <BackButton />
        <Text style={{ fontFamily: "Kanit", color: colors.text }}>
          Change Password
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          className="text-justify"
          style={{ fontFamily: "Kanit", color: colors.text }}
        >
          The change password functionality is a secure process designed to
          allow to update your current password by verifying their identity and
          ensuring the new password meets the necessary criteria.
        </Text>
        <View className="mt-5">
          <View>
            <Text style={{ fontFamily: "Kanit", color: colors.text }}>
              Current Password
            </Text>
            <CustomInput
              icon={"lock-closed-outline"}
              placeholder="current password"
              isPassword={true}
              onChange={(text) => setCurrentPassword(text)}
              value={currentPassword}
            />
          </View>
          <View>
            <Text style={{ fontFamily: "Kanit", color: colors.text }}>
              New Password
            </Text>
            <CustomInput
              icon={"lock-closed-outline"}
              placeholder="new password"
              isPassword={true}
              onChange={(text) => setPassword(text)}
              value={password}
            />
            <CustomInput
              icon={"repeat"}
              placeholder="re type a password"
              isPassword={true}
              onChange={(text) => setReTypePassword(text)}
              value={reTypePassword}
            />
          </View>
          <Button
            handle={handleChangePassword}
            style="p-3 justify-center items-center rounded-xl bg-custom-green-1"
          >
            <Text style={{ fontFamily: "Kanit", color: colors.text }}>
              Change Password
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};
