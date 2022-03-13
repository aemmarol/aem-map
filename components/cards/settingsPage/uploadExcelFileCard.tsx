import {Button, Card, message, Upload} from "antd";
import {FC, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
import {} from "../../../firebase/dbCollectionNames";
import {defaultDatabaseFields} from "../../../utils";
import {
  getFileDataFields,
  getMumeneenDataFields,
} from "../../../pages/api/v1/db/databaseFields";
import {
  getSubSectorDataByName,
  updateSubSectorFilesData,
} from "../../../pages/api/v1/db/subSectorCrud";

import {addFileData} from "../../../pages/api/v1/db/fileCrud";
import {addMemberData} from "../../../pages/api/v1/db/memberCrud";

const Dragger = Upload.Dragger;

export const UploadExcelFileCard: FC = () => {
  const [excelFile, setexcelFile] = useState(null);

  const draggerProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onChange(info: any) {
      const {status} = info.file;
      if (status !== "uploading") {
        setexcelFile(info.file);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    // @ts-ignore: Object is possibly 'null'.
    formData.append("file", excelFile.originFileObj);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    const apiResult = await fetch("/api/v1/db/dataUpload", requestOptions).then(
      (data) => data.json()
    );
    addDataToDb(apiResult.data);
  };

  const verifyData = (data: any[]): boolean => {
    const errorValue = data.filter((val) => {
      if (!val.hof_id || !val.its_id || !val.sub_sector || !val.hof_fm_type)
        return true;
      return false;
    });
    if (errorValue.length) return false;
    return true;
  };

  const getFileList = async (data: any[]) => {
    const fileFieldList = await getFileDataFields();
    const memberFieldList = await getMumeneenDataFields();

    const fileList = await Promise.all(
      data
        .filter((val) => val.hof_fm_type === "HOF")
        .map(async (userDetails) => {
          const subsector = await getSubSectorDataByName(
            userDetails.sub_sector
          );
          const fileFieldsData: any = {};

          fileFieldList.forEach((val: any) => {
            fileFieldsData[val.name] = userDetails[val.name]
              ? userDetails[val.name]
              : null;
          });

          const membersList = data
            .filter((val) => val.hof_id === userDetails.hof_id)
            .map((val) => {
              const memberData: any = {};
              memberFieldList.forEach((value: any) => {
                memberData[value.name] = val[value.name]
                  ? val[value.name]
                  : null;
              });
              return {...memberData, its_id: val.its_id, hof_id: val.hof_id};
            });

          return {
            [userDetails.hof_id]: {
              ...fileFieldsData,
              ...defaultDatabaseFields,
              sub_sector: {
                name: subsector.name,
                id: subsector.id,
                sector: subsector.sector,
              },
              member_ids: membersList.map((val) => val.its_id),
              no_of_males: membersList.filter(
                (val) => val.gender.toLowerCase() === "male"
              ).length,
              no_of_females: membersList.filter(
                (val) => val.gender.toLowerCase() === "female"
              ).length,
            },
            memberData: membersList.map((value) => {
              const tempObj = {...value, ...defaultDatabaseFields};
              delete tempObj.its_id;
              return {
                [value.its_id]: tempObj,
              };
            }),
          };
        })
    );
    return fileList;
  };

  const addDataToDb = async (data: any[]) => {
    if (verifyData(data)) {
      const fileData = await getFileList(data);

      await Promise.all(
        fileData.map(async (file) => {
          const fileId: any = Object.keys(file)[0];
          const memberList = file.memberData;

          const addFileSuccess = await addFileData(fileId, file[fileId]);
          const updateSubSector = await updateSubSectorFilesData(
            file[fileId].sub_sector.id,
            fileId,
            file[fileId].no_of_males,
            file[fileId].no_of_females
          );
          const addMemberSuccess = await Promise.all(
            memberList.map(async (member) => {
              const memberId: any = Object.keys(member)[0];
              return await addMemberData(memberId, member[memberId]);
            })
          );

          return {addFileSuccess, updateSubSector, addMemberSuccess};
        })
      );
      message.success("data uploaded successfully");
    } else {
      message.error("Improper file uploaded!");
    }
  };

  return (
    <Card
      className="border-radius-10"
      extra={
        <Button disabled={!excelFile} onClick={handleFileSubmit} type="primary">
          Submit
        </Button>
      }
      title="Upload Excel File"
    >
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p>Click or drag file to this area to upload</p>
      </Dragger>
    </Card>
  );
};
