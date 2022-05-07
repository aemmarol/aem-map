import {Button, Col, message, Row} from "antd";
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
import {logout, verifyUser} from "../api/v1/authentication";
import {useRouter} from "next/router";
import {useGlobalContext} from "../../context/GlobalContext";
import {createDbSettings} from "../api/v1/settings";

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
    changeSelectedSidebarKey("0");
    toggleLoader(true);
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes("Admin")) {
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

  return (
    <Dashboardlayout headerTitle="Admin Settings">
      <Row className="mb-30" gutter={[{xs: 8, lg: 12}, 16]}>
        <Col xs={12}>
          <UploadExcelFileCard />
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
