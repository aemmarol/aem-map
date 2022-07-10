import moment from "moment";
import {defaultFields, escalationStatus} from "../types";

export const defaultDatabaseFields: defaultFields = {
  version: 1,
  updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  created_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
};

export const getDateDiffDays = (date: string) => {
  const issueDate = moment(date, "DD-MM-YYYY HH:mm:ss").format("YYYY/MM/DD");
  const now = moment(new Date());
  return now.diff(issueDate, "days");
};

export const getEscalationStatusDetail = (escStatus: escalationStatus) => {
  const escDetail = {
    text: escStatus,
    color: "white",
    index: 0,
  };
  switch (escStatus) {
    case escalationStatus.ISSUE_REPORTED:
      escDetail.color = "blue";
      escDetail.index = 1;
      break;
    case escalationStatus.IN_PROGRESS:
      escDetail.color = "orange";
      escDetail.index = 2;
      break;
    case escalationStatus.RESOLVED:
      escDetail.color = "green";
      escDetail.index = 3;
      break;
    case escalationStatus.CLOSED:
      escDetail.color = "magenta";
      escDetail.index = 4;
      break;
    default:
      break;
  }
  return escDetail;
};

export const getauthToken = () => {
  const accessToken = localStorage.getItem("user") as string;
  return {authorization: accessToken};
};
