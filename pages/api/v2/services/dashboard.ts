import {message} from "antd";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getDashboardUmoorStats = async (
  status?: string,
  onSuccess?: any
) => {
  const url =
    status === "all"
      ? API.escalationCount + "?type=umoor"
      : API.escalationCount + "?type=umoor&status=" + status;

  await fetch(url, {
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

export const getDashboardSectorStats = async (
  status?: string,
  onSuccess?: any
) => {
  const url =
    status === "all"
      ? API.escalationCount + "?type=sector"
      : API.escalationCount + "?type=sector&status=" + status;

  await fetch(url, {
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
