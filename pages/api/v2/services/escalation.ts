import {message} from "antd";
import {escalationData} from "../../../../types";
import {
  filterTypes,
  selectedFilterItemsType,
} from "../../../../types/escalation";
import {getauthToken} from "../../../../utils";
import {API} from "../../../../utils/api";
import {handleResponse} from "../../../../utils/handleResponse";

export const addEscalationData = async (data: escalationData) => {
  return await fetch(API.escalation, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};

export const getEscalationData = async (id: string, onSuccess?: any) => {
  await fetch(API.escalation + "/" + id, {
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

export const updateEscalationData = async (id: string, data: any) => {
  await fetch(API.escalation + "/" + id, {
    method: "PUT",
    headers: {...getauthToken()},
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .catch((error) => message.error(error.message));
};

export const getEscalationListFromDb = async (
  filters: selectedFilterItemsType,
  onSuccess?: any
) => {
  let findFilter: any = {
    ["file_details.sub_sector.sector.name"]: {
      $in: filters[filterTypes.Sector],
    },
    ["type.value"]: {$in: filters[filterTypes.Umoor]},
  };
  if (!filters[filterTypes.SubSector]) {
    if (!filters[filterTypes.Sector]) {
      findFilter["file_details.sub_sector.sector.name"] = {$in: []};
    }
    if (!filters[filterTypes.Umoor]) {
      findFilter["type.value"] = {$in: []};
    }
  } else {
    findFilter = {
      ["file_details.sub_sector.name"]: {
        $in: filters[filterTypes.SubSector],
      },
    };
  }

  await fetch(API.escalationList, {
    method: "POST",
    headers: {...getauthToken()},
    body: JSON.stringify({findFilter}),
  })
    .then(handleResponse)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error) => message.error(error.message));
};

export const getUmoorStats = async (status: string, onSuccess?: any) => {
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
    .catch((error) => message.error(error.message));
};

export const getSectorStats = async (status: string, onSuccess?: any) => {
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
    .catch((error) => message.error(error.message));
};

export const getEscalationStatsByFilter = async (
  type: string,
  status: string,
  filterName: string,
  filterValue: string,
  onSuccess?: any
) => {
  const url =
    status === "all"
      ? API.escalationCount +
        "?type=" +
        type +
        "&filterName=" +
        filterName +
        "&filterValue=" +
        filterValue
      : API.escalationCount +
        "?type=" +
        type +
        "&status=" +
        status +
        "&filterValue=" +
        filterValue +
        "&filterName=" +
        filterName;

  await fetch(url, {
    method: "POST",
    headers: {...getauthToken()},
  })
    .then(handleResponse)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    })
    .catch((error) => console.log(error));
};
