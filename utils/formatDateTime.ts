import moment from "moment";

const formatDateTime = (dateString: string) => {
  const date = moment(dateString);

  const dateFormatted = date.format("DD MMMM YYYY");

  const timeFormatted = date.format("hh:mm");

  return {
    dateFormatted,
    timeFormatted,
  };
};

export default formatDateTime;
