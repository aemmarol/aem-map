import {deleteFileData, getFileDataList} from "./fileCrud";
import {deleteMemberData, getMemberDataList} from "./memberCrud";
import {
  getSubSectorList,
  resetSubSectorFilesData,
} from "../../v2/services/subsector";
import {subSectorData} from "../../../../types";

export const resetFileData = async () => {
  let subSectors: subSectorData[] = [];
  await getSubSectorList((data: any) => {
    subSectors = data;
  });

  const files = await getFileDataList();
  const members = await getMemberDataList();

  await Promise.all(
    subSectors.map(async (value) => {
      await resetSubSectorFilesData(value._id as string);
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
