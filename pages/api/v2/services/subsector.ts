import {message} from "antd";
import {
  sectorData,
  sectorDetailsForSubSector,
  subSectorData,
} from "../../../../types";
import {defaultDatabaseFields, getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";
import subsectorSampleData from "../../../../sample_data/subsector.json";
import {getSectorList, updateSectorData} from "./sector";
import moment from "moment";
import {find} from "lodash";

export const addSubSectorList = async () => {
  let sectorList: sectorData[] = [];

  await getSectorList(async (data: sectorData[]) => {
    sectorList = data;
    await Promise.all(
      data.map(async (sector: any) => {
        await updateSectorData(sector._id, {sub_sector_id: []});
      })
    );
  });

  await Promise.all(
    subsectorSampleData.map(async (value: any) => {
      const sector: sectorData = find(sectorList, {
        name: value.sector_name,
      }) as sectorData;

      const sectorDetails: sectorDetailsForSubSector = {
        _id: sector._id,
        name: sector.name,
        primary_color: sector.primary_color,
        secondary_color: sector.secondary_color,
      };

      await fetch(API.subSector, {
        method: "POST",
        headers: {...getauthToken()},
        body: JSON.stringify({
          name: value.name,
          musaid_contact: value.musaid_contact,
          musaid_its: value.musaid_its,
          musaid_name: value.musaid_name,
          musaida_contact: value.musaida_contact,
          musaida_its: value.musaida_its,
          musaida_name: value.musaida_name,
          latlng: value.latlng,
          no_of_females: 0,
          files: [],
          no_of_males: 0,
          sector: sectorDetails,
          ...defaultDatabaseFields,
        }),
      })
        .then(handleResponse)
        .then(async (response) => {
          await fetch(API.sectorSubId, {
            method: "PUT",
            headers: {...getauthToken()},
            body: JSON.stringify({
              sub_sector_id: response.insertedId,
              id: sectorDetails._id,
            }),
          });
        });
    })
  );
};

export const updateSubSectorListToDefault = async () => {
  getSubSectorList(async (response: subSectorData[]) => {
    await Promise.all(
      response.map(async (value) => {
        const data: any = find(subsectorSampleData, {name: value.name});
        if (data.sector_name) {
          delete data.sector_name;
        }
        updateSubSectorData(value._id as string, {...data});
      })
    ).catch((error) => message.error(error.message));
  });
};

export const getSubSectorList = async (onSuccess?: any) => {
  await fetch(API.subSectorList, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error) => message.error(error.message));
};

export const getSubSectorData = async (id: string, onSuccess?: any) => {
  await fetch(API.subSector + "?fieldName=_id&value=" + id, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error) => message.error(error.message));
};

export const getSubSectorDataByName = async (name: string, onSuccess?: any) => {
  await fetch(API.subSector + "?fieldName=name&value=" + name, {
    method: "GET",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error) => message.error(error.message));
};

export const updateSubSectorData = async (
  id: string,
  data: Partial<subSectorData>
) => {
  await fetch(API.subSector, {
    method: "PUT",
    headers: {...getauthToken()},
    body: JSON.stringify({
      ...data,
      id: id,
      updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
    }),
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};

export const updateSubSectorFilesData = async (
  id: string,
  data: Partial<subSectorData>
) => {
  await fetch(API.subSectorFile, {
    method: "PUT",
    headers: {...getauthToken()},
    body: JSON.stringify({
      ...data,
      id: id,
      updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
    }),
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};

export const resetSubSectorFilesData = async (id: string) => {
  await updateSubSectorData(id, {
    files: [],
    no_of_females: 0,
    no_of_males: 0,
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  })
    .then((response) => response)
    .catch((error) => message.error(error.message));
};
