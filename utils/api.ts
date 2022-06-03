const prefix =
  (process.env.NEXT_ROOT_URL || "http://localhost:3000") + "/api/v1/db";
export const API = {
  escalation: prefix + "/escalation",
  escalationAdd: prefix + "/escalation/new",
};
