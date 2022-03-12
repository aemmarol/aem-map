import {sectorData, sectorDetailsForSubSector} from "../../../../types";
import subsectorSampleData from "../../../../sample_data/subsector.json";
import {
  addSectorData,
  addSubSectorIds,
  getSectorDataByName,
} from "./sectorCrud";
import {addSubSectorData} from "./subSectorCrud";
import {defaultDatabaseFields} from "../../../../utils";
import {sectorDbData} from "../../../../sample_data/sector";

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
        no_of_files: 0,
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
