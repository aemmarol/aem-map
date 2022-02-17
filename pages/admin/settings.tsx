import {Button, Card, Col, message, Row, Upload} from "antd";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {InboxOutlined} from "@ant-design/icons";
import {useState} from "react";

const Dragger = Upload.Dragger;

const AdminSettings: NextPage = () => {
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
      // console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    // @ts-ignore: Object is possibly 'null'.
    formData.append("file", excelFile.originFileObj);

    const requestOptions = {
      method: "POST",
      // headers: {"Content-Type": "multipart/form-data"},
      body: formData,
    };

    const apiResult = await fetch(
      "/api/v1/user/dataUpload",
      requestOptions
    ).then((data) => data.json());
  };

  return (
    <Dashboardlayout headerTitle="Admin Settings">
      <Row>
        <Col xs={12}>
          <Card
            extra={
              <Button
                disabled={!excelFile}
                onClick={handleFileSubmit}
                type="primary"
              >
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
    </Dashboardlayout>
  );
};

export default AdminSettings;
