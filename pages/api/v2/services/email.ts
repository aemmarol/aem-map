import {message} from "antd";
import {authUser, escalationData} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";
import {getUserList} from "./user";

export const sendNewEscalationEmail = async (data: escalationData) => {
  const userList = await getUserList();
  const type: string = data.type?.value as string;
  const mailList = userList.filter((val: authUser) =>
    val.assignedUmoor.includes(type)
  );

  return await fetch(API.newEscalationEmail, {
    method: "POST",
    body: JSON.stringify({...data, toList: mailList}),
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};
