import {message} from "antd";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getMemberListByHofId = async (hofId: string, onSuccess?: any) => {
  await fetch(API.memberList + "?hofId=" + hofId.toString(), {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error) => message.error(error));
};

export const getMemberDataById = async (itsId: string, onSuccess?: any) => {
  await fetch(API.member + "?itsId=" + itsId.toString(), {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error) => message.error(error));
};