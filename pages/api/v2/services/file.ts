import {message} from "antd";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const getFileDataList = async (onSuccess?: any) => {
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

export const getFileDataListBySubsector = async (
  subsector: string,
  onSuccess?: any
) => {
  await fetch(API.fileList + "?queryName=subsector&queryValue=" + subsector, {
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

export const getFileDataListBySector = async (
  sector: string,
  onSuccess?: any
) => {
  await fetch(API.fileList + "?queryName=sector&queryValue=" + sector, {
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

export const getFileData = async (id: string, onSuccess?: any) => {
  await fetch(API.file + "?fieldName=_id&value=" + id, {
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

export const getFileDataByFileNumber = async (
  fileNumber: string,
  onSuccess?: any
) => {
  await fetch(API.file + "?fieldName=tanzeem_file_no&value=" + fileNumber, {
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
