import moment from "moment";
import {defaultFields, escalationStatus} from "../types";

export const defaultDatabaseFields: defaultFields = {
  version: 1,
  updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  created_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
};

// export const escalationIssueStatusList = [
//   {
//     value: escalationStatus.ISSUE_REPORTED,
//     color: "blue",
//   },
//   {
//     value: escalationStatus.IN_PROGRESS,
//     color: "orange",
//   },
//   {
//     value: escalationStatus.ISSUE_REPORTED,
//     color: "green",
//   },
//   {
//     value: "Closed",
//     color: "magenta",
//   },
// ];
export const getEscalationStatusDetail = (escStatus: escalationStatus) => {
  const escDetail = {
    text: escStatus,
    color: "white",
  };
  switch (escStatus) {
    case escalationStatus.ISSUE_REPORTED:
      escDetail.color = "blue";
      break;
    case escalationStatus.IN_PROGRESS:
      escDetail.color = "orange";
      break;
    case escalationStatus.RESOLVED:
      escDetail.color = "green";
      break;
    case escalationStatus.CLOSED:
      escDetail.color = "magenta";
      break;
    default:
      break;
  }
  return escDetail;
};
