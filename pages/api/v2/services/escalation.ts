import {message} from "antd";
import {escalationData} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const addEscalationData = async (data: escalationData) => {
  await fetch(API.escalation, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error));
};
