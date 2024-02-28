import {UploadOutlined} from "@ant-design/icons";
import {AgGridReact} from "ag-grid-react";
import {Button, Upload, message} from "antd";
import {FC, useState} from "react";

const defaultColDef = {
  editable: true,
  minWidth: 50,
  flex: 1,
  resizable: true,
  filter: "agTextColumnFilter",
  sortable: true,
};

interface UserGridProps {
  data: any;
}

const userGridcolumns: any[] = [
  {field: "itsId", headerName: "ITS", minWidth: 100, pinned: "left"},
  {field: "name", headerName: "Name", minWidth: 400, pinned: "left"},
  {field: "contact", headerName: "Contact", minWidth: 200},
  {field: "email", headerName: "Email", minWidth: 200},
  {field: "password", headerName: "Password", minWidth: 200},
  {
    field: "userRole",
    headerName: "User Role",
    minWidth: 200,
    suppressPaste: true,
    valueFormatter: (params: any) =>
      params.value ? params?.value?.join(", ") : "",
  },
  {
    field: "assignedArea",
    headerName: "Assigned Area",
    minWidth: 400,
    suppressPaste: true,
    valueFormatter: (params: any) =>
      params.value ? params?.value?.join(", ") : "",
  },
  {
    field: "assignedUmoor",
    headerName: "Assigned Umoor",
    minWidth: 300,
    suppressPaste: true,
    valueFormatter: (params: any) =>
      params.value ? params?.value?.join(", ") : "",
  },
];

export const EditUserGrid: FC<UserGridProps> = ({data}) => {
  const [editUserList, setEditUserList] = useState<any[]>([]);

  const onGridReady = () => {
    setEditUserList(data);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: "/api/noop",
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onChange: async (info: any) => {
      const {status} = info.file;
      if (status === "done") {
        const formData = new FormData();
        // @ts-ignore: Object is possibly 'null'.
        formData.append("file", info.file.originFileObj);

        const requestOptions = {
          method: "POST",
          body: formData,
        };

        const apiResult = await fetch(
          "/api/v1/db/dataUpload",
          requestOptions
        ).then((data) => data.json());

        updateEditUserList(apiResult?.data || []);
        // message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const updateEditUserList = (fileData: any[]) => {
    const enhancedFileData = fileData.map((value) => ({
      ...value,
      userRole: value.userRole
        ? value.userRole.split(",").map((role: any) => role.trim())
        : [],
      assignedArea: value.assignedArea
        ? value.assignedArea.split(",").map((area: any) => area.trim())
        : [],
      assignedUmoor: value.assignedUmoor
        ? value.assignedUmoor.split(",").map((umoor: any) => umoor.trim())
        : [],
    }));
    setEditUserList(enhancedFileData);
  };

  const handleSaveChanges = () => {
    console.log("save changes");
  };

  return (
    <>
      <div style={{display: "flex"}}>
        <Upload {...uploadProps}>
          <Button
            style={{marginBottom: 12}}
            size="large"
            icon={<UploadOutlined />}
          >
            Upload User File
          </Button>
        </Upload>
        <Button
          onClick={handleSaveChanges}
          type="primary"
          size="large"
          style={{marginLeft: 8}}
        >
          Save Changes
        </Button>
      </div>
      <div style={{width: "100%", height: "600px"}}>
        <div
          style={{width: "100%", height: "100%"}}
          className="ag-theme-alpine"
        >
          <AgGridReact
            rowData={editUserList}
            columnDefs={userGridcolumns}
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            copyHeadersToClipboard={false}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            rowSelection={"multiple"}
            suppressScrollOnNewData={true}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </>
  );
};
