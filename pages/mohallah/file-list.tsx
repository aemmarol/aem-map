import {Layout, Row, Col, Table} from "antd";
import {NextPage} from "next";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import styles from "../../styles/FileList.module.scss";

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

  const dataSource = [
    {
      hof_id: 30336264,
      tanzeem_file_no: 1064,
      address: "204, Burj Burhan Apartments, Saifee Park, Marol",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 50414641,
      tanzeem_file_no: 1139,
      address:
        "604, Burj Burhan, Saifee Park, Church Rd, Marol, Andheri(E), Mumbai 400059",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 50465105,
      tanzeem_file_no: 1180,
      address: "102-Burj Burhan, Saifee Park, Marol",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 20431953,
      tanzeem_file_no: 1264,
      address:
        "704, Burj Burhan, Saifee Park, Marol, Andheri East, Mumbai 400059",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 50474003,
      tanzeem_file_no: 1272,
      address: "1002 Burj Burhan",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 40455658,
      tanzeem_file_no: 1337,
      address: "107, Burj Burhan. Saifee Park. Church Road.",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 30372264,
      tanzeem_file_no: 1346,
      address: "103, Burj Burhan Saifee Park",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 30400059,
      tanzeem_file_no: 1421,
      address:
        "104, Burj Burhan, Saifee Park, Church Road, Marol, Andheri ( East).",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 50407010,
      tanzeem_file_no: 1441,
      address: "Burj Burhan, 107 Saifee Park",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 30312674,
      tanzeem_file_no: 147,
      address:
        "Burj Burhan 105, Saifee Park, Church Rd, Marol ,Andheri East .Mumbai 400059",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 20421004,
      tanzeem_file_no: 150,
      address:
        "502, Burj Burhan, Saifee Park, Church Road, Marol, Andheri (East)",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 50422769,
      tanzeem_file_no: 1523,
      address:
        "701 Burj Burhan. Saifee Park. Church Road. Marol. Andheri(East)***** SECTOR : BADRI ; SUB SECTOR : BURJ BURHAN****",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 50422817,
      tanzeem_file_no: 1527,
      address:
        "702, Burj Burhan, Saifee Park, Churchroad, Marol, Andheri East, Mumbai 400059",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 20343645,
      tanzeem_file_no: 1571,
      address: "804, Burj Burhan, Saifee Park, Church Road,",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 20331560,
      tanzeem_file_no: 1585,
      address: "307, Burj Burhan, Saifee Park, Church Road, Marol",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 20306370,
      tanzeem_file_no: 1601,
      address:
        "405, 4th Floor, Burj Burhan, Saifee Park Colony,Marol Church Road, Andheri(E)",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 30321741,
      tanzeem_file_no: 1609,
      address: "901, Burj Burhan, Saifee Park, Church Road",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 60453613,
      tanzeem_file_no: 1611,
      address:
        "902, Burj Burhan, Saifee Park, Church Road, Marol, Andheri East",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 60453606,
      tanzeem_file_no: 1612,
      address: "802 Burj Burhan",
      address_fmb: "",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
    {
      hof_id: 20396642,
      tanzeem_file_no: 1613,
      address: "207, Burj Burhan",
      address_fmb: "BURJ BURHAN",
      building_fmb: "",
      sub_sector_id: 1,
      muvasat: "",
      thali_takking: "",
      foster: "",
      qaza: "",
    },
  ];

  const columns = [
    {
      title: "HOF ITS",
      dataIndex: "hof_id",
      key: "hof_id",
    },
    {
      title: "File Number",
      dataIndex: "tanzeem_file_no",
      key: "tanzeem_file_no",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Address FMB",
      dataIndex: "address_fmb",
      key: "address_fmb",
    },
    {
      title: "Building FMB",
      dataIndex: "building_fmb",
      key: "building_fmb",
    },
    {
      title: "Thali Taking",
      dataIndex: "thali_takking",
      key: "thali_takking",
    },
    {
      title: "Foster",
      dataIndex: "foster",
      key: "foster",
    },
    {
      title: "Qaza",
      dataIndex: "qaza",
      key: "qaza",
    },
  ];
  return (
    <Dashboardlayout headerTitle="BURJ BURHAN">
      <Layout className={styles.mainWrapper}>
        <Row>
          <Col span={2}>
            <b>Masool:</b>
          </Col>
          <Col span={3}>{data.masool_name}</Col>
          <Col span={3}>{data.masool_its}</Col>
          <Col span={3}>{data.masool_contact_number}</Col>
        </Row>
        <Row>
          <Col span={2}>
            <b>Masoola:</b>
          </Col>
          <Col span={3}>{data.masoola_name}</Col>
          <Col span={3}>{data.masoola_its}</Col>
          <Col span={3}>{data.masoola_contact_number}</Col>
        </Row>
        <Row>
          <Col span={2}>
            <b>Musaid:</b>
          </Col>
          <Col span={3}>{data.musaid_name}</Col>
          <Col span={3}>{data.musaid_its}</Col>
          <Col span={3}>{data.musaid_contact_number}</Col>
        </Row>
        <Row>
          <Col span={2}>
            <b>Musaida:</b>
          </Col>
          <Col span={3}>{data.musaida_name}</Col>
          <Col span={3}>{data.musaida_its}</Col>
          <Col span={3}>{data.musaida_contact_number}</Col>
        </Row>
        <Row>
          <Col span={2}>
            <b>Distance:</b>
          </Col>
          <Col span={3}>0.25 KM</Col>
          <Col span={3}>1 Minute</Col>
        </Row>

        <Table
          dataSource={dataSource}
          columns={columns}
          className={styles.table}
        />
      </Layout>
    </Dashboardlayout>
  );
};

export default FileList;
