import {Col, Row} from "antd";
import {GetServerSideProps, NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {
  getFileDataFields,
  getMumeneenDataFields,
} from "../api/v1/db/databaseFields";
import {databaseMumeneenFieldData, sectorData} from "../../types";
import {
  MumeneenDataFieldTable,
  FileDataFieldTable,
  UploadExcelFileCard,
  SectorDetailsComponent,
} from "../../components";

import {getSectorData} from "../api/v1/db/sectorCrud";

interface AdminSettingsProps {
  mumeneenDataFields: databaseMumeneenFieldData[];
  fileDataFields: databaseMumeneenFieldData[];
  sectorDetailsData: sectorData[];
}

const AdminSettings: NextPage<AdminSettingsProps> = ({
  mumeneenDataFields,
  fileDataFields,
  sectorDetailsData,
}) => {
  const [sectorDetails, setSectorDetails] = useState<sectorData[] | []>([]);
  const [mumeneenFields, setMumeneenFields] = useState<
    databaseMumeneenFieldData[] | []
  >([]);
  const [fileFields, setFileFields] = useState<
    databaseMumeneenFieldData[] | []
  >([]);

  useEffect(() => {
    setMumeneenFields(mumeneenDataFields);
    setFileFields(fileDataFields);
    setSectorDetails(sectorDetailsData);
  }, [mumeneenDataFields, fileDataFields, sectorDetailsData]);

  return (
    <Dashboardlayout headerTitle="Admin Settings">
      <Row className="mb-30" gutter={[{xs: 8, lg: 12}, 16]}>
        <Col xs={12}>
          <UploadExcelFileCard />
        </Col>
        <Col xs={12}>{/* <VersionSettingsCard/> */}</Col>
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
  const sectorDetailsData: sectorData[] = await getSectorData();

  return {props: {mumeneenDataFields, fileDataFields, sectorDetailsData}};
};
