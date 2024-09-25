import { format, parseISO, isToday, isYesterday, isTomorrow } from "date-fns";

export const formatTime = (timeString: string | undefined) => {
  if (!timeString) return "No Time Available";

  try {
    const [hours, minutes, seconds] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(Number(seconds));

    return format(date, "hh:mm a");
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "No Date Available";

  try {
    const date = parseISO(dateString);

    if (isToday(date)) {
      return `Today, ${format(date, "d MMMM yyyy")}`;
    }
    if (isYesterday(date)) {
      return `Yesterday, ${format(date, "d MMMM yyyy")}`;
    }
    if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "d MMMM yyyy")}`;
    }
    return format(date, "eeee, d MMMM yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
