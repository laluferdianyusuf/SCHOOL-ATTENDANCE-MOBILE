import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from "react-native";
import * as Device from "expo-device";
import { useTheme } from "@react-navigation/native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import InputList from "@/components/InputList";
import { listSchool } from "@/redux/slicer/schoolSlice";
import { getStudentsBySchoolId } from "@/redux/slicer/studentSlice";
import { adminLogin, parentLogin } from "@/redux/slicer/adminSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Admin, School, Student } from "@/types/types";
import AnimatedAlertNotification from "@/components/AlertNotification";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import registerForPushNotificationsAsync from "@/utils/registerPushNotification";
import {
  handleBiometricAuth,
  storeAdminCredentials,
  storeParentCredentials,
} from "@/utils";
import LoadingModal from "@/components/LoadingModal";

interface LoginFormProps {
  label: string;
  isAdmin?: boolean;
}

export const LoginFormScreen: React.FC<LoginFormProps> = ({
  label,
  isAdmin = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { colors } = useTheme();
  // const { isAdmin } = useLocalSearchParams();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<
    string | number | null
  >(null);
  const [selectedStudent, setSelectedStudent] = useState<
    string | number | null
  >(null);
  const [studentData, setStudentData] = useState<
    { key: string; value: string }[]
  >([]);
  const [error, setError] = useState<string>("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const schoolData = useSelector((state: RootState) => state.school);
  const [students, setStudents] = useState<Student[]>([]);
  const arraySchool =
    (Array.isArray(schoolData.schools) && schoolData.schools) || [];
  const dataSchools = arraySchool.map((school: School) => ({
    key: school.id.toString(),
    value: school.name,
  }));
  const [isBiometricSupport, setIsBioMetricSupport] = useState<boolean>(false);
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false);

  useEffect(() => {
    const checkLoginFlag = async () => {
      const flag = isAdmin
        ? await SecureStore.getItemAsync("hasLoggedInAdmin")
        : await SecureStore.getItemAsync("hasLoggedIn");
      setHasLoggedIn(flag === "true");
    };

    checkLoginFlag();
  }, [isAdmin]);

  const navigateTo = (path: string, params?: any) => {
    router.push({
      pathname: path as any,
      params: { user: JSON.stringify(params) },
    });
  };

  const handleSchoolSelect = useCallback(
    async (val: string) => {
      setSelectedSchoolId(val);
      const response = await dispatch(
        getStudentsBySchoolId({ id: parseInt(val) })
      ).unwrap();
      setStudents(response.data);
    },
    [dispatch]
  );

  const handleStudentSelect = useCallback((val: string) => {
    setSelectedStudent(val);
  }, []);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBioMetricSupport(compatible);
    })();
  }, []);

  const handleBiometricLogin = async () => {
    if (hasLoggedIn) {
      setModalLoadingVisible(true);
      await handleBiometricAuth({
        isAdmin: isAdmin,
        dispatch,
        navigateTo,
        setError,
        expoPushToken,
        setModalLoadingVisible,
        modalLoadingVisible,
      });
    } else {
      ToastAndroid.show("Please log in manually first", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );
  }, []);

  useEffect(() => {
    dispatch(listSchool());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSchoolId) {
      setStudentData(
        students.map((student: Student) => ({
          key: student.id?.toString() || "",
          value: student.name,
        }))
      );
    }
  }, [selectedSchoolId, students]);

  const storeLoginFlag = async () => {
    if (isAdmin) {
      await SecureStore.setItemAsync("hasLoggedInAdmin", "true");
    } else {
      await SecureStore.setItemAsync("hasLoggedIn", "true");
    }
  };

  const handleLogin = () => {
    setError("");
    setModalLoadingVisible(true);
    try {
      if (!isAdmin) {
        dispatch(
          parentLogin({
            username,
            password,
            schoolId: selectedSchoolId ?? 0,
            studentId: selectedStudent ?? 0,
            expoToken: expoPushToken,
            device: `${Device.manufacturer} ${Device.modelName}`,
            hardware: `${
              Device.deviceType === 0
                ? "Unknown"
                : Device.deviceType === 1
                ? "Phone"
                : Device.deviceType === 2
                ? "Tablet"
                : Device.deviceType === 3
                ? "TV"
                : "DESKTOP"
            }`,
          })
        )
          .unwrap()
          .then(async (response) => {
            if (response.status) {
              await storeParentCredentials(
                username,
                password,
                String(selectedSchoolId),
                String(selectedStudent)
              );
              await storeLoginFlag();
              setUsername("");
              setPassword("");
              setSelectedSchoolId(null);
              setSelectedStudent(null);
              setModalLoadingVisible(true);
              navigateTo("/(tabs)", response.data);
              setModalLoadingVisible(false);
            } else {
              setModalLoadingVisible(false);
              setError(response.message);
            }
          })
          .catch((error) => {
            setModalLoadingVisible(false);
            setError(error.message);
          });
      } else {
        dispatch(
          adminLogin({
            username: username,
            password: password,
            schoolId: selectedSchoolId!,
            device: `${Device.manufacturer} ${Device.modelName}`,
            hardware: `${
              Device.deviceType === 0
                ? "Unknown"
                : Device.deviceType === 1
                ? "Phone"
                : Device.deviceType === 2
                ? "Tablet"
                : Device.deviceType === 3
                ? "TV"
                : "DESKTOP"
            }`,
          })
        )
          .unwrap()
          .then(async (response) => {
            if (response.status) {
              await storeAdminCredentials(
                username,
                password,
                String(selectedSchoolId)
              );
              await storeLoginFlag();
              setUsername("");
              setPassword("");
              setSelectedSchoolId(null);
              setModalLoadingVisible(true);
              navigateTo("/(tabs)", response.data);
              setModalLoadingVisible(false);
            } else {
              setModalLoadingVisible(false);
              setError(response.message);
            }
          })
          .catch((error) => {
            setModalLoadingVisible(false);
            setError(error.message);
          });
      }
    } catch (error: any) {
      setModalLoadingVisible(false);
      setError(error.message);
    }
  };

  const routeLogin = () => {
    if (isAdmin) {
      navigateTo("/(parent)/login");
    } else {
      navigateTo("/(admin)/login");
    }
  };

  const routeRegister = () => {
    if (isAdmin) {
      navigateTo("/(admin)/register");
    } else {
      navigateTo("/(parent)/register");
    }
  };

  return (
    <KeyboardAvoidingView className="pt-16 flex-1 px-8 bg mb-5">
      {error && (
        <AnimatedAlertNotification
          text={error}
          background="bg-custom-error-1"
          icon="alert-circle-sharp"
          textStyle="#E60000"
        />
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View className="flex-row gap-5 items-center mb-5">
            <Pressable
              disabled={modalLoadingVisible}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" color="rgb(13 148 133)" size={30} />
            </Pressable>
            <Text
              className="font-bold text-2xl"
              style={{ fontFamily: "Kanit", color: colors.text }}
            >
              Login
            </Text>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <View className="items-center justify-center gap-4 mb-8">
              <FontAwesome6 name="school" color="rgb(13 148 133)" size={100} />
              <Text
                className="font-bold"
                style={{ fontFamily: "Kanit", color: colors.text }}
              >
                {label}
              </Text>
            </View>
            <CustomInput
              title="Username"
              icon={"id-card-outline"}
              placeholder="username"
              onChange={(text) => setUsername(text)}
              value={username}
            />
            <CustomInput
              title="Password"
              icon={"lock-closed-outline"}
              placeholder="password"
              isPassword={true}
              onChange={(text) => setPassword(text)}
              value={password}
            />
            <InputList
              setSelected={handleSchoolSelect}
              data={dataSchools}
              isSearched={false}
              icon="business-outline"
              placeholder="Choose a school name"
              label="School name"
              noDataText="no school selected"
              value="key"
              selectedValue={selectedSchoolId}
            />
            {!isAdmin && selectedSchoolId && (
              <InputList
                isSearched={true}
                setSelected={handleStudentSelect}
                icon="school-outline"
                data={studentData}
                placeholder="Find your children"
                label="Children"
                noDataText="no student selected"
                value="key"
                selectedValue={selectedSchoolId}
              />
            )}
            <View className="flex-col gap-5">
              <View className="flex-row gap-3">
                <Button
                  disabled={modalLoadingVisible}
                  style={`flex-1 bg-custom-green-2 p-4 rounded-xl items-center justify-center`}
                  handle={handleLogin}
                >
                  <Text
                    style={{ fontFamily: "Kanit", color: colors.text }}
                    className="font-bold"
                  >
                    Login
                  </Text>
                </Button>
                {isBiometricSupport && hasLoggedIn ? (
                  <Button
                    disabled={modalLoadingVisible}
                    style={`bg-custom-green-2 p-4 rounded-xl items-center justify-center`}
                    handle={handleBiometricLogin}
                  >
                    <Ionicons
                      name="finger-print"
                      color={colors.text}
                      size={25}
                    />
                  </Button>
                ) : null}
              </View>
              <View className="flex-row gap-3 justify-center items-center mb-5 px-5">
                <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
                <Text
                  className="opacity-35 text-custom-green-2"
                  style={{ fontFamily: "Kanit" }}
                >
                  login
                </Text>
                <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
              </View>
              <View className="flex-row justify-between">
                <Button handle={routeLogin}>
                  <Text
                    style={{ fontFamily: "Kanit" }}
                    className="text-custom-green-2 font-bold"
                  >
                    {isAdmin ? "Login as parent" : "Login as teacher"}
                  </Text>
                </Button>
                <Button handle={routeRegister} disabled={isAdmin}>
                  <Text
                    style={{ fontFamily: "Kanit" }}
                    className={`text-custom-green-2 font-bold ${
                      isAdmin ? "opacity-35" : "opacity-100"
                    }`}
                  >
                    Don't have an account?
                  </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
      <LoadingModal modalVisible={modalLoadingVisible} />
    </KeyboardAvoidingView>
  );
};
