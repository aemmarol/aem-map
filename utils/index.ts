import moment from "moment";
import {defaultFields} from "../types";

export const defaultDatabaseFields: defaultFields = {
  version: 1,
  updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  created_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
};
