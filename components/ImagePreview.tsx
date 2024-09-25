import { View, Text, Image } from "react-native";
import React from "react";
interface ImagePreviewProps {
  src?: string;
  style: string;
}

export default function ImagePreview({ src, style }: ImagePreviewProps) {
  return (
    <View>{src && <Image source={{ uri: src }} className={`${style}`} />}</View>
  );
}
