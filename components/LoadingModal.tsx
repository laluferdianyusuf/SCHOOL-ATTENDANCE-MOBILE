import React, { useEffect } from "react";
import { View, Modal } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
} from "react-native-reanimated";

interface LoadingModalProps {
  modalVisible: boolean;
}

export default function LoadingModal({ modalVisible }: LoadingModalProps) {
  const translateY1 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const translateY3 = useSharedValue(0);
  const translateY4 = useSharedValue(0);

  useEffect(() => {
    translateY1.value = withRepeat(
      withTiming(-10, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    translateY2.value = withDelay(
      100,
      withRepeat(
        withTiming(-10, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
    translateY3.value = withDelay(
      200,
      withRepeat(
        withTiming(-10, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
    translateY4.value = withDelay(
      300,
      withRepeat(
        withTiming(-10, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY1.value }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY2.value }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY3.value }],
  }));
  const dot4Style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY4.value }],
  }));

  return (
    <Modal transparent visible={modalVisible} animationType="fade">
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="flex-row justify-center items-center">
          <Animated.View
            className={`w-4 h-4 rounded-full bg-custom-green-1 mx-2`}
            style={[dot1Style]}
          />
          <Animated.View
            className={`w-4 h-4 rounded-full bg-custom-green-1 mx-2`}
            style={[dot2Style]}
          />
          <Animated.View
            className={`w-4 h-4 rounded-full bg-custom-green-1 mx-2`}
            style={[dot3Style]}
          />
          <Animated.View
            className={`w-4 h-4 rounded-full bg-custom-green-1 mx-2`}
            style={[dot4Style]}
          />
        </View>
      </View>
    </Modal>
  );
}
