import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { News } from "@/types/types";
import { formatDate, formatTime } from "@/utils/FormatTimeAtt";

interface NewsDetailProps {
  item: News;
}

export const NewsDetailScreen: React.FC<NewsDetailProps> = ({ item }) => {
  const { colors } = useTheme();
  const time = item.createdAt!.split("T")[1];
  const imeData = time.split(".")[0];
  return (
    <>
      <Pressable
        onPress={() => router.back()}
        className="absolute z-50 p-1 rounded-md"
        style={{ top: 50, left: 20, backgroundColor: colors.background }}
      >
        <Ionicons name="arrow-back-outline" color="rgb(13 148 133)" size={25} />
      </Pressable>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Image
            source={{
              uri: `http://192.168.1.3:2500${item?.image}`,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        }
      >
        <View className="">
          <View className="flex-row justify-between items-center">
            <Text
              className=" font-bold text-lg"
              style={{ fontFamily: "Kanit", color: colors.text }}
            >
              {item?.title}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                className="font-bold text-xs text-custom-green-2"
                style={{ fontFamily: "Kanit" }}
              >
                {formatDate(item.createdAt)}
              </Text>
              <Text
                className="font-bold text-xs text-custom-green-2"
                style={{ fontFamily: "Kanit" }}
              >
                {formatTime(imeData)}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3 justify-center items-center mb-2">
            <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
            <Text
              className="opacity-35 text-custom-green-2"
              style={{ fontFamily: "Kanit" }}
            >
              news
            </Text>
            <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
          </View>
          <Text
            className="text-justify"
            style={{ fontFamily: "Kanit", color: colors.text }}
          >
            {item?.description}
          </Text>
        </View>
      </ParallaxScrollView>
    </>
  );
};
