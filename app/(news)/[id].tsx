import React from "react";
import { NewsDetailScreen } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function NewsDetail({}) {
  const { id, item } = useLocalSearchParams();
  const newsItem = item && typeof item === "string" ? JSON.parse(item) : null;
  return <NewsDetailScreen item={newsItem} />;
}
