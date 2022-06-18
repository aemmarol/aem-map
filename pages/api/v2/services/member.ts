import {message} from "antd";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getMemberDataList = async (onSuccess?: any) => {
  await fetch(API.fileList, {
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
