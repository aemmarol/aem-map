const prefix =
  // (process.env.NEXT_ROOT_URL || "http://localhost:3000") + "/api/v1/db";
  (process.env.NEXT_ROOT_URL || "http://localhost:3000") + "/api/v2/db";
export const API = {
  dbFields: prefix + "/dbFields",
  user: prefix + "/user",
  userList: prefix + "/user/list",
  umoor: prefix + "/umoor",
  sector: prefix + "/sector",
  sectorList: prefix + "/sector/list",
  sectorSubId: prefix + "/sector/subsectorId",
  subSector: prefix + "/subsector",
  subSectorList: prefix + "/subsector/list",
  subSectorFile: prefix + "/subsector/file",
  file: prefix + "/file",
  fileList: prefix + "/file/list",
  member: prefix + "/member",
  memberList: prefix + "/member/list",
  escalation: prefix + "/escalation",
  escalationAdd: prefix + "/escalation/new",
  settings: prefix + "/settings",
};
