import {Button, Card, Col, message, Row} from "antd";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import escData from "../../sample_data/escalationData.json";

import {
  authUser,
  comment,
  databaseMumeneenFieldData,
  escalationData,
  escalationStatus,
  sectorData,
  subSectorData,
  userRoles,
} from "../../types";
import {
  MumeneenDataFieldTable,
  FileDataFieldTable,
  UploadExcelFileCard,
  SectorDetailsComponent,
  SubSectorDetailsComponent,
} from "../../components";
import {logout, verifyUser} from "../api/v1/authentication";
import {useRouter} from "next/router";
import {useGlobalContext} from "../../context/GlobalContext";
import Airtable from "airtable";
import {API} from "../../utils/api";
import {defaultDatabaseFields, getauthToken} from "../../utils";
import {handleResponse} from "../../utils/handleResponse";
import {
  getFileDataFields,
  getMumeneenDataFields,
} from "../api/v2/services/dbFields";
import {getSectorList} from "../api/v2/services/sector";
import {getUmoorList} from "../api/v2/services/umoor";
import {getSubSectorList} from "../api/v2/services/subsector";
import moment from "moment";
import {findIndex} from "lodash";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const userTable = airtableBase("userList");
const umoorTable = airtableBase("umoorList");

const AdminSettings: NextPage = () => {
  const router = useRouter();
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();

  const [sectorDetails, setSectorDetails] = useState<sectorData[] | []>([]);
  const [subsectorDetails, setSubsectorDetails] = useState<
    subSectorData[] | []
  >([]);
  const [mumeneenFields, setMumeneenFields] = useState<
    databaseMumeneenFieldData[] | []
  >([]);
  const [fileFields, setFileFields] = useState<
    databaseMumeneenFieldData[] | []
  >([]);

  useEffect(() => {
    changeSelectedSidebarKey("3");
    toggleLoader(true);
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
      } else {
        getMumeneenDataFields((data: databaseMumeneenFieldData[]) => {
          setMumeneenFields(data);
        });
        getFileDataFields((data: databaseMumeneenFieldData[]) => {
          setFileFields(data);
        });
        getSectorList((data: sectorData[]) => {
          setSectorDetails(data);
        });
        getSubSectorList((data: subSectorData[]) => {
          setSubsectorDetails(data);
        });
      }
    } else {
      notVerifierUserLogout();
    }
    toggleLoader(false);
  }, []);

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const handleSyncUsersFromAirtable = async () => {
    toggleLoader(true);
    const mongoOldUserList = await await fetch(API.userList, {
      method: "GET",
      headers: {...getauthToken()},
    })
      .then(handleResponse)
      .catch((error) => {
        toggleLoader(false);
        message.error(error);
      });

    if (mongoOldUserList && mongoOldUserList.length > 0) {
      await Promise.all(
        mongoOldUserList.map(async (val: authUser) => {
          await fetch(API.user, {
            method: "DELETE",
            headers: {...getauthToken()},
            body: JSON.stringify({id: val._id}),
          })
            .then(handleResponse)
            .catch((error) => {
              toggleLoader(false);
              message.error(error);
            });
        })
      );
    }

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
    await Promise.all(
      data.map(async (val) => {
        const userdbdata = {
          itsId: val.itsId,
          name: val.name,
          contact: val.contact,
          password: val.password,
          email: val.email ? val.email : "",
          userRole: val.userRole ? val.userRole : [],
          assignedArea: val.assignedArea ? val.assignedArea : [],
          assignedUmoor: val.assignedUmoor ? val.assignedUmoor : [],
        };
        await fetch(API.user, {
          method: "POST",
          headers: {...getauthToken()},
          body: JSON.stringify(userdbdata),
        })
          .then(handleResponse)
          .catch((error) => {
            toggleLoader(false);
            message.error(error);
          });
      })
    );
    toggleLoader(false);
  };

  const handleSyncUmoorsFromAirtable = async () => {
    toggleLoader(true);

    const oldUmoorList = await getUmoorList();

    if (oldUmoorList && oldUmoorList.length > 0) {
      await Promise.all(
        oldUmoorList.map(async (val: any) => {
          await fetch(API.umoor, {
            method: "DELETE",
            headers: {...getauthToken()},
            body: JSON.stringify({id: val._id}),
          })
            .then(handleResponse)
            .catch((error) => message.error(error));
        })
      );
    }

    const airtableUmoorList: any[] = [];

    await umoorTable
      .select({
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            airtableUmoorList.push(record.fields);
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          addAirtableUmoorsToDb(airtableUmoorList);
        }
      );
  };

  const addAirtableUmoorsToDb = async (data: any[]) => {
    await Promise.all(
      data.map(async (val) => {
        const umoordbdata = {
          value: val.value,
          label: val.label,
        };
        await fetch(API.umoor, {
          method: "POST",
          headers: {...getauthToken()},
          body: JSON.stringify(umoordbdata),
        })
          .then(handleResponse)
          .catch((error) => message.error(error));
      })
    );
    toggleLoader(false);
  };

  const handleEscalationFormSubmit = async () => {
    getSubSectorList(async (subsector: subSectorData[]) => {
      const umoorArr = [
        {label: "Ashara Ohbat - Maqhsoos", value: "maqhsoos"},
        {label: "Dua Araz", value: "dua"},
        {label: "Housing", value: "housing"},
      ];

      const escalations = escData.map((value) => {
        const index = findIndex(subsector, {
          name: value.sub_sector.toUpperCase(),
        });
        const firstComment: comment = {
          msg: "Issue is added on " + moment(new Date()).format("DD-MM-YYYY"),
          name: "Mulla Ebrahim bhai Shaikh Saifuddin bhai Attarwala",
          contact_number: "+919820903152",
          userRole: "Admin",
          time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
        };
        const comment: comment = {
          msg: value["Final Comments"],
          name: "Mulla Ebrahim bhai Shaikh Saifuddin bhai Attarwala",
          contact_number: "+919820903152",
          userRole: "Admin",
          time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
        };
        const escIndex = findIndex(umoorArr, {value: value.value});
        const escalationIssueType = umoorArr[escIndex];
        return {
          ...defaultDatabaseFields,
          created_by: {
            name: "Mulla Ebrahim bhai Shaikh Saifuddin bhai Attarwala",
            its_number: "30400068",
            contact_number: "+919820903152",
            userRole: "Admin",
          },
          file_details: {
            tanzeem_file_no: Number(value["File No"]),
            address: value.Address,
            sub_sector: {
              name: subsector[index].name,
              sector: subsector[index].sector,
            },
            hof_its: value["HOF ID"].toString(),
            hof_name: value["HOF Name"],
            hof_contact: value["HOF Contact"],
          },
          status: escalationStatus.ISSUE_REPORTED,
          issue: value["Escalation Title"],
          type: escalationIssueType,
          comments: [firstComment, comment],
          escalation_id: value["Unique ID"],
          issueRaisedFor: {
            ITS: value["ITS ID"].toString(),
            name: value.Fullname,
            contact: value.Phone,
          },
        };
      });

      await fetch(API.escalationList, {
        method: "PUT",
        body: JSON.stringify(escalations),
        headers: {...getauthToken()},
      })
        .then(handleResponse)
        .catch((error) => message.error(error.message));

      console.log(escalations);
    });
  };

  return (
    <Dashboardlayout headerTitle="Admin Settings">
      <Row className="mb-30" gutter={[{xs: 8, lg: 12}, 16]}>
        <Col xs={12}>
          <UploadExcelFileCard />
        </Col>
        <Col xs={12}>
          <Card className="border-radius-10" title="Sync Settings">
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Button onClick={handleSyncUsersFromAirtable} type="primary">
                  Sync Users
                </Button>
              </Col>
              <Col xs={12}>
                <Button onClick={handleSyncUmoorsFromAirtable} type="primary">
                  Sync Umoorlist
                </Button>
              </Col>
              <Col xs={12}>
                <Button onClick={handleEscalationFormSubmit} type="primary">
                  Add Escalations
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[{xs: 8, lg: 12}, 16]}>
        <Col xs={12}>
          <MumeneenDataFieldTable
            data={mumeneenFields}
            updateData={(data) => setMumeneenFields(data)}
          />
        </Col>
        <Col xs={12}>
          <FileDataFieldTable
            data={fileFields}
            updateData={(data) => setFileFields(data)}
          />
        </Col>
        <Col xs={24}>
          <SectorDetailsComponent
            data={sectorDetails}
            updateData={(data) => setSectorDetails(data)}
          />
        </Col>
        <Col xs={24}>
          <SubSectorDetailsComponent
            data={subsectorDetails}
            updateData={(data) => setSubsectorDetails(data)}
          />
        </Col>
      </Row>
    </Dashboardlayout>
  );
};

export default AdminSettings;
