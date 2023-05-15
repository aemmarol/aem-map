import { message } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { Dashboardlayout } from "../../layouts/dashboardLayout";
import {
  authUser,
  userRoles,
} from "../../types";
import { logout, verifyUser } from "../api/v1/authentication";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { API } from "../../utils/api";
import { getauthToken } from "../../utils";
import { handleResponse } from "../../utils/handleResponse";

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const { toggleLoader, changeSelectedSidebarKey } = useGlobalContext();

  const [escalationList, setEscalationList] = useState([])

  useEffect(() => {
    changeSelectedSidebarKey("4");
    if (typeof verifyUser() !== "string") {
      const { userRole } = verifyUser() as authUser;
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
      } else {
        intiLists();
      }
    } else {
      notVerifierUserLogout();
    }
  }, []);

  useEffect(() => {
    console.log(escalationList)
  }, [escalationList])

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const intiLists = async () => {
    toggleLoader(true);
    await fetch(API.escalationList, {
      method: "POST",
      headers: { ...getauthToken() },
      body: JSON.stringify({ findFilter: {} }),
    })
      .then(handleResponse)
      .then((response) => {
        setEscalationList(response.sort((a:any,b:any)=>{
          const aEsc = Number(a.escalation_id.split("-")[1]);
          const bEsc = Number(b.escalation_id.split("-")[1]);
          return aEsc - bEsc
        }).map((value: any) => ({ 
          ...value, 
          ...value.issueRaisedFor, 
          ...value.file_details,
          ...value.type,
          sector:value.file_details.sub_sector.sector.name,
          sub_sector:value.file_details.sub_sector.name,
          cb_name:value.created_by.name,
          cb_its:value.created_by.its_number,
          cb_contact:value.created_by.contact_number,
          cb_role:value.created_by.userRole
        })))
      })
      .catch((error) => message.error(error.message))
      .finally(() => {
        toggleLoader(false);
      })
  };

  const defaultColDef = {
    editable: false,
    minWidth: 100,
    flex: 1,
    resizable: true,
    filter: "agTextColumnFilter"
  };

  const columnDefs = [
    { field: "escalation_id", headerName: "Escalation Id", minWidth: 150 },
    { field: "ITS", headerName: "ITS", minWidth: 150 },
    { field: "name", headerName: "Issue raised for", minWidth: 200 },
    { field: "contact", headerName: "Issue raised for contact", minWidth: 200 },
    { field: "issue", headerName: "Issue", minWidth: 300 },
    { field: "label", headerName: "Umoor", minWidth: 250 },
    {
      field: "tanzeem_file_no",
      headerName: "File number",
      minWidth: 100
    },
    { field: "hof_its", headerName: "HOF ITS", minWidth: 150 },
    { field: "hof_name", headerName: "HOF Name", minWidth: 250 },
    { field: "hof_contact", headerName: "HOF contact", minWidth: 200 },
    { field: "sector", headerName: "Sector", minWidth: 100 },
    { field: "sub_sector", headerName: "Sub Sector", minWidth: 150 },
    { field: "address", headerName: "Address", minWidth: 250 },
    { field: "cb_name", headerName: "Created By", minWidth: 200 },
    { field: "cb_its", headerName: "Created By ITS", minWidth: 150 },
    { field: "cb_contact", headerName: "Created By Contact", minWidth: 150 },
    { field: "cb_role", headerName: "Created By userRole", minWidth: 150 },
    
  ]

  return (
    <Dashboardlayout headerTitle="Escalations All">
      <div style={{ width: "100%", height: "600px" }}>
        <div style={{ width: "100%", height: "100%" }} className="ag-theme-alpine">
          <AgGridReact
            rowData={escalationList}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            copyHeadersToClipboard={false}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            rowSelection={"multiple"}
            suppressScrollOnNewData={true}
          ></AgGridReact>
        </div>
      </div>
    </Dashboardlayout>
  );
};

export default AdminDashboard;
