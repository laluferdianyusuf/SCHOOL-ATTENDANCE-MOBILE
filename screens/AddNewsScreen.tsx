import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import PickerImage from "@/components/PickerImage";
import ImagePreview from "@/components/ImagePreview";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import InputList from "@/components/InputList";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "@/redux/slicer/adminSlice";
import { createNews, listNewsBySchool } from "@/redux/slicer/newsSlice";
import AnimatedAlertNotification from "@/components/AlertNotification";
import LoadingModal from "@/components/LoadingModal";
import BackButton from "@/components/BackButton";

const Category = [
  { key: "1", value: "Sport" },
  { key: "2", value: "Education" },
  { key: "3", value: "Event" },
];

interface AddNewsScreenProps {
  isUpdate?: boolean;
}

export const AddNewsScreen: React.FC<AddNewsScreenProps> = ({
  isUpdate = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { admin } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { colors } = useTheme();
  const [image, setImage] = useState<string>();
  const [imageName, setImageName] = useState<string>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      const name = imageUri.split("/").pop();
      setImageName(name || "");
    }
  };

  const resetImage = () => {
    setImage("");
    setImageName("");
  };

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  const handleCategorySelect = useCallback((val: string) => {
    setCategory(val);
  }, []);

  const handleSave = () => {
    setError("");
    setSuccess("");
    setShowLoadingModal(true);
    const formData = {
      title: title,
      description: description,
      category: category,
      image: {
        uri: image,
        name: imageName,
        type: "image/jpeg",
      },
      id: admin?.schoolId ? Number(admin.schoolId) : undefined,
    };
    dispatch(createNews(formData))
      .unwrap()
      .then((response) => {
        dispatch(
          listNewsBySchool({
            id: admin?.schoolId ? Number(admin.schoolId) : undefined,
          })
        );
        setTitle("");
        setDescription("");
        setCategory("");
        setTitle("");
        setImage("");
        setImageName("");
        setShowLoadingModal(false);
      })
      .catch((err) => {
        setError(err.message);
        setShowLoadingModal(false);
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      {error && (
        <AnimatedAlertNotification
          text={error}
          background="bg-custom-error-1"
          icon="alert-circle-sharp"
          textStyle="#E60000"
        />
      )}
      {showLoadingModal && <LoadingModal modalVisible={showLoadingModal} />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="pt-16 px-6 flex-1">
          <View className="flex-row gap-5 mb-8">
            <BackButton />
            <View className="justify-center items-center">
              <Text
                className={`font-bold text-2xl`}
                style={{ color: colors.text }}
              >
                Update News
              </Text>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <CustomInput
              value={title}
              title="title"
              placeholder="title"
              icon="text"
              onChange={(text) => setTitle(text)}
            />
            <View className="flex-row gap-3 items-center">
              <View className="flex-1">
                <CustomInput
                  title="description"
                  placeholder="description"
                  icon="reader-outline"
                  value={description}
                  onChange={(text) => setDescription(text)}
                />
              </View>
              <View className="flex-1">
                <InputList
                  setSelected={handleCategorySelect}
                  data={Category}
                  isSearched={false}
                  icon="extension-puzzle-outline"
                  placeholder="category"
                  label="category"
                  noDataText="no category selected"
                  value="value"
                  selectedValue={category}
                  width={100}
                />
              </View>
            </View>
            <PickerImage
              pickImage={pickImage}
              buttonStyle="p-3 mt-2 border border-custom-green-2 rounded-2xl flex-row items-center gap-3 h-[3.6rem]"
              title="Choose image"
              imageName={imageName}
              resetImage={resetImage}
            />

            {image ? (
              <View className="border border-custom-green-2 rounded-xl p-3 border-dashed mb-5">
                <ImagePreview src={image} style="w-full h-80 rounded-xl" />
              </View>
            ) : (
              <View className="w-full h-80 border border-custom-green-2 rounded-xl p-3 items-center justify-center border-dashed mb-5">
                <Ionicons name="image-outline" size={100} color={colors.text} />
                <Text
                  style={{ fontFamily: "Kanit", color: colors.text }}
                  className="font-bold"
                >
                  No Image Chosen
                </Text>
              </View>
            )}

            <View className="">
              <Button
                style="bg-custom-green-2 pt-5 items-center p-4 rounded-2xl"
                handle={handleSave}
              >
                <Text
                  className="font-bold"
                  style={{ fontFamily: "Kanit", color: colors.text }}
                >
                  Save
                </Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
