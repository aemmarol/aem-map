import {message} from "antd";
import {subSectorData} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";
import {getSubSectorList, resetSubSectorFilesData} from "./subsector";

export const resetFileData = async () => {
  let subSectors: subSectorData[] = [];
  await getSubSectorList((data: any) => {
    subSectors = data;
  });

  await Promise.all(
    subSectors.map(async (value) => {
      await resetSubSectorFilesData(value._id as string);
    })
  ).catch((error) => message.error(error.message));

  await fetch(API.fileList, {
    method: "DELETE",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));

  await fetch(API.memberList, {
    method: "DELETE",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};
