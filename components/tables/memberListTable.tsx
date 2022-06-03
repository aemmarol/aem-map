import { FC, useEffect, useState } from "react";
import { Card, Col, message, Row, Table } from "antd";
import styles from "../../styles/components/tables/fileListTable.module.scss";
import { getMumeneenDataFields } from "../../pages/api/v1/db/databaseFields";
import { useGlobalContext } from "../../context/GlobalContext";
import { useRouter } from "next/router";
import { logout, verifyUser } from "../../pages/api/v1/authentication";
import { authUser } from "../../types";
import { getMumineenTableUserColumns } from "./columnsUtil";
import useWindowDimensions from "../../utils/windowDimensions";
import { EscStat } from "../custom/escalations/escalationStatus";
import sampleMemberList from "../../sample_data/mumeneenDataField.json";

interface TableProps {
  dataSource: any[];
}

export const MemberListTable: FC<TableProps> = ({ dataSource }) => {

  const [columns, setcolumns] = useState<any[]>([]);

  const { toggleLoader } = useGlobalContext();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const columnOrderList = sampleMemberList.map(val => val.name)

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };
  const getFileTableColumns = async () => {
    toggleLoader(true);
    let userRole;
    if (typeof verifyUser() !== "string") {
      const user = verifyUser() as authUser;
      userRole = user.userRole[0];
    } else {
      notVerifierUserLogout();
    }
    const fieldData = await getMumeneenDataFields();
    let dataColumns = [];
    const dataColumnsMap: any = {
      id: {
        title: "ITS",
        dataIndex: "id",
        key: "id",
        width: 150,
        fixed: "left",
      },
    };

    sampleMemberList.forEach((val) => {
      dataColumnsMap[val.name] = {
        title: val.label,
        dataIndex: val.name,
        width:
          val.name === "address" ||
            val.name === "address_fmb" ||
            val.name === "building_fmb"
            ? 250
            : 150,
        key: val.name,
      };
    });

    fieldData
      .filter((val) => val.name !== "tanzeem_file_no")
      .filter(val=> !columnOrderList.includes(val.name))
      .forEach((val) => {
        dataColumnsMap[val.name] = {
          title: val.label,
          dataIndex: val.name,
          width:
            val.name === "address" ||
              val.name === "address_fmb" ||
              val.name === "building_fmb"
              ? 250
              : 150,
          key: val.name,
        };
      });
    if (userRole) {
      const userColumns = getMumineenTableUserColumns(userRole);
      if (userColumns && userColumns.length > 0) {
        dataColumns = userColumns.map((column) => dataColumnsMap[column]);
      } else {
        dataColumns = Object.keys(dataColumnsMap).map(
          (column) => dataColumnsMap[column]
        );
      }
    }
    setcolumns(dataColumns);
    toggleLoader(false);
  };

  useEffect(() => {
    getFileTableColumns();
  }, []);

  if (width && width >= 991) {
    return (
      <Table
        dataSource={dataSource.map((val) => ({ ...val, key: val.id }))}
        columns={columns}
        className={styles.fileListTable}
        pagination={false}
        scroll={{ x: "150px", y: "500px" }}
      />
    );
  }

  return (
    <div>
      <h1>Members : </h1>
      <Row gutter={[16, 16]}>
        {dataSource.map((val) => (
          <Col key={val.id} xs={24} md={12}>
            <Card className="border-radius-10">
              <Row gutter={[16, 16]}>
                {columns.map((data) => (
                  <Col
                    key={data.dataIndex}
                    xs={
                      data.dataIndex === "email" ||
                        data.dataIndex === "full_name" ||
                        data.dataIndex === "mobile" ||
                        data.dataIndex === "hof_name"
                        ? 24
                        : 12
                    }
                  >
                    <EscStat
                      label={data.title}
                      value={val[data.dataIndex] ? val[data.dataIndex] : "-"}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
