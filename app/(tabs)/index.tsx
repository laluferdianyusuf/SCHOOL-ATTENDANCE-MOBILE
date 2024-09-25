import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { HelloWave } from "@/components/HelloWave";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Search from "@/components/Search";
import Card from "@/components/Card";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import ButtonAddNews from "@/components/ButtonAddNews";
import { ThemedView } from "@/components/ThemedView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { currentUser } from "@/redux/slicer/adminSlice";
import { listNewsBySchool } from "@/redux/slicer/newsSlice";
import Button from "@/components/Button";
import CategoryItem from "@/components/CategoryItem";
import Badge from "@/components/Badge";
import { getNotificationBySchoolId } from "@/redux/slicer/notificationSlice";
import LoadingModal from "@/components/LoadingModal";
import { Category, News } from "@/types/types";
import { uri } from "@/utils/uri";

const category: Category[] = [
  {
    id: "teacher",
    name: "Teacher",
    icon: "people-outline",
    desc: "More about teacher",
    primary: "bg-custom-info-1",
    color: "bg-custom-info-2",
    uri: "/(category)/teacher",
  },
  {
    id: "student",
    name: "Student",
    icon: "school-outline",
    desc: "More about student",
    primary: "bg-custom-warning-1",
    color: "bg-custom-warning-2",
    uri: "/(category)/student",
  },
  {
    id: "attendance",
    name: "Attendances",
    icon: "finger-print-outline",
    desc: "More about attendance",
    primary: "bg-custom-success-1",
    color: "bg-custom-success-2",
    uri: "/(category)/attendance",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "calendar-outline",
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-indigo-2",
    uri: "/(category)/calendar",
  },
];

export default function HomeScreen() {
  const dispatch: AppDispatch = useDispatch();
  const { colors } = useTheme();
  const { admin } = useSelector((state: RootState) => state.auth);
  const [news, setNews] = useState<News[]>([]);
  const { notifications, loading: notificationsLoading } = useSelector(
    (state: RootState) => state.notification
  );

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(currentUser()).unwrap();
        if (admin?.schoolId) {
          const response = await dispatch(
            listNewsBySchool({ id: Number(admin.schoolId) })
          ).unwrap();
          setNews(response.data);
        }
        await dispatch(
          getNotificationBySchoolId({
            schoolId: admin?.schoolId,
            userId: Number(admin?.id),
          })
        ).unwrap();
        setIsDataLoaded(true);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [dispatch, admin?.schoolId, admin?.id]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchNotifications = async () => {
        if (admin?.schoolId && admin?.id) {
          try {
            await dispatch(
              getNotificationBySchoolId({
                schoolId: admin.schoolId,
                userId: Number(admin.id),
              })
            ).unwrap();
          } catch (error: any) {
            console.log(error.message);
          }
        }
      };

      fetchNotifications();
    }, [dispatch, admin?.schoolId, admin?.id])
  );

  const newsData = Array.isArray(news) && news ? news : [];

  const handleCategoryPress = (id: string) => {
    const selectedCategory = category.find((cat) => cat.id === id);
    if (selectedCategory) {
      router.push({
        pathname: selectedCategory.uri,
        params: {
          id: selectedCategory.id,
          userSchoolId: admin?.schoolId,
          userStudentId: admin?.studentId,
          user: JSON.stringify(admin),
        },
      });
    }
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((notification) => !notification.isOpened).length
    : 0;

  if (!isDataLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <LoadingModal modalVisible={!isDataLoaded} />
      </View>
    );
  }

  return (
    <ThemedView className={`flex-1`}>
      <View
        className="pt-16 pb-6 px-6 mb-5"
        style={{ backgroundColor: "#0d9485" }}
      >
        <Animated.View className={`flex-row justify-between items-center`}>
          <View>
            <View className={`flex-row items-end gap-2`}>
              <Text
                className="text-xl"
                style={{ fontFamily: "Kanit", color: colors.text }}
              >
                Welcome Back
              </Text>
              <View>
                <HelloWave />
              </View>
            </View>
            <Text
              className="text-2xl font-bold capitalize"
              style={{ color: colors.text, fontFamily: "Kanit" }}
            >
              {admin?.name}
            </Text>
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tops)",
                  params: { schoolId: admin?.schoolId, userId: admin?.id },
                })
              }
            >
              <View style={{ position: "relative" }}>
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color={colors.text}
                />
                <Badge count={unreadCount} />
              </View>
            </Pressable>
          </View>
        </Animated.View>
        <Search />
      </View>
      <FlatList
        ListFooterComponent={
          <View className="">
            <View className="px-2 flex-col gap-5 mt-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-bold" style={{ color: colors.text }}>
                  News Sections
                </Text>
                <Button
                  handle={() =>
                    router.push({
                      pathname: "/(news)/all",
                      params: {
                        schoolId: admin?.schoolId,
                        user: JSON.stringify(admin),
                      },
                    })
                  }
                >
                  <Text
                    className="text-custom-green-1"
                    style={{ fontFamily: "Kanit", color: "#0d9485" }}
                  >
                    See More
                  </Text>
                </Button>
              </View>
              <Animated.View
                entering={FadeInDown.duration(600).delay(300).springify()}
              >
                <FlatList
                  data={newsData.slice(0, 3)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Card
                      imageHeight="h-72"
                      id={item.id ?? 0}
                      category={item.category}
                      image={`${uri}${item.image}` as any}
                      title={item.title || ""}
                      description={item.description || ""}
                      created={item?.createdAt || ""}
                      onPress={() =>
                        router.push({
                          pathname: "/(news)/[id]",
                          params: {
                            id: item.id?.toString() || "",
                            item: JSON.stringify(item),
                          },
                        })
                      }
                    />
                  )}
                  contentContainerClassName="gap-1"
                  ListFooterComponent={() => (
                    <>
                      {admin?.role == "admin" ||
                        (admin?.role == "superadmin" && (
                          <ButtonAddNews>
                            <Text
                              className="font-bold"
                              style={{
                                fontFamily: "Kanit",
                                color: colors.text,
                              }}
                            >
                              Add News
                            </Text>
                          </ButtonAddNews>
                        ))}
                    </>
                  )}
                />
              </Animated.View>
            </View>
          </View>
        }
        data={category}
        renderItem={({ item }) => (
          <CategoryItem item={item} onPress={handleCategoryPress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 20,
        }}
        contentContainerClassName="gap-4"
      />
    </ThemedView>
  );
}
