import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import SlideModal from "./SlideModal";
import { Student, Teacher } from "@/types/types";

interface FilterProps<P> {
  onFilter: (filter: P | null) => void;
  icon?: string;
  isLoading?: boolean;
}

export default function Filter<P extends Student | Teacher>({
  onFilter,
  icon,
  isLoading,
}: FilterProps<P>) {
  const { colors, dark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = () => setModalVisible(!modalVisible);

  const applyFilter = (filter: P | null) => {
    onFilter(filter);
    handleModal();
  };

  return (
    <>
      <View>
        <Pressable
          onPress={handleModal}
          className={`flex-row items-center rounded-2xl p-4 mt-4 mb-2 ${
            dark ? "bg-custom-green-dark" : "bg-custom-green-light"
          }`}
        >
          <Ionicons
            name="filter-outline"
            size={20}
            color={colors.text}
            style={{ opacity: 0.6 }}
          />
        </Pressable>
      </View>
      <SlideModal
        modalVisible={modalVisible}
        handleModal={handleModal}
        applyFilter={applyFilter}
        icon={icon}
        isLoading={isLoading}
      />
    </>
  );
}
