import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, RefreshControl } from "react-native";
import { useTheme } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  deleteNews,
  getNewsByCategory,
  listNewsBySchool,
} from "@/redux/slicer/newsSlice";
import { router, useLocalSearchParams } from "expo-router";
import Card from "@/components/Card";
import AnimatedAlertNotification from "@/components/AlertNotification";
import Loading from "@/components/Loading";
import RenderEmpty from "@/components/RenderEmpty";
import BackButton from "@/components/BackButton";
import { News } from "@/types/types";
import { uri } from "@/utils/uri";

const FilterMenu = [
  { id: "all", label: "All", selected: "all" },
  { id: "events", label: "Events", selected: "event" },
  { id: "sports", label: "Sports", selected: "sport" },
  { id: "education", label: "Education", selected: "education" },
  { id: "fun", label: "Fun", selected: "fun" },
];

export const NewsScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { colors, dark } = useTheme();
  const { schoolId, user } = useLocalSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        listNewsBySchool({
          id: Number(schoolId),
        })
      ).unwrap();
      setNews(response.data);
      setRefreshing(false);
    } catch (error) {
      setError("Failed to load news");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNews = async () => {
    setIsLoading(true);
    try {
      if (selectedFilter === "all") {
        await fetchNews();
      } else {
        const response = await dispatch(
          getNewsByCategory({ category: selectedFilter })
        ).unwrap();
        setNews(response.data);
      }
      setRefreshing(false);
    } catch (error) {
      setError("Failed to load news");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filteredNews();
  }, [selectedFilter]);

  const handleDelete = async (id: number) => {
    setError("");
    setSuccess("");
    try {
      await dispatch(deleteNews({ id })).unwrap();
      fetchNews();
      setSuccess("Successfully deleted");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    filteredNews();
  };

  const handleFilter = (selected: string) => {
    setSelectedFilter(selected);
  };

  const backgroundColor = dark ? "#041f1b" : "#c5e0dd";
  const tintColor = dark ? "#0D9485" : "#0D9485";

  return (
    <View className="py-16 px-6 flex-1">
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
      <View className="flex-row items-center gap-5">
        <BackButton />
        <Text style={{ fontFamily: "Kanit", color: colors.text }}>
          NewsScreen
        </Text>
      </View>
      <View className={`pt-5 pb-1 px-1 rounded-xl`}>
        <FlatList
          data={FilterMenu}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex gap-3 px-1">
              <Pressable
                onPress={() => handleFilter(item.selected)}
                className={`${
                  selectedFilter === item.selected
                    ? "bg-custom-green-2"
                    : dark
                    ? "bg-custom-green-dark"
                    : "bg-custom-green-light"
                } rounded-lg p-1 px-7 transition-all ease-in-out duration-300`}
              >
                <Text
                  className="text-center"
                  style={{ fontFamily: "Kanit", color: colors.text }}
                >
                  {item.label}
                </Text>
              </Pressable>
            </View>
          )}
        />
      </View>
      {isLoading && !refreshing ? (
        <Loading />
      ) : (
        <Animated.View
          entering={FadeInDown.duration(300).delay(100).springify()}
          className="pt-5 items-center justify-center"
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            data={news}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <Card
                onDelete={() => handleDelete(item.id ?? 0)}
                width={0.85}
                isUpdated={true}
                category={item.category}
                imageHeight="h-52"
                id={item.id ?? 0}
                image={`${uri}${item.image}` as any}
                title={item.title || ""}
                description={item.description || ""}
                created={item?.createdAt || ""}
                isAdmin={
                  parsedUser.role === "admin" ||
                  parsedUser.role === "superadmin"
                    ? true
                    : false
                }
                onPress={() =>
                  router.push({
                    pathname: "/(news)/[id]",
                    params: {
                      id: item.id?.toString() || "",
                      item: JSON.stringify(item),
                    },
                  })
                }
                index={index}
                totalItems={news.length}
              />
            )}
            ListEmptyComponent={
              <RenderEmpty
                descriptions={`no news available for ${selectedFilter}`}
                icon="newspaper-outline"
              />
            }
            contentContainerClassName="gap-4"
            contentContainerStyle={{ flex: 1 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
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
        </Animated.View>
      )}
    </View>
  );
};
