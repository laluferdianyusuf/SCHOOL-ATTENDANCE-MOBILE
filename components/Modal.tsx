import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import Modal from "react-native-modal";

interface ModalProps {
  isModalVisible: boolean;
  months: string[];
  onBackDrop: () => void;
  onPress: (month: string) => void;
}
export default function Modals({
  isModalVisible,
  onBackDrop,
  onPress,
  months,
}: ModalProps) {
  const { colors, dark } = useTheme();
  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={onBackDrop}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View
          className={`w-[80%] ${
            dark ? "bg-custom-green-dark" : "bg-custom-green-light"
          } p-6 rounded-2xl`}
        >
          {months.map((month) => (
            <Pressable
              key={month}
              onPress={() => onPress(month)}
              className={`py-3 flex-row justify-between items-center`}
            >
              <Text
                className=""
                style={{ fontFamily: "Kanit", color: colors.text }}
              >
                {month}
              </Text>
              <Text style={{ fontFamily: "Kanit", color: colors.text }}>
                {month.charAt(0)}
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}
