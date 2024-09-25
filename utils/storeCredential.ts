import * as SecureStore from "expo-secure-store";
export const storeAdminCredentials = async (
  username: string,
  password: string,
  schoolId: string
) => {
  await SecureStore.setItemAsync("adminUsername", username);
  await SecureStore.setItemAsync("adminPassword", password);
  await SecureStore.setItemAsync("adminSchoolId", schoolId);
};

export const storeParentCredentials = async (
  username: string,
  password: string,
  schoolId: string,
  studentId: string
) => {
  await SecureStore.setItemAsync("parentUsername", username);
  await SecureStore.setItemAsync("parentPassword", password);
  await SecureStore.setItemAsync("parentSchoolId", schoolId);
  await SecureStore.setItemAsync("parentStudentId", studentId);
};
