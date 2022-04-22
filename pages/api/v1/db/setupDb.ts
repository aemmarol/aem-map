import {sectorData, sectorDetailsForSubSector} from "../../../../types";
import subsectorSampleData from "../../../../sample_data/subsector.json";
import fileFields from "../../../../sample_data/fileField.json";
import memberFields from "../../../../sample_data/mumeneenDataField.json";
import {
  addSectorData,
  addSubSectorIds,
  deleteSectorData,
  getSectorDataByName,
  getSectorList,
  updateSectorData,
} from "./sectorCrud";
import {
  addSubSectorData,
  deleteSubSectorData,
  getSubSectorList,
  resetSubSectorFilesData,
} from "./subSectorCrud";
import {defaultDatabaseFields} from "../../../../utils";
import {sectorDbData} from "../../../../sample_data/sector";
import {deleteFileData, getFileDataList} from "./fileCrud";
import {deleteMemberData, getMemberDataList} from "./memberCrud";
import {addDataField} from "./databaseFields";
import {
  fileDetailsFieldCollectionName,
  mumeneenDetailsFieldCollectionName,
} from "../../../../firebase/dbCollectionNames";
import {find} from "lodash";

export const addSectors = async () => {
  const sectorList = await getSectorList();

  await Promise.all(
    sectorList.map(async (val) => {
      await deleteSectorData(val.id as string);
    })
  );

  await Promise.all(
    sectorDbData.map(async (value) => {
      const boundsArr = value.bounds?.map((val) => ({
        lat: val[0],
        lang: val[1],
      }));
      const successFlag = addSectorData({...value, bounds: boundsArr});
      return successFlag;
    })
  );
};

export const updateSectorsToDefault = async () => {
  const sectorList = await getSectorList();

  await Promise.all(
    sectorList.map(async (val) => {
      const sectorVal = find(sectorDbData, {name: val.name});
      if (sectorVal) {
        const boundsArr = sectorVal.bounds?.map((val) => ({
          lat: val[0],
          lang: val[1],
        }));
        await updateSectorData(val.id as string, {
          ...sectorVal,
          bounds: boundsArr,
        });
      }
    })
  );
};

export const addSubSectors = async () => {
  const subsectList = await getSubSectorList();

  await Promise.all(
    subsectList.map(async (val) => {
      await deleteSubSectorData(val.id as string);
    })
  );

  await Promise.all(
    subsectorSampleData.map(async (value: any) => {
      const sectorInfo: sectorData = await getSectorDataByName(
        value.sector_name
      );
      const sectorDetails: sectorDetailsForSubSector = {
        id: sectorInfo.id,
        name: sectorInfo.name,
        primary_color: sectorInfo.primary_color,
        secondary_color: sectorInfo.secondary_color,
      };

      const successId = await addSubSectorData({
        name: value.name.toUpperCase(),
        musaid_contact: value.musaid_contact,
        musaid_its: value.musaid_its,
        musaid_name: value.musaid_name,
        musaida_contact: value.musaida_contact,
        musaida_its: value.musaida_its,
        musaida_name: value.musaida_name,
        no_of_females: 0,
        files: [],
        no_of_males: 0,
        sector: sectorDetails,
        ...defaultDatabaseFields,
      });

      const successFlag = await addSubSectorIds(
        sectorInfo.id as string,
        successId
      );

      return successFlag;
    })
  );
};

export const setDbFields = async () => {
  await Promise.all(
    fileFields.map(async (value) => {
      await addDataField(fileDetailsFieldCollectionName, {
        ...value,
        ...defaultDatabaseFields,
      });
    })
  );
  await Promise.all(
    memberFields.map(async (value) => {
      await addDataField(mumeneenDetailsFieldCollectionName, {
        ...value,
        ...defaultDatabaseFields,
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
