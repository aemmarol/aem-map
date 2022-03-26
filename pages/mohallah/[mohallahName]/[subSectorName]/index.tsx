import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGlobalContext} from "../../../../context/GlobalContext";
import {Dashboardlayout} from "../../../../layouts/dashboardLayout";
import {sectorData, subSectorData} from "../../../../types";
import {getSubSectorDataByName} from "../../../api/v1/db/subSectorCrud";
import {isEmpty} from "lodash";
import {getFileData} from "../../../api/v1/db/fileCrud";
import styles from "../../../../styles/FileList.module.scss";
import {Col, Row} from "antd";
import {
  DistanceCard,
  InchargeDetailsCard,
  SubSectorFileListTable,
} from "../../../../components";
import {getSectorData} from "../../../api/v1/db/sectorCrud";

const SingleMohallah: NextPage = () => {
  const router = useRouter();
  const {subSectorName} = router.query;
  const {toggleLoader} = useGlobalContext();

  const [mohallahDetails, setMohallahDetails] = useState<sectorData>(
    {} as sectorData
  );

  const [mohallahSubSectorsDetails, setMohallahSubSectorsDetails] =
    useState<subSectorData>({} as subSectorData);

  const [fileDetails, setFileDetails] = useState<any[]>([]);

  const getSubSectorDetails = async () => {
    toggleLoader(true);
    const subsectorDetails = await getSubSectorDataByName(
      subSectorName as string
    );
    if (!isEmpty(subsectorDetails)) {
      const sectorInfo = await getSectorData(
        subsectorDetails.sector.id as string
      );
      setMohallahDetails(sectorInfo);
      toggleLoader(false);
      setMohallahSubSectorsDetails(subsectorDetails);
    } else {
      toggleLoader(false);
      router.push("/");
    }
  };

  const getFileDetails = async () => {
    toggleLoader(true);
    if (
      !mohallahSubSectorsDetails ||
      !mohallahSubSectorsDetails.files ||
      mohallahSubSectorsDetails.files.length < 1
    ) {
      toggleLoader(false);
      setFileDetails([]);
    } else {
      const fileList = await Promise.all(
        mohallahSubSectorsDetails.files.map(async (value) => {
          return await getFileData(value);
        })
      );
      setFileDetails(
        fileList.map((val) => ({
          ...val,
          no_family_members: val.member_ids.length,
        }))
      );
      toggleLoader(false);
    }
  };

  useEffect(() => {
    if (subSectorName) {
      getSubSectorDetails();
    }
  }, [subSectorName]);

  useEffect(() => {
    if (
      mohallahSubSectorsDetails &&
      mohallahSubSectorsDetails.files &&
      mohallahSubSectorsDetails.files.length > 0
    ) {
      getFileDetails();
    }
  }, [mohallahSubSectorsDetails]);

  return (
    <Dashboardlayout
      backgroundColor={mohallahDetails.secondary_color || "#efefef"}
      headerTitle={subSectorName as string}
    >
      <div className={styles.mainWrapper}>
        <Row className="mb-16" gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 16]}>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <InchargeDetailsCard
              cardTitle="Masool"
              inchargeName={mohallahDetails.masool_name}
              inchargeIts={mohallahDetails.masool_its}
              inchargeContactNumber={mohallahDetails.masool_contact}
            />
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <InchargeDetailsCard
              cardTitle="Masoola"
              inchargeName={mohallahDetails.masoola_name}
              inchargeIts={mohallahDetails.masoola_its}
              inchargeContactNumber={mohallahDetails.masoola_contact}
            />
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6} className={styles.infoCol}>
            <DistanceCard
              backgroundColor={mohallahDetails.primary_color}
              distance="0.1 KM"
              eta="1 Minute"
            />
          </Col>
          <Col xs={0} sm={0} lg={0} xl={6}></Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <InchargeDetailsCard
              cardTitle="Musaid"
              inchargeName={mohallahSubSectorsDetails.musaid_name}
              inchargeIts={mohallahSubSectorsDetails.musaid_its}
              inchargeContactNumber={mohallahSubSectorsDetails.musaid_contact}
            />
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <InchargeDetailsCard
              cardTitle="Musaida"
              inchargeName={mohallahSubSectorsDetails.musaida_name}
              inchargeIts={mohallahSubSectorsDetails.musaida_its}
              inchargeContactNumber={mohallahSubSectorsDetails.musaida_contact}
            />
          </Col>
        </Row>
        <SubSectorFileListTable dataSource={fileDetails} />
      </div>
    </Dashboardlayout>
  );
};

export default SingleMohallah;
