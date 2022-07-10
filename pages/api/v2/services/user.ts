import {message} from "antd";
import {authUser} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getUserList = async (): Promise<authUser[]> => {
  return await await fetch(API.userList, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};
