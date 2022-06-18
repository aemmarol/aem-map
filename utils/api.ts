const prefix =
  // (process.env.NEXT_ROOT_URL || "http://localhost:3000") + "/api/v1/db";
  (process.env.NEXT_ROOT_URL || "http://localhost:3000") + "/api/v2/db";
export const API = {
  dbFields: prefix + "/dbFields",
  user: prefix + "/user",
  umoor: prefix + "/umoor",
  sector: prefix + "/sector",
  sectorList: prefix + "/sector/list",
  subSectorList: prefix + "/subsector/list",
  userList: prefix + "/user/list",
  escalation: prefix + "/escalation",
  escalationAdd: prefix + "/escalation/new",
};
