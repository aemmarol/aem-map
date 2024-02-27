import {Col, message, Row} from "antd";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";

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
  UmoorListComponent,
} from "../../components";
import {logout, verifyUser} from "../api/v1/authentication";
import {useRouter} from "next/router";
import {useGlobalContext} from "../../context/GlobalContext";
import {
  getFileDataFields,
  getMumeneenDataFields,
} from "../api/v2/services/dbFields";
import {getSectorList} from "../api/v2/services/sector";
import {getSubSectorList} from "../api/v2/services/subsector";
import { getUmoorList } from "../api/v2/services/umoor";

const AdminSettings: NextPage = () => {
  const router = useRouter();
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();

  const [sectorDetails, setSectorDetails] = useState<sectorData[] | []>([]);
  const [umoorDetails, setumoorDetails] = useState<umoorData[] | []>([]);
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
        getUmoorList().then((data)=>{
          setumoorDetails(data)
        })
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

        <Col xs={12}>
          <UmoorListComponent
            data={umoorDetails}
            updateData={(data)=>setumoorDetails(data)}
          />
        </Col>
      </Row>
    </Dashboardlayout>
  );
};

export default AdminSettings;
