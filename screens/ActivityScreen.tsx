import { View, Text, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import { Activity } from "@/types/types";
import { useDispatch } from "react-redux";
import {
  deleteActivityByUserId,
  getActivityByUserId,
} from "@/redux/slicer/activitySlice";
import { useLocalSearchParams } from "expo-router";
import { AppDispatch } from "@/redux/store";
import RenderActivity from "@/components/RenderActivity";
import { Ionicons } from "@expo/vector-icons";
import SlideModal from "@/components/SlideModal";
import AnimatedAlertNotification from "@/components/AlertNotification";
import RenderEmpty from "@/components/RenderEmpty";

export const ActivityScreen = () => {
  const { colors } = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const { userId } = useLocalSearchParams();
  const [activity, setActivity] = useState<Activity[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleModal = () => setModalVisible(!modalVisible);

  useEffect(() => {
    getActivity();
  }, []);

  const getActivity = async () => {
    try {
      const response = await dispatch(
        getActivityByUserId({ id: Number(userId) })
      ).unwrap();
      setActivity(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleModalClick = () => {
    setModalVisible(!modalVisible);
  };

  const handleDeleteActivity = async () => {
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      await dispatch(deleteActivityByUserId({ id: Number(userId) })).unwrap();
      await getActivity();
      setSuccess("Deleted activity");
    } catch (error) {
      console.log(error);

      setError("error deleted activity");
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
      <View className="flex-row gap-5 items-center mb-3 justify-between">
        <BackButton />
        <Text style={{ fontFamily: "Kanit", color: colors.text }}>
          Activity Histories
        </Text>
        <Pressable onPress={handleModalClick}>
          <Ionicons name="settings-outline" size={20} color={colors.text} />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-4 justify-center mb-5">
        <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
        <Text
          className="text-custom-green-opacity-1"
          style={{ fontFamily: "Kanit" }}
        >
          activities
        </Text>
        <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
      </View>
      <FlatList
        data={activity}
        renderItem={({ item, index }) => (
          <RenderActivity
            item={item}
            index={index}
            totalItems={activity.length}
          />
        )}
        ListEmptyComponent={
          <RenderEmpty
            descriptions={`no histories available`}
            icon="footsteps-outline"
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />

      <SlideModal
        modalVisible={modalVisible}
        isActivity={true}
        handleModal={handleModal}
        onActivity={handleDeleteActivity}
        isLoading={isLoading}
      />
    </View>
  );
};
