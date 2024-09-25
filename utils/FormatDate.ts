import moment from "moment";
import "moment/locale/id";

const formatDate = (dateString: string): string => {
  const date = moment(dateString);

  if (date.isSame(moment(), "day")) {
    return "Today";
  }

  if (date.isSame(moment().subtract(1, "day"), "day")) {
    return "Yesterday";
  }

  return date.format("DD MMMM");
};

export default formatDate;
