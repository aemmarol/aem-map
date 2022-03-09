import { Col, Row } from "antd";
import { GetServerSideProps, NextPage } from "next";
import { Dashboardlayout } from "../../layouts/dashboardLayout";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  deleteDataField,
  getFileDataFields,
  getMumeneenDataFields,
} from "../api/v1/db/databaseFields";
import { databaseMumeneenFieldData } from "../../types";
import {
  DashboardDataFieldTableCard,
  TableCardWithForm,
  UploadExcelFileCard,
} from "../../components";
import {
  fileDetailsFieldCollectionName,
  mumeneenDetailsFieldCollectionName,
} from "../../firebase/dbCollectionNames";
import {
  fileDataFieldsColumns,
  mumeneenDataFieldsColumns,
} from "../../utils/columnData";
import { FileListTable } from "../../components/tables";

interface AdminSettingsProps {
  mumeneenDataFields: databaseMumeneenFieldData[];
  fileDataFields: databaseMumeneenFieldData[];
}

const AdminSettings: NextPage<AdminSettingsProps> = ({
  mumeneenDataFields,
  fileDataFields,
}) => {
  const [isMumeneenDataFieldTableLoading, setisMumeneenDataFieldTableLoading] =
    useState(false);
  const [isSectorDataTableLoading, setisSectorDataTableLoading] =
    useState(false);
  const [mumeneenFields, setMumeneenFields] = useState<
    databaseMumeneenFieldData[] | []
  >([]);
  const [isFileDataFieldTableLoading, setisFileDataFieldTableLoading] =
    useState(false);
  const [fileFields, setFileFields] = useState<
    databaseMumeneenFieldData[] | []
  >([]);

  useEffect(() => {
    setMumeneenFields(mumeneenDataFields);
    setFileFields(fileDataFields);
  }, [mumeneenDataFields, fileDataFields]);

  const updateMumeneenFields = (data: databaseMumeneenFieldData[]) => {
    setMumeneenFields(data);
  };

  const updateFileFields = (data: databaseMumeneenFieldData[]) => {
    setFileFields(data);
  };

  const handleMumeneenFieldDelete = async (record: any) => {
    setisMumeneenDataFieldTableLoading(true);
    await deleteDataField(mumeneenDetailsFieldCollectionName, record.id);
    const updatedData = await getMumeneenDataFields();

    setMumeneenFields(updatedData);
    setisMumeneenDataFieldTableLoading(false);
  };

  const handleFileFieldDelete = async (record: any) => {
    setisFileDataFieldTableLoading(true);
    await deleteDataField(fileDetailsFieldCollectionName, record.id);
    const updatedData = await getFileDataFields();
    setFileFields(updatedData);
    setisFileDataFieldTableLoading(false);
  };

  const loadFileDataFields = async () => {
    setisFileDataFieldTableLoading(true);
    const data = await getFileDataFields();
    updateFileFields(data);
    setisFileDataFieldTableLoading(false);
  };

  const loadMumeneenDataFields = async () => {
    setisMumeneenDataFieldTableLoading(true);
    const data = await getMumeneenDataFields();
    updateMumeneenFields(data);
    setisMumeneenDataFieldTableLoading(false);
  };

  return (
    <Dashboardlayout headerTitle="Admin Settings">
      <Row className="mb-30">
        <Col xs={12}>
          <UploadExcelFileCard />
        </Col>
      </Row>

      <Row gutter={[{ xs: 8, lg: 12 }, 16]}>
        <Col xs={12}>
          <DashboardDataFieldTableCard
            cardTitle="Mumeneen data fields"
            data={mumeneenFields}
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
        </Col>
        <Col xs={12}>
          <DashboardDataFieldTableCard
            cardTitle="File data fields"
            data={fileFields}
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
        </Col>
        <Col xs={24}>
          <TableCardWithForm
            modalTitle="Add Mohallah Form"
            isTableLoading={false}
            formFields={{}}
            addBtnText="Add Mohallah"
            onFormSubmit={() => { }}
            tableComponent={<FileListTable />}
            cardTitle="Mohallah Info"
          />
        </Col>
      </Row>
    </Dashboardlayout>
  );
};

export default AdminSettings;

export const getServerSideProps: GetServerSideProps<
  AdminSettingsProps
> = async () => {
  const mumeneenDataFields: databaseMumeneenFieldData[] =
    await getMumeneenDataFields();
  const fileDataFields: databaseMumeneenFieldData[] = await getFileDataFields();

  return { props: { mumeneenDataFields, fileDataFields } };
};
