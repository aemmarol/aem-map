import {message} from "antd";
import {authUser} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getSettings = async (): Promise<authUser[]> => {
  return await await fetch(API.settings, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};
