import {message} from "antd";
import {authUser} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getUserList = async (role?: string): Promise<authUser[]> => {
  const url = role ? API.userList + "?role=" + role : API.userList;
  return await await fetch(url, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};
