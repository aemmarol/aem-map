import {Row, Col} from "antd";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import styles from "../../styles/FileList.module.scss";
import {InchargeDetailsCard} from "../../components/cards/inchargeDetailsCard";
import {DistanceCard} from "../../components/cards/distanceCard";
import {FileListTable} from "../../components/tables";

const FileList: NextPage = () => {
  const data = {
    masool_name: "Mulla Yusuf Patanwala",
    masool_its: 123456,
    masool_contact_number: 1234567890,
    masoola_name: "Munira Patanwala",
    masoola_its: 654321,
    masoola_contact_number: 987654321,
    musaid_name: "Aziz Ahmedabadwala",
    musaid_its: 123456,
    musaid_contact_number: 1234567890,
    musaida_name: "Farida Mandsaurwala",
    musaida_its: 654321,
    musaida_contact_number: 987654321,
  };

  return (
    <Dashboardlayout headerTitle="BURJ BURHAN" backgroundColor="#e8f5e9">
      <div className={styles.mainWrapper}>
        <Row gutter={16}>
          <Col span={4}>
            <InchargeDetailsCard
              cardTitle="Masool"
              inchargeName={data.masool_name}
              inchargeIts={data.masool_its}
              inchargeContactNumber={data.masool_contact_number}
            />
          </Col>
          <Col span={4}>
            <InchargeDetailsCard
              cardTitle="Masoola"
              inchargeName={data.masoola_name}
              inchargeIts={data.masoola_its}
              inchargeContactNumber={data.masoola_contact_number}
            />
          </Col>
          <Col span={4}>
            <InchargeDetailsCard
              cardTitle="Musaid"
              inchargeName={data.musaid_name}
              inchargeIts={data.musaid_its}
              inchargeContactNumber={data.musaid_contact_number}
            />
          </Col>
          <Col span={4}>
            <InchargeDetailsCard
              cardTitle="Musaida"
              inchargeName={data.musaida_name}
              inchargeIts={data.musaida_its}
              inchargeContactNumber={data.musaida_contact_number}
            />
          </Col>
          <Col span={4} className={styles.infoCol}>
            <DistanceCard
              backgroundColor="#A9D18E"
              distance="0.1 KM"
              eta="1 Minute"
            />
          </Col>
          <Col span={4} />
        </Row>
        <FileListTable />
      </div>
    </Dashboardlayout>
  );
};

export default FileList;
