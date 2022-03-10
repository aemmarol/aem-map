import {Button, Card, message, Upload} from "antd";
import {FC, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";

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

    console.log(apiResult);
  };

  return (
    <Card
      className="border-radius-10"
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
  );
};
