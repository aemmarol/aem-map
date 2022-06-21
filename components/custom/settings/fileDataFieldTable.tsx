import {DeleteTwoTone} from "@ant-design/icons";
import {message} from "antd";
import {FC, useState} from "react";
import {DashboardDataFieldTableCard} from "../..";
import { fileDetailsFieldCollectionName } from "../../../mongodb/dbCollectionNames";
import {getFileDataFields} from "../../../pages/api/v2/services/dbFields";
import {databaseMumeneenFieldData} from "../../../types";
import {getauthToken} from "../../../utils";
import {API} from "../../../utils/api";
import {fileDataFieldsColumns} from "../../../utils/columnData";
import {handleResponse} from "../../../utils/handleResponse";

interface CardProps {
  data: any[];
  updateData: (data: databaseMumeneenFieldData[]) => any;
}

export const FileDataFieldTable: FC<CardProps> = ({data, updateData}) => {
  const [isFileDataFieldTableLoading, setisFileDataFieldTableLoading] =
    useState(false);

  const handleFileFieldDelete = async (record: any) => {
    setisFileDataFieldTableLoading(true);
    await fetch(
      API.dbFields + "?collectionName=" + fileDetailsFieldCollectionName,
      {
        method: "DELETE",
        headers: {...getauthToken()},
        body: JSON.stringify({id: record._id}),
      }
    )
      .then(handleResponse)
      .catch((error) => {
        message.error(error);
      });

    getFileDataFields((data: databaseMumeneenFieldData[]) => {
      updateData(data);
    });
    setisFileDataFieldTableLoading(false);
  };

  const loadFileDataFields = async () => {
    setisFileDataFieldTableLoading(true);
    getFileDataFields((data: databaseMumeneenFieldData[]) => {
      updateData(data);
    });
    setisFileDataFieldTableLoading(false);
  };

  return (
    <DashboardDataFieldTableCard
      cardTitle="File data fields"
      modalTitle="Add File data field"
      data={data}
      dataColumns={[
        ...fileDataFieldsColumns,
        {
          title: "Action",
          dataIndex: "",
          key: "x",
          align: "center",

          render: (text: any, record: databaseMumeneenFieldData) => (
            <div className="flex-align-center-justify-center text-align-center">
              <DeleteTwoTone
                onClick={() => handleFileFieldDelete(record)}
                className="font-20"
              />
            </div>
          ),
          width: 50,
        },
      ]}
      collectionName={fileDetailsFieldCollectionName}
      isTableLoading={isFileDataFieldTableLoading}
      onAddSuccess={loadFileDataFields}
    />
  );
};
