import {DeleteTwoTone} from "@ant-design/icons";
import {message} from "antd";
import {FC, useState} from "react";
import {DashboardDataFieldTableCard} from "../..";
import {mumeneenDetailsFieldCollectionName} from "../../../firebase/dbCollectionNames";
import {databaseMumeneenFieldData} from "../../../types";
import {getauthToken} from "../../../utils";
import {API} from "../../../utils/api";
import {mumeneenDataFieldsColumns} from "../../../utils/columnData";
import {handleResponse} from "../../../utils/handleResponse";

interface CardProps {
  data: any[];
  updateData: (data: databaseMumeneenFieldData[]) => any;
}

export const MumeneenDataFieldTable: FC<CardProps> = ({data, updateData}) => {
  const [isMumeneenDataFieldTableLoading, setisMumeneenDataFieldTableLoading] =
    useState(false);

  const handleMumeneenFieldDelete = async (record: any) => {
    setisMumeneenDataFieldTableLoading(true);
    await fetch(
      API.dbFields + "?collectionName=" + mumeneenDetailsFieldCollectionName,
      {
        method: "DELETE",
        headers: {...getauthToken()},
        body: JSON.stringify({id: record._id}),
      }
    )
      .then(handleResponse)
      .catch((error) => message.error(error));

    const updatedData = await getMumeneenDataFields();

    updateData(updatedData);
    setisMumeneenDataFieldTableLoading(false);
  };

  const loadMumeneenDataFields = async () => {
    setisMumeneenDataFieldTableLoading(true);
    const data = await getMumeneenDataFields();
    updateData(data);

    setisMumeneenDataFieldTableLoading(false);
  };

  const getMumeneenDataFields = async () => {
    const data = await await fetch(API.dbFields + "?collection=mumeneen", {
      method: "GET",
      headers: {...getauthToken()},
    })
      .then(handleResponse)
      .catch((error) => message.error(error));
    return data;
  };

  return (
    <DashboardDataFieldTableCard
      cardTitle="Mumeneen data fields"
      modalTitle="Add Mumeneen data field"
      data={data}
      dataColumns={[
        ...mumeneenDataFieldsColumns,
        {
          title: "Action",
          dataIndex: "",
          key: "x",
          align: "center",

          render: (text: any, record: databaseMumeneenFieldData) => (
            <div className="flex-align-center-justify-center text-align-center">
              <DeleteTwoTone
                onClick={() => handleMumeneenFieldDelete(record)}
                className="font-20"
              />
            </div>
          ),
          width: 50,
        },
      ]}
      collectionName={mumeneenDetailsFieldCollectionName}
      isTableLoading={isMumeneenDataFieldTableLoading}
      onAddSuccess={loadMumeneenDataFields}
    />
  );
};
