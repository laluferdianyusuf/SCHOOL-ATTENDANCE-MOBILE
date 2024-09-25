import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import * as Device from "expo-device";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import { Admin } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  currentUser,
  updateAccount,
  updateProfileField,
} from "@/redux/slicer/adminSlice";
import Loading from "@/components/Loading";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import AnimatedAlertNotification from "@/components/AlertNotification";

export const ProfileScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { colors } = useTheme();
  const [user, setUser] = useState<Admin | null>(null);
  const profileUpdates = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await dispatch(currentUser()).unwrap();
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };

  const handleSaveChanges = () => {
    setSuccess("");
    setError("");
    try {
      dispatch(
        updateAccount({
          id: Number(user?.id),
          birthday: profileUpdates.birthday || user?.birthday || "",
          address: profileUpdates.address || user?.address || "",
          phoneNumber:
            profileUpdates["phone number"] || user?.phoneNumber || "",
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
        })
      );
      setSuccess("Updated account information");
    } catch (error) {
      setError("Error Update Account Information");
    }
  };

  if (loading) {
    return <Loading />;
  }

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

      <View className="flex-row gap-3 items-center">
        <BackButton />
        <Text style={{ fontFamily: "Kanit", color: colors.text }}>
          Edit Profile
        </Text>
      </View>

      {user ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="my-5"
        >
          <View className="bg-custom-green-opacity-1 w-36 rounded-full self-center items-center h-36 justify-center">
            <Text
              className="text-4xl text-custom-green-2 uppercase text-center h-7"
              style={{ fontFamily: "Kanit" }}
            >
              {user?.username!.charAt(0)}
            </Text>
          </View>
          <View className="mb-5">
            <Text
              className="text-center font-bold capitalize text-xl text-custom-green-1"
              style={{ fontFamily: "Kanit" }}
            >
              {user.name}
            </Text>
            <Text
              className="text-center opacity-50"
              style={{ fontFamily: "Kanit", color: colors.text }}
            >
              @{user.username}
            </Text>
          </View>
          <View>
            <CustomInput
              value={user.email!}
              placeholder="email"
              icon={"at-outline"}
              disabled={true}
              title="email"
            />
            <CustomInput
              value={profileUpdates.birthday || user.birthday || ""}
              placeholder="set new birthday"
              icon={"today-outline"}
              title="birthday"
              disabled={true}
              isUpdated={true}
              onChange={(text) =>
                dispatch(updateProfileField({ field: "birthday", value: text }))
              }
            />
            <CustomInput
              value={profileUpdates.address || user.address || ""}
              placeholder="set new address"
              icon={"location-outline"}
              title="address"
              disabled={true}
              isUpdated={true}
              onChange={(text) =>
                dispatch(updateProfileField({ field: "address", value: text }))
              }
            />
            <CustomInput
              value={profileUpdates["phone number"] || user.phoneNumber || ""}
              placeholder="set new phone number"
              icon={"phone-portrait-outline"}
              title="phone number"
              disabled={true}
              isUpdated={true}
              onChange={(text) =>
                dispatch(
                  updateProfileField({ field: "phoneNumber", value: text })
                )
              }
            />
          </View>
          <Button
            handle={handleSaveChanges}
            style="bg-custom-green-1 items-center justify-center rounded-xl p-4"
          >
            <Text style={{ fontFamily: "Kanit", color: colors.text }}>
              Save Changes
            </Text>
          </Button>
        </ScrollView>
      ) : (
        <Text style={{ fontFamily: "Kanit", color: colors.text }}>
          User not found
        </Text>
      )}
    </View>
  );
};
