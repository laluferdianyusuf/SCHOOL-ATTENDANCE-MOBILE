import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { Notification } from "@/types/types";
import {
  deleteNotification,
  getNotificationBySchoolId,
  openAllNotifications,
  openNotification,
} from "@/redux/slicer/notificationSlice";
import { AppDispatch } from "@/redux/store";
import Loading from "@/components/Loading";
import formatDate from "@/utils/FormatDate";
import { Swipeable } from "react-native-gesture-handler";
import AnimatedAlertNotification from "@/components/AlertNotification";
import SlideModal from "@/components/SlideModal";
import BackButton from "@/components/BackButton";

export const NotificationScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { schoolId, userId } = useLocalSearchParams();
  const { colors, dark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const swipeableRefs = useRef<Map<number, Swipeable | null>>(new Map());
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchNotifications();
  }, [schoolId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError("");
    if (typeof schoolId === "string") {
      try {
        const resultAction = await dispatch(
          getNotificationBySchoolId({
            schoolId: schoolId,
            userId: Number(userId),
          })
        ).unwrap();
        setNotifications(
          Array.isArray(resultAction.data) ? resultAction.data : []
        );
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    } else {
      setError("Invalid school ID.");
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleOpen = async (id: number, notification: Notification) => {
    try {
      router.push({
        pathname: "/(main)/details",
        params: {
          notificationId: id,
          notification: JSON.stringify(notification),
        },
      });
      await dispatch(openNotification({ id })).unwrap();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, isOpened: true }
            : notification
        )
      );
    } catch (error: any) {
      console.error("Failed to open notification:", error);
    }
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        openAllNotifications({
          userId: Number(userId),
          schoolId: Number(schoolId),
          isOpened: true,
        })
      ).unwrap();

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isOpened: true,
        }))
      );
    } catch (error) {
      setError("Failed to open all notifications.");
      console.error("Failed to open all notifications:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const markAllAsUnread = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        openAllNotifications({
          userId: Number(userId),
          schoolId: Number(schoolId),
          isOpened: false,
        })
      ).unwrap();

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isOpened: false,
        }))
      );
    } catch (error) {
      setError("Failed to open all notifications.");
      console.error("Failed to open all notifications:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    setSuccess("");
    try {
      await dispatch(deleteNotification({ id })).unwrap();
      fetchNotifications();
      setSuccess("Deleted successfully");
      setDeleteLoading(false);
    } catch (error) {
      fetchNotifications();
      console.error("Failed to delete notification:", error);
      setDeleteLoading(false);
    }
  };

  const renderRightActions = (id: number) => (
    <Pressable
      disabled={deleteLoading}
      className={`ml-2 mt-4 ${
        deleteLoading ? "bg-custom-green-opacity-1" : "bg-red-800"
      } items-center justify-center px-5 rounded-xl`}
      onPress={() => handleDelete(id)}
    >
      {deleteLoading ? (
        <ActivityIndicator size="large" color={"#0D9485"} />
      ) : (
        <Ionicons name="trash-outline" size={24} color="white" />
      )}
    </Pressable>
  );

  const handleSwipeableWillOpen = (id: number) => {
    if (openItemId !== id) {
      if (openItemId !== null) {
        swipeableRefs.current.get(openItemId)?.close();
      }
      setOpenItemId(id);
    }
  };

  const backgroundColor = dark ? "#041f1b" : "#c5e0dd";
  const tintColor = dark ? "#0D9485" : "#0D9485";

  const handleOutsideClick = () => {
    if (openItemId !== null) {
      swipeableRefs.current.get(openItemId)?.close();
      setOpenItemId(null);
    }
  };

  const handleModalClick = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View className="flex-1 pt-16 px-6 pb-8">
        <View className="flex-row justify-between mb-3">
          <BackButton />
          <Text style={{ fontFamily: "Kanit", color: colors.text }}>
            Notifications
          </Text>
          <Pressable onPress={handleModalClick}>
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
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

        <SlideModal
          modalVisible={modalVisible}
          handleModal={handleModalClick}
          isNotification={true}
          onNotificationOpen={markAllAsRead}
          onNotificationClose={markAllAsUnread}
        />
        <View className="flex-row items-center gap-4 justify-center mb-2">
          <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
          <Text
            className="text-custom-green-opacity-1"
            style={{ fontFamily: "Kanit" }}
          >
            Notifications
          </Text>
          <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
        </View>

        {isLoading && !refreshing ? (
          <Loading />
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons
              name="alert-outline"
              size={100}
              color={colors.notification}
            />
            <Text style={{ color: colors.notification, fontFamily: "Kanit" }}>
              {error}
            </Text>
          </View>
        ) : notifications.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#0D9485"]}
                tintColor={tintColor}
                progressBackgroundColor={backgroundColor}
              />
            }
          >
            {notifications.map((notification) => (
              <Swipeable
                key={notification.id}
                ref={(ref) =>
                  ref && swipeableRefs.current.set(notification.id!, ref)
                }
                renderRightActions={() => renderRightActions(notification.id!)}
                onSwipeableWillOpen={() =>
                  handleSwipeableWillOpen(notification.id || 0)
                }
              >
                <Button
                  style={`mt-4 ${
                    notification.isOpened
                      ? `${
                          dark
                            ? "bg-custom-green-dark"
                            : "bg-custom-green-light"
                        }`
                      : "bg-custom-green-2"
                  } rounded-xl relative`}
                  handle={() => handleOpen(notification.id!, notification)}
                >
                  {notification.isOpened && (
                    <View className="absolute bottom-1 right-3 z-50">
                      <Text
                        style={{
                          fontFamily: "Kanit",
                          color: "gray",
                        }}
                        className="uppercase text-custom-green-2 opacity-25 z-50"
                      >
                        Opened
                      </Text>
                    </View>
                  )}
                  <View className="flex-row gap-5 items-center p-5 z-40">
                    <Ionicons
                      name={
                        notification.isOpened ? "folder-open-outline" : "folder"
                      }
                      size={30}
                      color={notification.isOpened ? "gray" : colors.text}
                    />
                    <View>
                      <Text
                        className="capitalize"
                        style={{
                          color: notification.isOpened ? "gray" : colors.text,
                          fontFamily: "Kanit",
                        }}
                      >
                        {notification.student?.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="text-xs pr-5"
                        style={{
                          color: notification.isOpened ? "gray" : colors.text,
                          fontFamily: "Kanit",
                        }}
                      >
                        {notification?.description}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2 absolute top-3 right-3">
                    <Text
                      style={{
                        fontFamily: "Kanit",
                        color: notification.isOpened ? "gray" : colors.text,
                      }}
                      className="text-xs"
                    >
                      {formatDate(notification?.attendance?.createdAt || "")}
                    </Text>
                    <Ionicons
                      name="alarm-outline"
                      color={notification.isOpened ? "gray" : colors.text}
                      size={15}
                    />
                  </View>
                </Button>
              </Swipeable>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#0D9485"]}
                tintColor={"#0D9485"}
                progressBackgroundColor={"#0d948533"}
              />
            }
            contentContainerStyle={{ height: "100%" }}
          >
            <View className="flex-1 justify-center items-center">
              <MaterialCommunityIcons
                name="bell-outline"
                size={100}
                color={"#0D9485"}
              />
              <Text
                style={{ fontFamily: "Kanit", color: "#0D9485" }}
                className=""
              >
                No notifications available
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
