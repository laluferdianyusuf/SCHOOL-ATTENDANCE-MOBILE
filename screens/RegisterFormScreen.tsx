import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import InputList from "@/components/InputList";
import { listSchool } from "@/redux/slicer/schoolSlice";
import { getStudentsBySchoolId } from "@/redux/slicer/studentSlice";
import { adminRegister, parentRegister } from "@/redux/slicer/adminSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { School, Student } from "@/types/types";
import AnimatedAlertNotification from "@/components/AlertNotification";

interface RegisterFormProps {
  isAdmin: boolean;
  label: string;
}
export const RegisterFormScreen: React.FC<RegisterFormProps> = ({
  isAdmin = false,
  label,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { colors } = useTheme();
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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
  const [success, setSuccess] = useState<string>("");

  const navigateTo = (path: string) => {
    router.push(path as any);
  };
  const schoolData = useSelector((state: RootState) => state.school);
  const { students } = useSelector((state: RootState) => state.student);

  const arraySchool =
    (Array.isArray(schoolData.schools) && schoolData.schools) || [];
  const dataSchools = arraySchool.map((school: School) => ({
    key: school.id.toString(),
    value: school.name,
  }));

  const handleSchoolSelect = useCallback(
    (val: string) => {
      console.log("value: " + val);

      setSelectedSchoolId(val);
      dispatch(getStudentsBySchoolId({ id: parseInt(val) }));
    },
    [dispatch]
  );

  const handleStudentSelect = useCallback((val: string) => {
    setSelectedStudent(val);
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

  const handleRegister = () => {
    setError("");
    setSuccess("");
    if (!isAdmin) {
      dispatch(
        parentRegister({
          name: name,
          username: username,
          email: email,
          password: password,
          schoolId: selectedSchoolId!,
          studentId: selectedStudent!,
        })
      )
        .unwrap()
        .then((response) => {
          setName("");
          setUsername("");
          setEmail("");
          setPassword("");
          setSelectedSchoolId(null);
          setSelectedStudent(null);
          setSuccess("Registration successful");
          setTimeout(() => {
            navigateTo("/(parent)/login");
          }, 2000);
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      dispatch(
        adminRegister({
          name: name,
          username: username,
          email: email,
          password: password,
          schoolId: selectedSchoolId!,
        })
      )
        .unwrap()
        .then((response) => {
          setName("");
          setUsername("");
          setEmail("");
          setPassword("");
          setSelectedSchoolId(null);
          setSuccess("Registration successful");
          setTimeout(() => {
            navigateTo("/(admin)/login");
          }, 2000);
        })
        .catch((err) => {
          setError("Registration failed");
        });
    }
  };

  const routeRegister = () => {
    if (isAdmin) {
      navigateTo("/(parent)/register");
    } else {
      navigateTo("/(admin)/register");
    }
  };

  const routeLogin = () => {
    if (isAdmin) {
      navigateTo("/(admin)/login");
    } else {
      navigateTo("/(parent)/login");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      className="pt-16 flex-1 px-8 mb-5"
    >
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View className="flex-row gap-5 items-center mb-5">
            <Pressable onPress={() => router.back()} className="">
              <Ionicons name="arrow-back" color="rgb(13 148 133)" size={30} />
            </Pressable>
            <Text
              className="font-bold text-2xl"
              style={{ fontFamily: "Kanit", color: colors.text }}
            >
              Register
            </Text>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
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
              title="Name"
              icon={"text"}
              placeholder="name"
              onChange={(text) => setName(text)}
              value={name}
            />
            <CustomInput
              title="Username"
              icon={"id-card-outline"}
              placeholder="username"
              onChange={(text) => setUsername(text)}
              value={username}
            />
            <View className="flex-row gap-4 ">
              <CustomInput
                title="Email"
                icon={"at-outline"}
                placeholder="email"
                style="flex-1"
                keyboard="email-address"
                onChange={(text) => setEmail(text)}
                value={email}
              />
              <CustomInput
                title="Password"
                icon={"lock-closed-outline"}
                placeholder="password"
                isPassword={true}
                style="flex-1"
                onChange={(text) => setPassword(text)}
                value={password}
              />
            </View>
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
                selectedValue={selectedStudent}
              />
            )}
            <View className="flex-col gap-5">
              <Button
                style="bg-custom-green-2 p-4 rounded-xl items-center justify-center"
                handle={handleRegister}
              >
                <Text
                  style={{ fontFamily: "Kanit", color: colors.text }}
                  className="font-bold"
                >
                  Register
                </Text>
              </Button>
              <View className="flex-row gap-3 justify-center items-center mb-5 px-5">
                <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
                <Text
                  className="opacity-35 text-custom-green-2"
                  style={{ fontFamily: "Kanit" }}
                >
                  register
                </Text>
                <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
              </View>
              <View className="flex-row justify-between">
                <Button
                  handle={routeRegister}
                  disabled={isAdmin ? false : true}
                >
                  <Text
                    style={{ fontFamily: "Kanit" }}
                    className={`text-custom-green-2 font-bold ${
                      isAdmin ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    {isAdmin ? "Register as parent" : "Register as teacher"}
                  </Text>
                </Button>
                <Button handle={routeLogin}>
                  <Text
                    style={{ fontFamily: "Kanit" }}
                    className="text-custom-green-2 font-bold"
                  >
                    Already have account ?
                  </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
