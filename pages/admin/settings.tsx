import {Button, Card, Col, message, Row} from "antd";
import {GetServerSideProps, NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {
  getFileDataFields,
  getMumeneenDataFields,
} from "../api/v1/db/databaseFields";
import {
  authUser,
  databaseMumeneenFieldData,
  sectorData,
  subSectorData,
  umoorData,
  userRoles,
} from "../../types";
import {
  MumeneenDataFieldTable,
  FileDataFieldTable,
  UploadExcelFileCard,
  SectorDetailsComponent,
  SubSectorDetailsComponent,
} from "../../components";
import {getSectorList} from "../api/v1/db/sectorCrud";
import {getSubSectorList} from "../api/v1/db/subSectorCrud";
import {
  addUser,
  deleteUser,
  getUserList,
  logout,
  verifyUser,
} from "../api/v1/authentication";
import {useRouter} from "next/router";
import {useGlobalContext} from "../../context/GlobalContext";
import Airtable from "airtable";
import {addUmoor, deleteUmoor, getUmoorList} from "../api/v1/db/umoorsCrud";

// const escAirtableBase = new Airtable({
//   apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
// }).base("appHju317Ez55YdW0");

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const userTable = airtableBase("userList");
const umoorTable = airtableBase("umoorList");

// const escalationListTable = escAirtableBase("Escalation List");

interface AdminSettingsProps {
  mumeneenDataFields: databaseMumeneenFieldData[];
  fileDataFields: databaseMumeneenFieldData[];
  sectorDetailsData: sectorData[];
  subSectorDetailsList: subSectorData[];
}

const AdminSettings: NextPage<AdminSettingsProps> = ({
  mumeneenDataFields,
  fileDataFields,
  sectorDetailsData,
  subSectorDetailsList,
}) => {
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
  // const [issueTypeOptions, setIssueTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    setMumeneenFields(mumeneenDataFields.map((val) => ({...val, key: val.id})));
    setFileFields(fileDataFields.map((val) => ({...val, key: val.id})));
    setSectorDetails(sectorDetailsData.map((val) => ({...val, key: val.id})));
    setSubsectorDetails(
      subSectorDetailsList.map((val) => ({...val, key: val.id}))
    );
  }, [
    mumeneenDataFields,
    fileDataFields,
    sectorDetailsData,
    subSectorDetailsList,
  ]);

  useEffect(() => {
    changeSelectedSidebarKey("3");
    toggleLoader(true);
    // getUmoorList();
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
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

  // const handleAirtableEscalationSync = async () => {
  //   toggleLoader(true);
  //   const inputEscalationListData: any[] = [];
  //   escalationListTable
  //     .select({
  //       view: "Grid view",
  //       maxRecords: 1000,
  //     })
  //     .eachPage(
  //       function page(records, fetchNextPage) {
  //         inputEscalationListData.push(...records);
  //         fetchNextPage();
  //       },
  //       function done(err) {
  //         if (err) {
  //           console.error(err);
  //           return;
  //         }
  //         addEscalationDataToDb(
  //           inputEscalationListData.map((val) => val.fields)
  //         );
  //       }
  //     );
  // };

  // const createCommentsArr = (
  //   reporter: any,
  //   createdDate: string,
  //   inProcessComment: string,
  //   doneComment: string
  // ) => {
  //   const commentArr: comment[] = [
  //     {
  //       msg: "Issue is added on " + moment(createdDate).format("DD-MM-YYYY"),
  //       name: reporter.full_name,
  //       contact_number: reporter.mobile,
  //       userRole: "SED",
  //       time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  //     },
  //   ];
  //   if (inProcessComment) {
  //     commentArr.push({
  //       msg: inProcessComment,
  //       name: "SED Umoor",
  //       contact_number: "",
  //       userRole: "SED",
  //       time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  //     });
  //   }
  //   if (doneComment) {
  //     commentArr.push({
  //       msg: doneComment,
  //       name: "SED Umoor",
  //       contact_number: "",
  //       userRole: "SED",
  //       time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  //     });
  //   }
  //   return commentArr;
  // };

  // const addEscalationDataToDb = async (data: any[]) => {
  //   const newData = await Promise.all(
  //     data.map(async (val, index) => {
  //       const escFileDetails = await getFileDataByFileNumber(
  //         val["File No."].toString()
  //       );
  //       const reporter = await getMemberDataById(
  //         val["Reported by"] ? val["Reported by"] : "30408608"
  //       );
  //       const escType = find(issueTypeOptions, { label: val.type });
  //       const newComments = createCommentsArr(
  //         reporter,
  //         val["Date of Submission"],
  //         val["Resolution In Process Notes"],
  //         val["Resolved Notes"]
  //       );
  //       const tempEscalation: escalationData = {
  //         escalation_id: "esc-" + (index + 1),
  //         created_by: {
  //           name: reporter.full_name,
  //           its_number: reporter.id,
  //           contact_number: reporter.mobile,
  //           userRole: "SED",
  //         },
  //         file_details: {
  //           tanzeem_file_no: val["File No."],
  //           address:
  //             escFileDetails && escFileDetails.address
  //               ? escFileDetails.address
  //               : "",
  //           sub_sector:
  //             escFileDetails && escFileDetails.sub_sector
  //               ? escFileDetails.sub_sector
  //               : {},
  //           hof_name: val["HOF NAME"],
  //           hof_contact: val["HOF Contact Number"],
  //           hof_its:
  //             escFileDetails && escFileDetails.id ? escFileDetails.id : "",
  //         },
  //         status: val["Status"],
  //         issue: val["Notes"],
  //         comments: newComments,
  //         type: escType,
  //         created_at: moment(val["Date of Submission"]).format(
  //           "DD-MM-YYYY HH:mm:ss"
  //         ),
  //         version: defaultDatabaseFields.version,
  //         updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  //       };
  //       return tempEscalation;
  //     })
  //   );

  //   Promise.all(
  //     newData.map(async (val) => {
  //       await addEscalationData(val);
  //     })
  //   );
  //   toggleLoader(false);
  // };

  const handleSyncUsersFromAirtable = async () => {
    toggleLoader(true);
    const oldUserList = await getUserList();
    await Promise.all(
      oldUserList.map(async (val) => {
        await deleteUser(val.itsId.toString());
      })
    );

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
          userRole: val.userRole ? val.userRole : [],
          assignedArea: val.assignedArea ? val.assignedArea : [],
          assignedUmoor: val.assignedUmoor ? val.assignedUmoor : [],
        };
        await addUser(val.itsId.toString(), userdbdata);
      })
    );
    toggleLoader(false);
  };

  const handleSyncUmoorsFromAirtable = async () => {
    toggleLoader(true);
    const oldUmoorList: umoorData[] = await getUmoorList();
    await Promise.all(
      oldUmoorList.map(async (val) => {
        await deleteUmoor(val.value);
      })
    );

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
        await addUmoor(val.value, umoordbdata);
      })
    );
    toggleLoader(false);
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

export const getServerSideProps: GetServerSideProps<
  AdminSettingsProps
> = async () => {
  const mumeneenDataFields: databaseMumeneenFieldData[] =
    await getMumeneenDataFields();
  const fileDataFields: databaseMumeneenFieldData[] = await getFileDataFields();
  const sectorDetailsData: sectorData[] = await getSectorList();
  const subSectorDetailsList: subSectorData[] = await getSubSectorList();

  return {
    props: {
      mumeneenDataFields,
      fileDataFields,
      sectorDetailsData,
      subSectorDetailsList,
    },
  };
};
