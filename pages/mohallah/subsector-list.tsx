import {ManOutlined, WomanOutlined} from "@ant-design/icons";
import {Space, Card, Row, Col} from "antd";
import Layout from "antd/lib/layout/layout";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import styles from "../../styles/SubSectorList.module.scss";

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
    "musaid_ its": 123456,
    musaid_contact_number: 1234567890,
    musaida_name: "Farida Mandsaurwala",
    musaida_its: 654321,
    "musaida_contact number": 987654321,
  };

  return (
    <Dashboardlayout headerTitle={sector.sector_name}>
      <Layout className={styles.mainWrapper}>
        <Row>
          <Col span={2}>
            <b>Masool:</b>
          </Col>
          <Col span={3}>{sector.masool_name}</Col>
          <Col span={3}>{sector.masool_its}</Col>
          <Col span={3}>{sector.masool_contact_number}</Col>
        </Row>
        <Row>
          <Col span={2}>
            <b>Masoola:</b>
          </Col>
          <Col span={3}>{sector.masoola_name}</Col>
          <Col span={3}>{sector.masoola_its}</Col>
          <Col span={3}>{sector.masoola_contact_number}</Col>
        </Row>
        <Row>
          <Col span={2}>
            <b>Distance:</b>
          </Col>
          <Col span={3}>0.25 KM</Col>
          <Col span={3}>1 Minute</Col>
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
      </Layout>
    </Dashboardlayout>
  );
};

export default SubSectorList;
