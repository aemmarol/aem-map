import {Col, message, Row} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGlobalContext} from "../../../context/GlobalContext";
import {Dashboardlayout} from "../../../layouts/dashboardLayout";
import {authUser, sectorData, subSectorData, userRoles} from "../../../types";
import {InchargeDetailsCard, SubSectorCard} from "../../../components";
import {isEmpty} from "lodash";
import {logout, verifyUser} from "../../api/v1/authentication";
import {getSectorDataByName} from "../../api/v2/services/sector";
import {getSubSectorData} from "../../api/v2/services/subsector";

const SingleMohallah: NextPage = () => {
  const router = useRouter();
  const {mohallahName} = router.query;
  const {toggleLoader, changeSelectedSidebarKey, center} = useGlobalContext();

  const [mohallahDetails, setMohallahDetails] = useState<sectorData>(
    {} as sectorData
  );

  const [mohallahSubSectorsDetails, setMohallahSubSectorsDetails] = useState<
    subSectorData[]
  >([]);

  const [userDetails, setUserDetails] = useState<authUser>({} as authUser);

  const getSectorDetails = async () => {
    toggleLoader(true);
    await getSectorDataByName(mohallahName as string, (data: sectorData) => {
      if (!isEmpty(data)) {
        toggleLoader(false);
        setMohallahDetails(data);
      } else {
        toggleLoader(false);
        router.push("/");
      }
    });
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
          let subSecData: subSectorData = {} as subSectorData;
          await getSubSectorData(value, (data: subSectorData) => {
            subSecData = data;
          });
          return subSecData;
        })
      );
      setMohallahSubSectorsDetails(
        subSectorDetails.filter((val) => typeof val === "object")
      );
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
      changeSelectedSidebarKey("1");
      if (typeof verifyUser() !== "string") {
        const user = verifyUser() as authUser;
        const {userRole, assignedArea} = user;
        setUserDetails(user);
        if (
          userRole.includes(userRoles.Admin) ||
          (userRole.includes(userRoles.Masool) &&
            assignedArea.includes(mohallahName as string)) ||
          (userRole.includes(userRoles.Masoola) &&
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
      showBackButton={
        userDetails.userRole && userDetails.userRole.includes(userRoles.Admin)
      }
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
            {/* <Col className="d-flex" xs={24} sm={12} lg={8} xl={6}>
              <DistanceCard
                backgroundColor={mohallahDetails.primary_color}
                distance="0.1 KM"
                eta="1 Minute"
              />
            </Col> */}
          </Row>
        ) : null}

        {mohallahSubSectorsDetails.length > 0 ? (
          <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 16]}>
            {mohallahSubSectorsDetails.map((mohallahSubSectorsDetail) => (
              <Col
                key={mohallahSubSectorsDetail._id}
                xs={24}
                sm={12}
                lg={8}
                xl={6}
              >
                <SubSectorCard
                  handleClick={() =>
                    redirectToSubsector(mohallahSubSectorsDetail.name || "-")
                  }
                  musaidName={mohallahSubSectorsDetail.musaid_name || "-"}
                  musaidaName={mohallahSubSectorsDetail.musaida_name || "-"}
                  directionLink={`https://www.google.com/maps/dir/${
                    center.latlng[0]
                  },${center.latlng[1]}/${
                    mohallahSubSectorsDetail.latlng
                      ? mohallahSubSectorsDetail.latlng[0]
                      : ""
                  },${
                    mohallahSubSectorsDetail.latlng
                      ? mohallahSubSectorsDetail?.latlng[1]
                      : ""
                  }/`}
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
