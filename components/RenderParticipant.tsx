import { View } from "react-native";
import Button from "./Button";
import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Student, Teacher } from "@/types/types";

interface ItemProps {
  student?: Student;
  teacher?: Teacher;
  onPress: () => void;
}

const RenderParticipant: React.FC<ItemProps> = ({
  student,
  teacher,
  onPress,
}) => {
  const { colors, dark } = useTheme();
  return (
    <Button
      handle={onPress}
      style={`border border-custom-green-opacity-1 rounded-2xl p-3 w-full flex-row gap-4 relative mb-3`}
    >
      <View className="bg-custom-green-opacity-1 w-14 rounded-2xl items-center h-14 justify-center">
        <Text
          className="text-xl text-custom-green-2 uppercase"
          style={{ fontFamily: "Kanit" }}
        >
          {student?.name.charAt(0) || teacher?.name.charAt(0)}
        </Text>
      </View>

      <View className="flex-row items-center flex-1">
        <View>
          <Text
            className="capitalize"
            style={{ fontFamily: "Kanit", color: colors.text }}
          >
            {student?.name || teacher?.name}
          </Text>
          <Text
            className="text-xs lowercase"
            style={{ fontFamily: "Kanit", color: colors.text }}
          >
            {student?.classroom || teacher?.address}
          </Text>
        </View>
      </View>
      <View className="absolute" style={{ bottom: 5, right: 10 }}>
        <Text
          className={` ${
            dark ? "text-custom-green-dark" : "text-custom-green-light"
          } `}
          style={{ fontFamily: "Kanit" }}
        >
          {student?.parentName || teacher?.nip || "not set"}
        </Text>
      </View>
    </Button>
  );
};

export default RenderParticipant;
