const prefix =
  // (process.env.NEXT_ROOT_URL || "http://localhost:3000") + "/api/v1/db";
  (process.env.NEXT_ROOT_URL || "http://localhost:3000") + "/api/v2/db";
export const API = {
  user: prefix + "/user",
  umoor: prefix + "/umoor",
  userList: prefix + "/user/list",
  escalation: prefix + "/escalation",
  escalationAdd: prefix + "/escalation/new",
};
