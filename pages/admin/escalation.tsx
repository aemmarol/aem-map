import {message} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useGlobalContext} from "../../context/GlobalContext";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {authUser, userRoles} from "../../types";
import {logout, verifyUser} from "../api/v1/authentication";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {API} from "../../utils/api";
import {getauthToken} from "../../utils";
import {handleResponse} from "../../utils/handleResponse";

import moment from "moment";

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();

  const [escalationList, setEscalationList] = useState([]);

  useEffect(() => {
    changeSelectedSidebarKey("4");
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
      } else {
        intiLists();
      }
    } else {
      notVerifierUserLogout();
    }
  }, []);

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const intiLists = async () => {
    toggleLoader(true);
    const users = await await fetch(API.userList, {
      method: "GET",
      headers: {...getauthToken()},
    })
      .then(handleResponse)
      .catch((error) => message.error(error.message));

    await fetch(API.escalationList, {
      method: "POST",
      headers: {...getauthToken()},
      body: JSON.stringify({findFilter: {}}),
    })
      .then(handleResponse)
      .then((response) => {
        setEscalationList(
          response
            .sort((a: any, b: any) => {
              const aEsc = Number(a.escalation_id.split("-")[1]);
              const bEsc = Number(b.escalation_id.split("-")[1]);
              return aEsc - bEsc;
            })
            .map((value: any) => {
              const masool = users.filter(
                (user: any) =>
                  user.assignedArea.includes(
                    value.file_details.sub_sector.sector.name
                  ) && user.userRole.includes(userRoles.Masool)
              );
              const masoola = users.filter(
                (user: any) =>
                  user.assignedArea.includes(
                    value.file_details.sub_sector.sector.name
                  ) && user.userRole.includes(userRoles.Masoola)
              );
              const musaid = users.filter(
                (user: any) =>
                  user.assignedArea.includes(
                    value.file_details.sub_sector.name
                  ) && user.userRole.includes(userRoles.Musaid)
              );
              const musaida = users.filter(
                (user: any) =>
                  user.assignedArea.includes(
                    value.file_details.sub_sector.name
                  ) && user.userRole.includes(userRoles.Musaida)
              );
              return {
                ...value,
                ...value.issueRaisedFor,
                ...value.file_details,
                ...value.type,
                sector: value.file_details.sub_sector.sector.name,
                sub_sector: value.file_details.sub_sector.name,
                cb_name: value.created_by.name,
                cb_its: value.created_by.its_number,
                cb_contact: value.created_by.contact_number,
                cb_role: value.created_by.userRole,
                masool_name: masool[0] && masool[0].name ? masool[0].name : "-",
                masool_contact:
                  masool[0] && masool[0].contact ? masool[0].contact : "-",
                masool_its:
                  masool[0] && masool[0].itsId ? masool[0].itsId : "-",
                masoola_name:
                  masoola[0] && masoola[0].name ? masoola[0].name : "-",
                masoola_contact:
                  masoola[0] && masoola[0].contact ? masoola[0].contact : "-",
                masoola_its:
                  masoola[0] && masoola[0].itsId ? masoola[0].itsId : "-",
                musaid_name: musaid[0] && musaid[0].name ? musaid[0].name : "-",
                musaid_contact:
                  musaid[0] && musaid[0].contact ? musaid[0].contact : "-",
                musaid_its:
                  musaid[0] && musaid[0].itsId ? musaid[0].itsId : "-",
                musaida_name:
                  musaida[0] && musaida[0].name ? musaida[0].name : "-",
                musaida_contact:
                  musaida[0] && musaida[0].contact ? musaida[0].contact : "-",
                musaida_its:
                  musaida[0] && musaida[0].itsId ? musaida[0].itsId : "-",
                created_at: moment(
                  value.created_at,
                  "DD-MM-YYYY hh:mm:ss"
                ).format("DD-MM-YYYY"),
              };
            })
        );
      })
      .catch((error) => message.error(error.message))
      .finally(() => {
        toggleLoader(false);
      });
  };

  const defaultColDef = {
    editable: false,
    minWidth: 100,
    flex: 1,
    resizable: true,
    filter: "agTextColumnFilter",
  };

  const columnDefs = [
    {field: "escalation_id", headerName: "Escalation Id", minWidth: 150},
    {field: "ITS", headerName: "ITS", minWidth: 150},
    {field: "name", headerName: "Issue raised for", minWidth: 200},
    {field: "contact", headerName: "Issue raised for contact", minWidth: 200},
    {field: "issue", headerName: "Issue", minWidth: 300},
    {field: "status", headerName: "Status", minWidth: 200},
    {field: "created_at", headerName: "Issue Raised On", minWidth: 150},
    {field: "label", headerName: "Umoor", minWidth: 250},
    {
      field: "tanzeem_file_no",
      headerName: "File number",
      minWidth: 100,
    },
    {field: "hof_its", headerName: "HOF ITS", minWidth: 150},
    {field: "hof_name", headerName: "HOF Name", minWidth: 250},
    {field: "hof_contact", headerName: "HOF contact", minWidth: 200},
    {field: "sector", headerName: "Sector", minWidth: 100},
    {field: "sub_sector", headerName: "Sub Sector", minWidth: 150},
    {field: "address", headerName: "Address", minWidth: 250},
    {field: "cb_name", headerName: "Created By", minWidth: 200},
    {field: "cb_its", headerName: "Created By ITS", minWidth: 150},
    {field: "cb_contact", headerName: "Created By Contact", minWidth: 150},
    {field: "cb_role", headerName: "Created By userRole", minWidth: 150},
    {field: "masool_name", headerName: "Masool Name", minWidth: 200},
    {field: "masool_contact", headerName: "Masool Contact", minWidth: 150},
    {field: "masool_its", headerName: "Masool ITS", minWidth: 150},
    {field: "masoola_name", headerName: "Masoola Name", minWidth: 200},
    {field: "masoola_contact", headerName: "Masoola Contact", minWidth: 150},
    {field: "masoola_its", headerName: "Masoola ITS", minWidth: 150},
    {field: "musaid_name", headerName: "Musaid Name", minWidth: 200},
    {field: "musaid_contact", headerName: "Musaid Contact", minWidth: 150},
    {field: "musaid_its", headerName: "Musaid ITS", minWidth: 150},
    {field: "musaida_name", headerName: "Musaida Name", minWidth: 200},
    {field: "musaida_contact", headerName: "Musaida Contact", minWidth: 150},
    {field: "musaida_its", headerName: "Musaida ITS", minWidth: 150},
  ];

  return (
    <Dashboardlayout headerTitle="Escalations All">
      <div style={{width: "100%", height: "600px"}}>
        <div
          style={{width: "100%", height: "100%"}}
          className="ag-theme-alpine"
        >
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
