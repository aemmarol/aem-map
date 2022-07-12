import {message} from "antd";
import {authUser, umoorData} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getUmoorList = async (): Promise<umoorData[]> => {
  return await await fetch(API.umoor, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};

export const getUmoorListWithCoordinators = async (): Promise<umoorData[]> => {
  // const umoorList = await getUmoorList();
  // const usersList = await getUserList();

  // umoorList.forEach((umoor) => {
  //   umoor.coordinators = [];
  //   usersList.forEach((user) => {
  //     if (user.assignedUmoor && user.assignedUmoor.includes(umoor.value)) {
  //       umoor.coordinators?.push(user);
  //     }
  //   });
  // });
  // return umoorList;
  return await await fetch(API.umoor, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .then(async (umoors) => {
      return await await fetch(API.userList, {
        method: "GET",
        headers: {...getauthToken()},
      })
        .then(handleResponse)
        .then((users) => {
          umoors.forEach((umoor: umoorData) => {
            umoor.coordinators = [];
            users.forEach((user: authUser) => {
              if (
                user.assignedUmoor &&
                user.assignedUmoor.includes(umoor.value)
              ) {
                umoor.coordinators?.push(user);
              }
            });
          });
          return umoors;
        });
    })
    .catch((error) => message.error(error.message));
};
