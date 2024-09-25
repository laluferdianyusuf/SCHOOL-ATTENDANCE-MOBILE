import React from "react";
import { DetailScreen, NotificationDetailScreen } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function details() {
  const {
    notificationId,
    notification,
    teacherId,
    teacher,
    studentId,
    student,
  } = useLocalSearchParams();

  const notificationData =
    notification && typeof notification === "string"
      ? JSON.parse(notification)
      : null;

  const teacherData =
    teacher && typeof teacher === "string" ? JSON.parse(teacher) : null;
  const studentData =
    student && typeof student === "string" ? JSON.parse(student) : null;
  return (
    <>
      {notificationId && notification ? (
        <NotificationDetailScreen
          id={Number(notificationId)}
          notification={notificationData}
        />
      ) : (
        (teacherId || studentId) &&
        (teacher || student) && (
          <DetailScreen
            teacherId={Number(teacherId)}
            teacher={teacherData}
            studentId={Number(studentId)}
            student={studentData}
            icon={teacher ? "people-outline" : "school-outline"}
          />
        )
      )}
    </>
  );
}
