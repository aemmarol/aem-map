import Airtable from "airtable";
import {authUser} from "../../../../types";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");
const userTable = airtableBase("userList");

let userlist: authUser[];

export const userListFromDB = async (): Promise<authUser[]> => {
  if (userlist) {
    console.log("USING USERLIST FROM CACHE");
    return userlist;
  }
  const userRecords = await userTable
    .select({
      view: "Grid view",
    })
    .all();
  userlist = userRecords.map((record) => record._rawJson.fields as authUser);
  //   console.log(users);
  return userlist;
};
