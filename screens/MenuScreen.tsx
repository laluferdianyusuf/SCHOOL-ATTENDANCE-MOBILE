import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as Device from "expo-device";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Admin, MenuItemProps, Student } from "@/types/types";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { currentUser, logout } from "@/redux/slicer/adminSlice";
import AnimatedAlertNotification from "@/components/AlertNotification";
import SlideModal from "@/components/SlideModal";
import LoadingModal from "@/components/LoadingModal";
import Loading from "@/components/Loading";
import { MenuItem, AccountMenu } from "@/utils";
import { createActivity } from "@/redux/slicer/activitySlice";
import { getStudentById } from "@/redux/slicer/studentSlice";

export const MenuScreen = () => {
  const { colors, dark } = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const [user, setUser] = useState<Admin>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renderLoading, setRenderLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [student, setStudent] = useState<Student | null>();

  const handleModal = () => setModalVisible(!modalVisible);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user?.studentId) {
      fetchStudent();
    }
  }, [user]);

  const fetchUsers = async () => {
    setRenderLoading(true);
    try {
      const response = await dispatch(currentUser()).unwrap();
      setUser(response.data);
    } catch (error: any) {
      setRenderLoading(false);
      setRefreshing(false);
      setError(error.message);
    } finally {
      setRefreshing(false);
      setRenderLoading(false);
    }
  };

  const fetchStudent = async () => {
    setRenderLoading(true);
    try {
      const response = await dispatch(
        getStudentById({ id: String(user?.studentId) })
      ).unwrap();
      setStudent(response);
    } catch (error: any) {
      setRenderLoading(false);
      setRefreshing(false);
      setError(error.message);
    } finally {
      setRefreshing(false);
      setRenderLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (user?.id) {
        await dispatch(logout())
          .unwrap()
          .then(() => {
            dispatch(
              createActivity({
                id: user.id,
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
                description: "You have logged out from your account",
                color: "#de5757",
                icon: "arrow-undo-outline",
              })
            ).unwrap();
            handleModal();
            setModalLoadingVisible(true);
            setTimeout(() => {
              router.replace("/(main)");
            }, 2000);
          })
          .catch((err) => {
            setModalLoadingVisible(false);
            setError(err.message);
          });
      }
    } catch (error) {
      setError("Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const renderItem = ({ item }: { item: MenuItemProps }) => (
    <Pressable
      disabled={isLoading}
      className="flex-row justify-between items-center py-3 my-1"
      onPress={() => {
        router.push({
          pathname: item.route as any,
          params: {
            schoolId: user?.schoolId,
            userId: user?.id,
            role: user?.role,
          },
        });
      }}
    >
      <Text style={{ fontFamily: "Kanit", color: colors.text }}>
        {item.id === "logout" && isLoading ? "loading" : item.label}
      </Text>
      {item.id === "logout" && isLoading ? (
        <ActivityIndicator size="small" color="#0D9485" />
      ) : (
        <Ionicons name={item.icon as any} color={colors.text} size={20} />
      )}
    </Pressable>
  );

  const backgroundColor = dark ? "#041f1b" : "#c5e0dd";
  const tintColor = dark ? "#0D9485" : "#0D9485";
  const gender = "female";

  return (
    <View className="flex-1 pt-16 px-6">
      {error && (
        <AnimatedAlertNotification
          text={error}
          background="bg-custom-error-1"
          icon="alert-circle-sharp"
          textStyle="#E60000"
        />
      )}
      {renderLoading ? (
        <Loading />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <View className={`flex-1 mb-5`}>
                <Text
                  className="text-center text-lg mb-5"
                  style={{ fontFamily: "Kanit", color: colors.text }}
                >
                  Profile
                </Text>

                <View className="bg-custom-green-opacity-1 w-36 rounded-full self-center items-center h-36 justify-center">
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#0D9485" />
                  ) : (
                    <Text
                      className="text-4xl text-custom-green-2 uppercase text-center h-7"
                      style={{ fontFamily: "Kanit" }}
                    >
                      {user?.username!.charAt(0)}
                    </Text>
                  )}
                </View>

                <View className="flex-row items-center flex-1 justify-center mt-5">
                  <View className="">
                    <View className="flex-row gap-2">
                      <Text
                        className="capitalize text-center"
                        style={{ fontFamily: "Kanit", color: colors.text }}
                      >
                        {user?.name}
                      </Text>
                      <View className="items-center bg-custom-green-opacity-1 px-2 justify-center rounded-lg">
                        <Text
                          className="text-xs lowercase opacity-50"
                          style={{ fontFamily: "Kanit", color: colors.text }}
                        >
                          {user?.role}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="text-xs lowercase text-center opacity-50"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      {user?.email}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: "/(screens)/profile" })
                    }
                    className="w-8 h-8 bg-custom-green-1 items-center justify-center rounded-full border-2 absolute bottom-12"
                    style={{ borderColor: colors.background }}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={13}
                      color={colors.background}
                    />
                  </Pressable>
                </View>
              </View>

              <View className="justify-center items-center gap-3 p-3 rounded-xl w-[80%] self-center mb-3">
                <Text
                  style={{ fontFamily: "Kanit", color: colors.text }}
                  className="capitalize"
                >
                  {student?.name}
                </Text>
                <View className="flex-row items-center justify-center gap-5">
                  <View
                    className={`gap-1 items-center ${
                      dark ? "bg-custom-green-dark" : "bg-custom-green-light"
                    } p-3 w-20 rounded-xl`}
                  >
                    <Ionicons
                      name={`${
                        gender === "female" ? "female-outline" : "male-outline"
                      }`}
                      size={15}
                      color={"#0D9485"}
                    />
                    <Text
                      className="capitalize"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      {gender}
                    </Text>
                  </View>
                  <View
                    className={`gap-1 items-center ${
                      dark ? "bg-custom-green-dark" : "bg-custom-green-light"
                    } p-3 w-20 rounded-xl`}
                  >
                    <Ionicons
                      name="clipboard-outline"
                      size={15}
                      color={"#0D9485"}
                    />
                    <Text
                      className="uppercase"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      {student?.classroom}
                    </Text>
                  </View>
                  <View
                    className={`gap-1 items-center ${
                      dark ? "bg-custom-green-dark" : "bg-custom-green-light"
                    } p-3 w-20 rounded-xl`}
                  >
                    <Ionicons
                      name="alarm-outline"
                      size={15}
                      color={"#0D9485"}
                    />
                    <Text
                      className="capitalize"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      present
                    </Text>
                  </View>
                </View>
              </View>

              <View className="">
                {AccountMenu &&
                  AccountMenu.map((account) => (
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: account.route as any,
                          params: {
                            schoolId: user?.schoolId,
                            userId: user?.id,
                            role: user?.role,
                            user: JSON.stringify(user),
                          },
                        })
                      }
                      className="flex-row justify-between items-center py-3 my-1"
                      key={account.id}
                    >
                      <Text
                        style={{ fontFamily: "Kanit", color: colors.text }}
                        className="flex-1"
                      >
                        {account.label}
                      </Text>
                      <Ionicons
                        name={account.icon as any}
                        color={colors.text}
                        size={20}
                      />
                      <Ionicons />
                    </Pressable>
                  ))}
              </View>
            </>
          }
          data={MenuItem}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <View>
              <Text
                className="py-5 text-xs font-bold text-custom-green-opacity-1"
                style={{ fontFamily: "Kanit" }}
              >
                App Version 1.0.1
              </Text>

              <Pressable
                onPress={() => handleModal()}
                className="p-5 rounded-lg items-center justify-center bg-custom-green-2"
              >
                <Text style={{ fontFamily: "Kanit", color: colors.text }}>
                  Log Out
                </Text>
              </Pressable>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#0D9485"]}
              tintColor={tintColor}
              progressBackgroundColor={backgroundColor}
            />
          }
        />
      )}

      <SlideModal
        modalVisible={modalVisible}
        isLoggedOut={true}
        handleModal={handleModal}
        onLoggedOut={handleLogout}
        isLoading={isLoading}
      />
      <LoadingModal modalVisible={modalLoadingVisible} />
    </View>
  );
};
