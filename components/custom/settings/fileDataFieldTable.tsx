import {DeleteTwoTone} from "@ant-design/icons";
import {FC, useState} from "react";
import {DashboardDataFieldTableCard} from "../..";
import {fileDetailsFieldCollectionName} from "../../../firebase/dbCollectionNames";
import {
  deleteDataField,
  getFileDataFields,
} from "../../../pages/api/v1/db/databaseFields";
import {databaseMumeneenFieldData} from "../../../types";
import {fileDataFieldsColumns} from "../../../utils/columnData";

interface CardProps {
  data: any[];
  updateData: (data: databaseMumeneenFieldData[]) => any;
}

export const FileDataFieldTable: FC<CardProps> = ({data, updateData}) => {
  const [isFileDataFieldTableLoading, setisFileDataFieldTableLoading] =
    useState(false);

  const handleFileFieldDelete = async (record: any) => {
    setisFileDataFieldTableLoading(true);
    await deleteDataField(fileDetailsFieldCollectionName, record.id);
    const updatedData = await getFileDataFields();
    updateData(updatedData);
    setisFileDataFieldTableLoading(false);
  };

  const loadFileDataFields = async () => {
    setisFileDataFieldTableLoading(true);
    const data = await getFileDataFields();
    updateData(data);
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
