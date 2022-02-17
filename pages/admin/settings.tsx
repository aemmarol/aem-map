import {Button, Card, Col, message, Row, Upload} from "antd";
import {GetServerSideProps, NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {DeleteTwoTone, InboxOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {
  deleteDataField,
  getFileDataFields,
  getMumeneenDataFields,
} from "../api/v1/user/databaseFields";
import {databaseMumeneenFieldData} from "../../interfaces";
import {DashboardDataFieldTableCard} from "../../components";
import {
  fileDetailsFieldCollectionName,
  mumeneenDetailsFieldCollectionName,
} from "../../firebase/dbCollectionNames";
import moment from "moment";

const Dragger = Upload.Dragger;

interface AdminSettingsProps {
  mumeneenDataFields: databaseMumeneenFieldData[];
  fileDataFields: databaseMumeneenFieldData[];
}

const AdminSettings: NextPage<AdminSettingsProps> = ({
  mumeneenDataFields,
  fileDataFields,
}) => {
  const [excelFile, setexcelFile] = useState(null);
  const [isMumeneenDataFieldTableLoading, setisMumeneenDataFieldTableLoading] =
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

  const mumeneenDataFieldsColumns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (value: any) => moment(value).format("DD-MM-YYYY"),
      width: 100,
    },
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
  ];

  const fileDataFieldsColumns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (value: any) => moment(value).format("DD-MM-YYYY"),
      width: 100,
    },
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
  ];

  const handleFileSubmit = async () => {
    const formData = new FormData();
    // @ts-ignore: Object is possibly 'null'.
    formData.append("file", excelFile.originFileObj);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    const apiResult = await fetch(
      "/api/v1/user/dataUpload",
      requestOptions
    ).then((data) => data.json());

    console.log(apiResult);
  };

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

  return (
    <Dashboardlayout headerTitle="Admin Settings">
      <Row className="mb-30">
        <Col xs={12}>
          <Card
            extra={
              <Button onClick={handleFileSubmit} type="primary">
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
        </Col>
      </Row>

      <Row gutter={{xs: 8}}>
        <Col xs={12}>
          <DashboardDataFieldTableCard
            cardTitle="Mumeneen data fields"
            data={mumeneenFields}
            dataColumns={mumeneenDataFieldsColumns}
            updateData={updateMumeneenFields}
            collectionName={mumeneenDetailsFieldCollectionName}
            isTableLoading={isMumeneenDataFieldTableLoading}
          />
        </Col>
        <Col xs={12}>
          <DashboardDataFieldTableCard
            cardTitle="File data fields"
            data={fileFields}
            dataColumns={fileDataFieldsColumns}
            updateData={updateFileFields}
            collectionName={fileDetailsFieldCollectionName}
            isTableLoading={isFileDataFieldTableLoading}
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

  return {props: {mumeneenDataFields, fileDataFields}};
};
