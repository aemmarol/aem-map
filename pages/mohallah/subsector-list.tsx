import {Row, Col, Spin} from "antd";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import styles from "../../styles/SubSectorList.module.scss";
import {verifyUser} from "../api/v1/authentication";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {
  FullPageLoader,
  InchargeDetailsCard,
  DistanceCard,
  SubSectorCard,
} from "../../components";

const SubSectorList: NextPage = () => {
  const sector = {
    sector_name: "BADRI MOHALLAH",
    sector_id: 1,
    sub_sectors: [1, 2, 3, 4, 5],
    color_code: "#A9D18E",
    masool_name: "Mulla Yusuf Patanwala",
    masool_its: 123456,
    masool_contact_number: 1234567890,
    masoola_name: "Munira Patanwala",
    masoola_its: 654321,
    masoola_contact_number: 987654321,
  };

  const subsector = {
    sub_sector_name: "BURJ BURHAN",
    sub_sector_id: 1,
    sector_id: 1,
    musaid_name: "Aziz Ahmedabadwala",
    musaid_its: 123456,
    musaid_contact_number: 1234567890,
    musaida_name: "Farida Mandsaurwala",
    musaida_its: 654321,
    musaida_contact_number: 987654321,
  };

  const router = useRouter();

  const [userAuthenticated, setuserAuthenticated] = useState(false);

  useEffect(() => {
    try {
      verifyUser();
      setuserAuthenticated(true);
    } catch (e) {
      console.log("Please Sign In First");
      router.push("/");
    }
  });

  if (userAuthenticated) {
    return (
      <Dashboardlayout
        backgroundColor="#e8f5e9"
        headerTitle={sector.sector_name}
      >
        <div className={styles.mainWrapper}>
          <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
            <Col span={6}>
              <InchargeDetailsCard
                cardTitle="Masool"
                inchargeName={sector.masool_name}
                inchargeIts={sector.masool_its}
                inchargeContactNumber={sector.masool_contact_number}
              />
            </Col>
            <Col span={6}>
              <InchargeDetailsCard
                cardTitle="Masoola"
                inchargeName={sector.masoola_name}
                inchargeIts={sector.masoola_its}
                inchargeContactNumber={sector.masoola_contact_number}
              />
            </Col>
            <Col span={6} className={styles.infoCol}>
              <DistanceCard
                backgroundColor="#A9D18E"
                distance="0.1 KM"
                eta="1 Minute"
              />
            </Col>
            <Col span={6}></Col>
          </Row>

          <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
            <Col span={6}>
              <SubSectorCard
                musaidName={subsector.musaid_name}
                musaidaName={subsector.musaida_name}
                distance="0.1 KM"
                eta="1 Minute"
                cardHeading={subsector.sub_sector_name}
                backgroundColor="#A9D18E"
              />
            </Col>
            <Col span={6}>
              <SubSectorCard
                musaidName={subsector.musaid_name}
                musaidaName={subsector.musaida_name}
                distance="0.1 KM"
                eta="1 Minute"
                cardHeading={subsector.sub_sector_name}
                backgroundColor="#A9D18E"
              />
            </Col>
            <Col span={6}>
              <SubSectorCard
                musaidName={subsector.musaid_name}
                musaidaName={subsector.musaida_name}
                distance="0.1 KM"
                eta="1 Minute"
                cardHeading={subsector.sub_sector_name}
                backgroundColor="#A9D18E"
              />
            </Col>
            <Col span={6}>
              <SubSectorCard
                musaidName={subsector.musaid_name}
                musaidaName={subsector.musaida_name}
                distance="0.1 KM"
                eta="1 Minute"
                cardHeading={subsector.sub_sector_name}
                backgroundColor="#A9D18E"
              />
            </Col>
            <Col span={6}>
              <SubSectorCard
                musaidName={subsector.musaid_name}
                musaidaName={subsector.musaida_name}
                distance="0.1 KM"
                eta="1 Minute"
                cardHeading={subsector.sub_sector_name}
                backgroundColor="#A9D18E"
              />
            </Col>
          </Row>
        </div>
      </Dashboardlayout>
    );
  } else {
    return <FullPageLoader />;
  }
};

export default SubSectorList;
