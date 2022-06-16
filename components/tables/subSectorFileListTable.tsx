import {FC, useEffect, useState} from "react";
import {Card, Col, message, Row, Table} from "antd";
import styles from "../../styles/components/tables/fileListTable.module.scss";
import {useGlobalContext} from "../../context/GlobalContext";
import {useRouter} from "next/router";
import {logout, verifyUser} from "../../pages/api/v1/authentication";
import {authUser, databaseMumeneenFieldData} from "../../types";
import {getFileTableUserColumns} from "./columnsUtil";
import useWindowDimensions from "../../utils/windowDimensions";
import {EscStat} from "../custom/escalations/escalationStatus";
import {getFileDataFields} from "../../pages/api/v2/services/dbFields";

interface TableProps {
  dataSource: any[];
}

export const SubSectorFileListTable: FC<TableProps> = ({dataSource}) => {
  const [columns, setcolumns] = useState<any[]>([]);

  const {toggleLoader} = useGlobalContext();
  const {width} = useWindowDimensions();
  const router = useRouter();

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

    const fieldData = await getDbFileDataFields();

    let dataColumns = [];
    const dataColumnsMap: any = {
      id: {
        title: "HOF ITS",
        dataIndex: "id",
        key: "id",
        width: 150,
        fixed: "left",
      },
      tanzeem_file_no: {
        title: "File Number",
        dataIndex: "tanzeem_file_no",
        key: "tanzeem_file_no",
        width: 150,
        fixed: "left",
      },
      hof_name: {
        title: "HOF Name",
        dataIndex: "hof_name",
        key: "hof_name",
        width: 200,
        fixed: "left",
      },
      no_family_members: {
        title: "Number of members",
        dataIndex: "no_family_members",
        key: "no_family_members",
        width: 150,
      },
    };

    fieldData
      .filter((val: any) => val.name !== "tanzeem_file_no")
      .forEach((val: any) => {
        dataColumnsMap[val.name] = {
          title: val.label,
          dataIndex: val.name,
          width:
            val.name === "address" ||
            val.name === "address_fmb" ||
            val.name === "building_fmb"
              ? 250
              : 100,
          key: val.name,
        };
      });

    if (userRole) {
      const userColumns = getFileTableUserColumns(userRole);
      if (userColumns && userColumns.length > 0) {
        dataColumns = userColumns.map((column) => dataColumnsMap[column]);
      } else {
        dataColumns = Object.keys(dataColumnsMap).map(
          (val) => dataColumnsMap[val]
        );
      }
    }
    setcolumns(dataColumns);
    toggleLoader(false);
  };

  useEffect(() => {
    getFileTableColumns();
  }, []);

  const goToFile = (fileDetails: any) => {
    router.push(
      `/mohallah/${fileDetails.sub_sector.sector.name}/${fileDetails.sub_sector.name}/${fileDetails.tanzeem_file_no}`
    );
  };

  const getDbFileDataFields = async () => {
    let fieldsData: databaseMumeneenFieldData[] = [];
    await getFileDataFields((data: databaseMumeneenFieldData[]) => {
      fieldsData = data;
    });
    return fieldsData;
  };

  if (width && width >= 991) {
    return (
      <Table
        dataSource={dataSource.map((val) => ({...val, key: val.id}))}
        columns={columns}
        className={styles.fileListTable}
        pagination={false}
        scroll={{x: "500px", y: "500px"}}
        rowClassName="cursor-pointer"
        onRow={(record) => ({
          onClick: () =>
            router.push(
              `/mohallah/${record.sub_sector.sector.name}/${record.sub_sector.name}/${record.tanzeem_file_no}`
            ),
        })}
      />
    );
  }

  return (
    <div>
      <h1>Files : </h1>
      <Row gutter={[16, 16]}>
        {dataSource.map((val) => (
          <Col key={val.key} xs={24} md={12}>
            <Card onClick={() => goToFile(val)} className="border-radius-10">
              <Row gutter={[16, 16]}>
                {columns.map((data) => (
                  <Col
                    key={data.dataIndex}
                    xs={
                      data.dataIndex === "address" ||
                      data.dataIndex === "address_fmb" ||
                      data.dataIndex === "building_fmb" ||
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
