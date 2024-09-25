import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";
import { adminLogin, parentLogin } from "@/redux/slicer/adminSlice";
import { AppDispatch } from "@/redux/store";
import * as Device from "expo-device";

interface BiometricAuthParams {
  isAdmin: boolean;
  dispatch: AppDispatch;
  navigateTo: (path: string, params?: any) => void;
  setError: (message: string) => void;
  setModalLoadingVisible: (status: boolean) => void;
  modalLoadingVisible: boolean;
  expoPushToken: string;
}

export const handleBiometricAuth = async ({
  isAdmin,
  dispatch,
  navigateTo,
  setError,
  expoPushToken,
  setModalLoadingVisible,
  modalLoadingVisible,
}: BiometricAuthParams) => {
  try {
    const saveBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!saveBiometrics) {
      return ToastAndroid.show("Biometric not found", ToastAndroid.SHORT);
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometric",
      fallbackLabel: "Use Password",
    });

    if (biometricAuth.success) {
      if (isAdmin) {
        const storedAdminUsername = await SecureStore.getItemAsync(
          "adminUsername"
        );
        const storedAdminPassword = await SecureStore.getItemAsync(
          "adminPassword"
        );
        const storedAdminSchoolId = await SecureStore.getItemAsync(
          "adminSchoolId"
        );

        if (storedAdminUsername && storedAdminPassword && storedAdminSchoolId) {
          const response = await dispatch(
            adminLogin({
              username: storedAdminUsername,
              password: storedAdminPassword,
              schoolId: parseInt(storedAdminSchoolId),
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
          ).unwrap();

          setModalLoadingVisible(true);
          setTimeout(() => {
            navigateTo("/(tabs)", response.data);
            setModalLoadingVisible(false);
          }, 2000);
        } else {
          setModalLoadingVisible(false);
          ToastAndroid.show(
            "No valid admin credentials found",
            ToastAndroid.SHORT
          );
        }
      } else {
        const storedParentUsername = await SecureStore.getItemAsync(
          "parentUsername"
        );
        const storedParentPassword = await SecureStore.getItemAsync(
          "parentPassword"
        );
        const storedParentSchoolId = await SecureStore.getItemAsync(
          "parentSchoolId"
        );
        const storedParentStudentId = await SecureStore.getItemAsync(
          "parentStudentId"
        );

        if (
          storedParentUsername &&
          storedParentPassword &&
          storedParentSchoolId &&
          storedParentStudentId
        ) {
          const response = await dispatch(
            parentLogin({
              username: storedParentUsername,
              password: storedParentPassword,
              schoolId: parseInt(storedParentSchoolId),
              studentId: storedParentStudentId
                ? parseInt(storedParentStudentId)
                : undefined,
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
          ).unwrap();

          setModalLoadingVisible(true);
          setTimeout(() => {
            navigateTo("/(tabs)", response.data);
            setModalLoadingVisible(false);
          }, 2000);
        } else {
          setModalLoadingVisible(false);
          ToastAndroid.show(
            "No valid parent credentials found",
            ToastAndroid.SHORT
          );
        }
      }
    } else {
      setModalLoadingVisible(false);
      ToastAndroid.show("Biometric Authentication Failed", ToastAndroid.SHORT);
    }
  } catch (error) {
    setModalLoadingVisible(false);
    console.error(error);
    ToastAndroid.show("An error occurred", ToastAndroid.SHORT);
  }
};
