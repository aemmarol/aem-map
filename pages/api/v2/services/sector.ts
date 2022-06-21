import {message} from "antd";
import {find} from "lodash";
import moment from "moment";
import {sectorDbData} from "../../../../sample_data/sector";
import {sectorData} from "../../../../types";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const addSectorList = async () => {
  Promise.all(
    sectorDbData.map(async (value: sectorData) => {
      const boundsArr = value.bounds?.map((val) => ({
        lat: val[0],
        lang: val[1],
      }));
      await fetch(API.sector, {
        method: "POST",
        headers: {...getauthToken()},
        body: JSON.stringify({...value, bounds: boundsArr, sub_sector_id: []}),
      }).then(handleResponse);
    })
  ).catch((error) => message.error(error));
};

export const updateSectorListToDefault = async () => {
  getSectorList(async (response: sectorData[]) => {
    await Promise.all(
      response.map(async (value) => {
        const data = find(sectorDbData, {name: value.name});
        const boundsArr = data?.bounds?.map((val) => ({
          lat: val[0],
          lang: val[1],
        }));
        updateSectorData(value._id as string, {...data, bounds: boundsArr});
      })
    ).catch((error) => message.error(error));
  });
};

export const getSectorList = async (onSuccess?: any) => {
  await fetch(API.sectorList, {
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

export const getSectorData = async (id: string, onSuccess?: any) => {
  await fetch(API.sector + "?fieldName=_id&value=" + id, {
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

export const getSectorDataByName = async (name: string, onSuccess?: any) => {
  await fetch(API.sector + "?fieldName=name&value=" + name, {
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

export const updateSectorData = async (
  id: string,
  data: Partial<sectorData>
) => {
  await fetch(API.sector, {
    method: "PUT",
    headers: {...getauthToken()},
    body: JSON.stringify({
      ...data,
      id: id,
      updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
    }),
  })
    .then(handleResponse)
    .catch((error) => message.error(error));
};
