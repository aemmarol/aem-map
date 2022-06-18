import subsectorSampleData from "../../../../sample_data/subsector.json";

import {
  getSubSectorList,
  resetSubSectorFilesData,
  updateSubSectorData,
} from "./subSectorCrud";
import {deleteFileData, getFileDataList} from "./fileCrud";
import {deleteMemberData, getMemberDataList} from "./memberCrud";

import {find} from "lodash";

export const updateSubSectorsToDefault = async () => {
  const subsectList = await getSubSectorList();

  await Promise.all(
    subsectList.map(async (val) => {
      const subSectorVal = find(subsectorSampleData, {name: val.name});
      await updateSubSectorData(val.id as string, {
        ...subSectorVal,
        name: val.name.toUpperCase(),
      });
    })
  );
};

export const resetFileData = async () => {
  const subSectors = await getSubSectorList();

  const files = await getFileDataList();
  const members = await getMemberDataList();

  await Promise.all(
    subSectors.map(async (value) => {
      await resetSubSectorFilesData(value.id as string);
    })
  );

  await Promise.all(
    files.map(async (value: any) => {
      await deleteFileData(value.id);
    })
  );

  await Promise.all(
    members.map(async (value: any) => {
      await deleteMemberData(value.id);
    })
  );
};
