import {AgGridReact} from "ag-grid-react";
import {FC} from "react";

const defaultColDef = {
  editable: false,
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
    valueFormatter: (params: any) =>
      params.value ? params.value.join(", ") : "",
  },
  {
    field: "assignedArea",
    headerName: "Assigned Area",
    minWidth: 400,
    valueFormatter: (params: any) =>
      params.value ? params.value.join(", ") : "",
  },
  {
    field: "assignedUmoor",
    headerName: "Assigned Umoor",
    minWidth: 300,
    valueFormatter: (params: any) =>
      params.value ? params.value.join(", ") : "",
  },
];

export const UserGrid: FC<UserGridProps> = ({data}) => {
  return (
    <div style={{width: "100%", height: "600px"}}>
      <div style={{width: "100%", height: "100%"}} className="ag-theme-alpine">
        <AgGridReact
          rowData={data}
          columnDefs={userGridcolumns}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          copyHeadersToClipboard={false}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          rowSelection={"multiple"}
          suppressScrollOnNewData={true}
        />
      </div>
    </div>
  );
};
