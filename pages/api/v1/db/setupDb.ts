import {sectorData, sectorDetailsForSubSector} from "../../../../types";
import subsectorSampleData from "../../../../sample_data/subsector.json";
import fileFields from "../../../../sample_data/fileField.json";
import memberFields from "../../../../sample_data/mumeneenDataField.json";
import {
  addSectorData,
  addSubSectorIds,
  getSectorDataByName,
} from "./sectorCrud";
import {
  addSubSectorData,
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

export const addSectors = async () => {
  await Promise.all(
    sectorDbData.map(async (value) => {
      const successFlag = addSectorData(value);
      return successFlag;
    })
  );
};

export const addSubSectors = async () => {
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
