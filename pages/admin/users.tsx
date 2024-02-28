import {Button, message} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useGlobalContext} from "../../context/GlobalContext";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {authUser, userRoles} from "../../types";
import {logout, verifyUser} from "../api/v1/authentication";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {API} from "../../utils/api";
import {getauthToken} from "../../utils";
import {handleResponse} from "../../utils/handleResponse";
import {UserGrid} from "../../components";
import Airtable from "airtable";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const userTable = airtableBase("userList");

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();

  const [userList, setUserList] = useState([]);

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
    fetch(API.userList, {
      method: "GET",
      headers: {...getauthToken()},
    })
      .then(handleResponse)
      .then((data) => {
        setUserList(data);
      })
      .catch((error) => message.error(error.message))
      .finally(() => {
        toggleLoader(false);
      });
  };

  const syncAirtableUsers = async () => {
    toggleLoader(true);
    const airtableUserList: any[] = [];
    await userTable
      .select({
        maxRecords: 1000,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            airtableUserList.push(record.fields);
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          addAirtableUsersToDb(airtableUserList);
        }
      );
  };

  const addAirtableUsersToDb = async (data: any[]) => {
    const uploadData = data.map((value) => ({
      ...value,
      email: value.email || "",
      userRole: value.userRole || [],
      assignedArea: value.assignedArea || [],
      assignedUmoor: value.assignedUmoor || [],
    }));

    await fetch(API.userList, {
      method: "PUT",
      headers: {...getauthToken()},
      body: JSON.stringify(uploadData),
    })
      .then(handleResponse)
      .then(()=>{
        message.success("users are updated");
        intiLists()
      })
      .catch((error) => {
        message.error(error);
      }).finally(()=>{
        toggleLoader(false)
      })

  };

  return (
    <Dashboardlayout headerTitle="User List">
      <Button size="large" type="primary" style={{marginBottom:12}} onClick={syncAirtableUsers}>Sync Users</Button>
      <UserGrid data={userList} />

      {/* <Tabs type="card">
        <TabPane tab="View" key="1">
          <UserGrid data={userList} />
        </TabPane>
        <TabPane tab="Update" key="2">
          <div className={styles.userListCta}>
            <EditUserGrid data={userList} />
          </div>
        </TabPane>
      </Tabs> */}
    </Dashboardlayout>
  );
};

export default AdminDashboard;
