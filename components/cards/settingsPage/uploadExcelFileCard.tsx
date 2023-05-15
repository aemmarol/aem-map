import {Button, Card, message, Upload} from "antd";
import {FC, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
import {defaultDatabaseFields, getauthToken} from "../../../utils";
import {useGlobalContext} from "../../../context/GlobalContext";
import {databaseMumeneenFieldData, subSectorData} from "../../../types";
import {
  getFileDataFields,
  getMumeneenDataFields,
} from "../../../pages/api/v2/services/dbFields";
import {
  getSubSectorList,
  updateSubSectorFilesData,
} from "../../../pages/api/v2/services/subsector";
import {resetFileData} from "../../../pages/api/v2/services/dbUpload";
import {API} from "../../../utils/api";
import {handleResponse} from "../../../utils/handleResponse";
import {filter, findIndex} from "lodash";

const Dragger = Upload.Dragger;

export const UploadExcelFileCard: FC = () => {
  const [excelFile, setexcelFile] = useState(null);
  const {toggleProgressLoader, setProgressValue} = useGlobalContext();

  const draggerProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: "/api/noop",
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
    // console.log(apiResult.data)
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
    const fileFieldList = await getDbFileDataFields();
    const memberFieldList = await getDbMumeneenDataFields();
    let dbSubSectorList:any[] = [];
    await getSubSectorList((data:any)=>{dbSubSectorList=data});

    const fileList = await Promise.all(
      data
        .filter((val) => val.hof_fm_type === "HOF")
        .map(async (userDetails) => {
          const index = findIndex(dbSubSectorList,{name:userDetails.sub_sector})
          const subsector= dbSubSectorList[index];

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
              return {
                ...memberData,
                its_id: val.its_id,
                hof_id: val.hof_id,
              };
            });

          return {
            [userDetails.hof_id]: {
              ...fileFieldsData,
              ...defaultDatabaseFields,
              hof_name: userDetails.full_name,
              sub_sector: {
                name: subsector?.name,
                _id: subsector?._id,
                sector: subsector?.sector,
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
              const tempObj = {
                ...value,
                ...defaultDatabaseFields,
              };
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

  const getDbFileDataFields = async () => {
    let fieldsData: databaseMumeneenFieldData[] = [];
    await getFileDataFields((data: databaseMumeneenFieldData[]) => {
      fieldsData = data;
    });
    return fieldsData;
  };

  const getDbMumeneenDataFields = async () => {
    let fieldsData: databaseMumeneenFieldData[] = [];
    await getMumeneenDataFields((data: databaseMumeneenFieldData[]) => {
      fieldsData = data;
    });
    return fieldsData;
  };

  const getMemberDataList = (fileData: any) => {
    const finalMemberList: any[] = [];
    fileData.map((file: any) => {
      const {memberData} = file;
      memberData.map((member: any) => {
        const memberId: any = Object.keys(member)[0];
        finalMemberList.push({
          _id: memberId,
          ...member[memberId],
        });
      });
    });

    return finalMemberList;
  };

  const getFileDataList = (fileData: any) => {
    const finalFileList: any[] = [];
    fileData.map((file: any) => {
      const fileId: any = Object.keys(file)[0];
      finalFileList.push({
        ...file[fileId],
        _id: fileId,
      });
    });

    return finalFileList;
  };

  const getSubSectorUpdateData = async (fileList: any) => {
    const finalData: any = [];
    await getSubSectorList((data: subSectorData[]) => {
      data.map((subSector) => {
        const files = filter(fileList, ["sub_sector.name", subSector.name]);
        const no_of_males = files
          .map((val) => val.no_of_males)
          .reduce((sum, current) => sum + current, 0);
        const no_of_females = files
          .map((val) => val.no_of_females)
          .reduce((sum, current) => sum + current, 0);
        finalData.push({
          id: subSector._id,
          data: {
            files: files.map((val) => val._id),
            no_of_males,
            no_of_females,
          },
        });
      });
    });

    return finalData;
  };

  const addDataToDb = async (data: any[]) => {
    if (verifyData(data)) {
      toggleProgressLoader(true);
      setProgressValue(0);
      await resetFileData();
      setProgressValue(40);
      const fileData = await getFileList(data);
      setProgressValue(50);
      const dbUloadFileData = getFileDataList(fileData);
      const dbUloadMemberData = getMemberDataList(fileData);

      // console.log(dbUloadFileData,dbUloadMemberData)

      await fetch(API.fileList, {
        method: "POST",
        headers: {...getauthToken()},
        body: JSON.stringify(dbUloadFileData),
      })
        .then(handleResponse)
        .catch((error) => message.error(error));
      setProgressValue(60);

      await fetch(API.memberList, {
        method: "POST",
        headers: {...getauthToken()},
        body: JSON.stringify(dbUloadMemberData),
      })
        .then(handleResponse)
        .catch((error) => message.error(error));
      setProgressValue(70);

      const dBsubSectorData = await getSubSectorUpdateData(dbUloadFileData);
      setProgressValue(80);

      await Promise.all(
        dBsubSectorData.map(async (subSector: any) => {
          await updateSubSectorFilesData(subSector.id, subSector.data).catch(
            (error) => message.error(error)
          );
        })
      );
      setProgressValue(100);
      toggleProgressLoader(false);
      setProgressValue(0);
      setexcelFile(null);
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
