import moment from "moment";
import {defaultFields} from "../types";

export const defaultDatabaseFields: defaultFields = {
  version: 1,
  updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  created_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
};

export const escalationIssueStatusList = [
  {
    value: "Issue Reported",
    color: "blue",
  },
  {
    value: "Resolution In Process",
    color: "orange",
  },
  {
    value: "Resolved",
    color: "green",
  },
  {
    value: "Closed",
    color: "magenta",
  },
];
