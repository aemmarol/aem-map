import {message} from "antd";
import {umoorData} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";
import {getUserList} from "./user";

export const getUmoorList = async (): Promise<umoorData[]> => {
  return await await fetch(API.umoor, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};

export const getUmoorListWithCoordinators = async (): Promise<umoorData[]> => {
  const umoorList = await getUmoorList();
  const usersList = await getUserList();

  umoorList.forEach((umoor) => {
    umoor.coordinators = [];
    usersList.forEach((user) => {
      if (user.assignedUmoor && user.assignedUmoor.includes(umoor.value)) {
        umoor.coordinators?.push(user);
      }
    });
  });
  return umoorList;
};
