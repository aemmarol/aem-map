import { message } from "antd";
import { umoorData } from "../../../../types";
import { getauthToken } from "../../../../utils";
import { API } from "../../../../utils/api";
import { handleResponse } from "../../../../utils/handleResponse";
import { getUserList } from "./user";

export const getUmoorList = async (): Promise<umoorData[]> => {
    return await await fetch(API.umoor, {
        method: "GET",
        headers: { ...getauthToken() },
    })
        .then(handleResponse)
        .catch((error) => message.error(error));
};

export const getUmoorListWithCoordinators = async (): Promise<umoorData[]> => {
    const umoorList = await getUmoorList();
    const usersList = await getUserList();

    umoorList.forEach((umoor) => {
        umoor.coordinators = [];
        usersList.forEach((user) => {
            // console.log(user.assignedUmoor, umoor.value);
            if (user.assignedUmoor && user.assignedUmoor.includes(umoor.value)) {
                umoor.coordinators?.push(user);
            }
        });
        // console.log(umoor, umoor.label);
    });
    return umoorList;
};