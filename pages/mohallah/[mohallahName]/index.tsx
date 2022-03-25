import {Col, Row} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGlobalContext} from "../../../context/GlobalContext";
import {Dashboardlayout} from "../../../layouts/dashboardLayout";
import {sectorData, subSectorData} from "../../../types";
import {getSectorDataByName} from "../../api/v1/db/sectorCrud";
import {getSubSectorData} from "../../api/v1/db/subSectorCrud";
import {
  DistanceCard,
  InchargeDetailsCard,
  SubSectorCard,
} from "../../../components";
import {isEmpty} from "lodash";

const SingleMohallah: NextPage = () => {
  const router = useRouter();
  const {mohallahName} = router.query;
  const {toggleLoader} = useGlobalContext();

  const [mohallahDetails, setMohallahDetails] = useState<sectorData>(
    {} as sectorData
  );

  const [mohallahSubSectorsDetails, setMohallahSubSectorsDetails] = useState<
    subSectorData[]
  >([]);

  const getSectorDetails = async () => {
    toggleLoader(true);
    const sectorDetails = await getSectorDataByName(mohallahName as string);
    if (!isEmpty(sectorDetails)) {
      toggleLoader(false);
      setMohallahDetails(sectorDetails);
    } else {
      toggleLoader(false);
      router.push("/");
    }
  };

  const getSubSectorDetails = async () => {
    toggleLoader(true);
    if (
      !mohallahDetails ||
      !mohallahDetails.sub_sector_id ||
      mohallahDetails.sub_sector_id.length < 1
    ) {
      toggleLoader(false);
      setMohallahSubSectorsDetails([]);
    } else {
      const subSectorDetails = await Promise.all(
        mohallahDetails.sub_sector_id.map(async (value) => {
          return await getSubSectorData(value);
        })
      );
      setMohallahSubSectorsDetails(subSectorDetails);
      toggleLoader(false);
    }
  };

  const redirectToSubsector = (name: string) => {
    router.push("/mohallah/" + mohallahName + "/" + name);
  };

  useEffect(() => {
    if (mohallahName) {
      getSectorDetails();
    }
  }, [mohallahName]);

  useEffect(() => {
    if (
      mohallahDetails &&
      mohallahDetails.sub_sector_id &&
      mohallahDetails.sub_sector_id.length > 0
    ) {
      getSubSectorDetails();
    }
  }, [mohallahDetails]);

  return (
    <Dashboardlayout
      backgroundColor={mohallahDetails.secondary_color || "#efefef"}
      headerTitle={mohallahDetails.name || ""}
    >
      <div>
        {!isEmpty(mohallahDetails) ? (
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
            <Col className="d-flex" xs={24} sm={12} lg={8} xl={6}>
              <DistanceCard
                backgroundColor={mohallahDetails.primary_color}
                distance="0.1 KM"
                eta="1 Minute"
              />
            </Col>
          </Row>
        ) : null}

        {mohallahSubSectorsDetails.length > 0 ? (
          <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 16]}>
            {mohallahSubSectorsDetails.map((value) => (
              <Col key={value.id} xs={24} sm={12} lg={8} xl={6}>
                <SubSectorCard
                  handleClick={() => redirectToSubsector(value.name)}
                  musaidName={value.musaid_name}
                  musaidaName={value.musaida_name}
                  distance="0.1 KM"
                  eta="1 Minute"
                  cardHeading={value.name}
                  backgroundColor={mohallahDetails.primary_color}
                  number_of_females={value.no_of_females as number}
                  number_of_males={value.no_of_males as number}
                />
              </Col>
            ))}
          </Row>
        ) : null}
      </div>
    </Dashboardlayout>
  );
};

export default SingleMohallah;
