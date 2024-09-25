import React from "react";
import {
  Text,
  Modal,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import { Student, Teacher } from "@/types/types";

interface SlideModalProps<P> {
  modalVisible: boolean;
  handleModal: () => void;
  applyFilter?: (filter: P | null) => void;
  isLoggedOut?: boolean;
  onLoggedOut?: () => void;
  isLoading?: boolean;
  icon?: string;
  isNotification?: boolean;
  onNotificationOpen?: () => void;
  onNotificationClose?: () => void;
  isActivity?: boolean;
  onActivity?: () => void;
}

export default function SlideModal<P extends Teacher | Student>({
  modalVisible,
  handleModal,
  applyFilter,
  isLoggedOut,
  onLoggedOut,
  isLoading,
  icon,
  isNotification = false,
  onNotificationOpen,
  onNotificationClose,
  isActivity = false,
  onActivity,
}: SlideModalProps<P>) {
  const { colors, dark } = useTheme();

  const handleFilterSelection = (filter: P | null) => {
    if (applyFilter) {
      applyFilter(filter);
    }
  };

  const handleClearFilter = () => {
    if (applyFilter) {
      applyFilter(null);
    }
  };

  const handleNotifications = (action: "open" | "close") => {
    if (action === "open" && onNotificationOpen) {
      onNotificationOpen();
    } else if (action === "close" && onNotificationClose) {
      onNotificationClose();
    }
    handleModal();
  };

  const handleClose = () => {
    handleModal();
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          className="flex-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              className={`rounded-t-3xl absolute right-0 left-0 bottom-0 ${
                dark ? "bg-custom-green-dark" : "bg-custom-green-light"
              } p-4`}
              entering={SlideInDown.duration(300).delay(100)}
              exiting={SlideOutDown.duration(300).delay(100)}
            >
              <Button style="mb-3 w-9 items-center" handle={handleClose}>
                <Ionicons name="close" color={colors.text} size={30} />
              </Button>
              <View>
                {icon && (
                  <View className="items-center">
                    <Ionicons
                      name={icon as any}
                      size={150}
                      color={colors.text}
                    />
                  </View>
                )}
                {!isLoggedOut && !isNotification && !isActivity ? (
                  <View>
                    <Text
                      className="font-bold capitalize text-center"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      classroom
                    </Text>
                    <Button
                      style="flex-row items-center justify-between py-2"
                      handle={() =>
                        handleFilterSelection({ classroom: "VII" } as P)
                      }
                    >
                      <Text
                        style={{ fontFamily: "Kanit", color: colors.text }}
                        className={``}
                      >
                        based on VII
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={20}
                        color={colors.text}
                      />
                    </Button>
                    <Button
                      style="flex-row items-center justify-between py-2"
                      handle={() =>
                        handleFilterSelection({ classroom: "VIII" } as P)
                      }
                    >
                      <Text
                        style={{ fontFamily: "Kanit", color: colors.text }}
                        className={``}
                      >
                        based on VIII
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={20}
                        color={colors.text}
                      />
                    </Button>
                    <Button
                      style="flex-row items-center justify-between py-2"
                      handle={() =>
                        handleFilterSelection({ classroom: "IX" } as P)
                      }
                    >
                      <Text
                        style={{ fontFamily: "Kanit", color: colors.text }}
                        className={``}
                      >
                        based on IX
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={20}
                        color={colors.text}
                      />
                    </Button>
                    <Text
                      className="font-bold capitalize text-center"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      gender
                    </Text>
                    <Button
                      style="flex-row items-center justify-between py-2"
                      handle={() =>
                        handleFilterSelection({ gender: "male" } as P)
                      }
                    >
                      <Text
                        style={{ fontFamily: "Kanit", color: colors.text }}
                        className={``}
                      >
                        based on Male
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={20}
                        color={colors.text}
                      />
                    </Button>
                    <Button
                      style="flex-row items-center justify-between py-2"
                      handle={() =>
                        handleFilterSelection({ gender: "female" } as P)
                      }
                    >
                      <Text
                        style={{ fontFamily: "Kanit", color: colors.text }}
                        className={``}
                      >
                        based on Female
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={20}
                        color={colors.text}
                      />
                    </Button>
                    <Button
                      style="flex-row items-center justify-between py-2"
                      handle={() => handleClearFilter()}
                    >
                      <Text
                        style={{ fontFamily: "Kanit", color: colors.text }}
                        className={`capitalize`}
                      >
                        all
                      </Text>
                      <Ionicons
                        name="filter-outline"
                        size={20}
                        color={colors.text}
                      />
                    </Button>
                  </View>
                ) : !isNotification && !isActivity ? (
                  <View className="">
                    <Text
                      className="text-center mb-5"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      Logged Out
                    </Text>
                    <Button
                      handle={onLoggedOut!}
                      style="p-6 border border-y-gray-50 border-x-0 flex-row gap-4 items-center justify-between"
                    >
                      <View className="flex-row gap-4 items-center">
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#0D9485" />
                        ) : (
                          <Ionicons
                            name="log-out-outline"
                            size={20}
                            color={"#0D9485"}
                          />
                        )}

                        <Text
                          style={{ fontFamily: "Kanit", color: colors.text }}
                        >
                          {isLoading ? "Loading..." : "Log Out"}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={"#0D9485"}
                      />
                    </Button>
                  </View>
                ) : !isActivity ? (
                  <View className="">
                    <Text
                      className="text-center mb-5"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      Setting
                    </Text>
                    <View className="flex-row justify-center">
                      <Button
                        handle={() => handleNotifications("open")}
                        style="p-6 border border-y-gray-50 border-x-0 flex-row gap-4 items-center"
                      >
                        <Ionicons
                          name="eye-outline"
                          size={20}
                          color={"#14B8A6"}
                        />
                        <Text
                          style={{ fontFamily: "Kanit", color: colors.text }}
                        >
                          Mark all as read
                        </Text>
                      </Button>
                      <Button
                        handle={() => handleNotifications("close")}
                        style="p-6 border border-y-gray-50 border-x-0 flex-row gap-4 items-center"
                      >
                        <Ionicons
                          name="eye-off-outline"
                          size={20}
                          color={"#14B8A6"}
                        />
                        <Text
                          style={{ fontFamily: "Kanit", color: colors.text }}
                        >
                          Mark all as unread
                        </Text>
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View className="">
                    <Text
                      className="text-center mb-5"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      Delete History
                    </Text>
                    <Button
                      handle={onActivity!}
                      style="p-6 border border-y-gray-50 border-x-0 flex-row gap-4 items-center justify-between"
                    >
                      <View className="flex-row gap-4 items-center">
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#0D9485" />
                        ) : (
                          <Ionicons
                            name="trash-bin-outline"
                            size={20}
                            color={"#0D9485"}
                          />
                        )}

                        <Text
                          style={{ fontFamily: "Kanit", color: colors.text }}
                        >
                          {isLoading ? "Loading..." : "Delete"}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={"#0D9485"}
                      />
                    </Button>
                  </View>
                )}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
