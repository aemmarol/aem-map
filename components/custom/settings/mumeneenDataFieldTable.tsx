import {DeleteTwoTone} from "@ant-design/icons";
import {FC, useState} from "react";
import {DashboardDataFieldTableCard} from "../..";
import {mumeneenDetailsFieldCollectionName} from "../../../firebase/dbCollectionNames";
import {
  deleteDataField,
  getMumeneenDataFields,
} from "../../../pages/api/v1/db/databaseFields";
import {databaseMumeneenFieldData} from "../../../types";
import {mumeneenDataFieldsColumns} from "../../../utils/columnData";

interface CardProps {
  data: any[];
  updateData: (data: databaseMumeneenFieldData[]) => any;
}

export const MumeneenDataFieldTable: FC<CardProps> = ({data, updateData}) => {
  const [isMumeneenDataFieldTableLoading, setisMumeneenDataFieldTableLoading] =
    useState(false);

  const handleMumeneenFieldDelete = async (record: any) => {
    setisMumeneenDataFieldTableLoading(true);
    await deleteDataField(mumeneenDetailsFieldCollectionName, record.id);
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
