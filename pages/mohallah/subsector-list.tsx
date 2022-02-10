import {ManOutlined, WomanOutlined} from "@ant-design/icons";
import {Space, Card, Row, Col} from "antd";
import Layout from "antd/lib/layout/layout";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import styles from "../../styles/SubSectorList.module.scss";

const SubSectorList: NextPage = () => {
  return (
    <Dashboardlayout headerTitle="Badri Mohallah">
      <Layout className={styles.mainWrapper}>
        <Row>
          <Col span={2}>
            <b>Masool:</b>
          </Col>
          <Col span={3}>Mulla Yusuf Patanwala</Col>
          <Col span={3}>123456</Col>
          <Col span={3}>1234567890</Col>
        </Row>
        <Row>
          <Col span={2}>
            <b>Masoola:</b>
          </Col>
          <Col span={3}>Farida Patanwala</Col>
          <Col span={3}>123456</Col>
          <Col span={3}>1234567890</Col>
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
                  <b>Musaid:</b> Aziz Ahmedabadwala
                </li>
                <li>
                  <b>Musaida:</b> Farida Mandsaurwala
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
