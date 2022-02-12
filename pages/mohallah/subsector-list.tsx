import {ManOutlined, WomanOutlined} from "@ant-design/icons";
import {Space, Card, Row, Col} from "antd";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import styles from "../../styles/SubSectorList.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {InchargeDetailsCard} from "../../components/cards/inchargeDetailsCard";

import {faLocationDot} from "@fortawesome/free-solid-svg-icons";

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

  return (
    <Dashboardlayout backgroundColor="#e8f5e9" headerTitle={sector.sector_name}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <InchargeDetailsCard
            cardTitle="Masool"
            inchargeName={sector.masool_name}
            inchargeIts={sector.masool_its}
            inchargeContactNumber={sector.masool_contact_number}
          ></InchargeDetailsCard>
        </Col>
        <Col span={6}>
          <InchargeDetailsCard
            cardTitle="Masool"
            inchargeName={sector.masool_name}
            inchargeIts={sector.masool_its}
            inchargeContactNumber={sector.masool_contact_number}
          ></InchargeDetailsCard>
        </Col>
        <Col span={6}>
          <Card className={styles.distanceCard}>
            <div className={styles.distanceCardContent}>
              <div>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className={styles.locationIcon}
                />
              </div>
              <span>
                0.1 KM <br />1 Minute
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}></Col>
      </Row>

      <Space className={styles.subSectorCardsWrapper}>
        <Card className={styles.subSectorCard} bodyStyle={{padding: "0"}}>
          <div className={styles.cardContent}>
            <h2 className={styles.cardHeading}>Burj Burhan</h2>
            <ul>
              <li>
                <b>Musaid:</b> {subsector.musaid_name}
              </li>
              <li>
                <b>Musaida:</b> {subsector.musaid_name}
              </li>
              <li>
                <b>Distance:</b> 0.25km/1 Minute
              </li>
            </ul>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.footerContent}>
              <p>Total Mumineen</p>
              <Space className={styles.personCount} size={20}>
                <ManOutlined />
                100
                <WomanOutlined />
                100
              </Space>
            </div>
          </div>
        </Card>
      </Space>
    </Dashboardlayout>
  );
};

export default SubSectorList;
