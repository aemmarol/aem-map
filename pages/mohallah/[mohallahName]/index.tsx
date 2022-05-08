import {Col, message, Row} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGlobalContext} from "../../../context/GlobalContext";
import {Dashboardlayout} from "../../../layouts/dashboardLayout";
import {authUser, sectorData, subSectorData} from "../../../types";
import {getSectorDataByName} from "../../api/v1/db/sectorCrud";
import {getSubSectorData} from "../../api/v1/db/subSectorCrud";
import {
  Backbutton,
  DistanceCard,
  InchargeDetailsCard,
  SubSectorCard,
} from "../../../components";
import {isEmpty} from "lodash";
import {logout, verifyUser} from "../../api/v1/authentication";

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

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  useEffect(() => {
    if (mohallahName) {
      if (typeof verifyUser() !== "string") {
        const {userRole, assignedArea} = verifyUser() as authUser;
        if (
          userRole.includes("Admin") ||
          (userRole.includes("Masool") &&
            assignedArea.includes(mohallahName as string)) ||
          (userRole.includes("Masoola") &&
            assignedArea.includes(mohallahName as string))
        ) {
          getSectorDetails();
        } else {
          notVerifierUserLogout();
        }
      } else {
        notVerifierUserLogout();
      }
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
            <Col>
              <Backbutton
                backgroundColor={mohallahDetails.primary_color || "#1890ff"}
              />
            </Col>
          </Row>
        ) : null}

        {mohallahSubSectorsDetails.length > 0 ? (
          <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 16]}>
            {mohallahSubSectorsDetails.map((mohallahSubSectorsDetail) => (
              <Col
                key={mohallahSubSectorsDetail.id}
                xs={24}
                sm={12}
                lg={8}
                xl={6}
              >
                <SubSectorCard
                  handleClick={() =>
                    redirectToSubsector(mohallahSubSectorsDetail.name)
                  }
                  musaidName={mohallahSubSectorsDetail.musaid_name}
                  musaidaName={mohallahSubSectorsDetail.musaida_name}
                  distance="0.1 KM"
                  eta="1 Minute"
                  cardHeading={mohallahSubSectorsDetail.name}
                  backgroundColor={mohallahDetails.primary_color}
                  number_of_females={
                    mohallahSubSectorsDetail.no_of_females as number
                  }
                  number_of_males={
                    mohallahSubSectorsDetail.no_of_males as number
                  }
                  number_of_files={
                    mohallahSubSectorsDetail.files?.length as number
                  }
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
