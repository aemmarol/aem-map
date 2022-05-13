import {FC, useEffect, useState} from "react";
import {message, Table} from "antd";
import styles from "../../styles/components/tables/fileListTable.module.scss";
import {getFileDataFields} from "../../pages/api/v1/db/databaseFields";
import {useGlobalContext} from "../../context/GlobalContext";
import {useRouter} from "next/router";
import {logout, verifyUser} from "../../pages/api/v1/authentication";
import {authUser} from "../../types";
import {getFileTableUserColumns} from "./columnsUtil";

interface TableProps {
  dataSource: any[];
}

export const SubSectorFileListTable: FC<TableProps> = ({dataSource}) => {
  const [columns, setcolumns] = useState<any[]>([]);

  const {toggleLoader} = useGlobalContext();
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

    const fieldData = await getFileDataFields();
    let dataColumns = [
      {
        title: "HOF ITS",
        dataIndex: "id",
        key: "id",
        width: 150,
        fixed: "left",
      },
      {
        title: "File Number",
        dataIndex: "tanzeem_file_no",
        key: "tanzeem_file_no",
        width: 150,
        fixed: "left",
      },
      {
        title: "HOF Name",
        dataIndex: "hof_name",
        key: "hof_name",
        width: 200,
        fixed: "left",
      },
      {
        title: "Number of members",
        dataIndex: "no_family_members",
        key: "no_family_members",
        width: 150,
      },
      ...fieldData
        .filter((val) => val.name !== "tanzeem_file_no")
        .map((val) => ({
          title: val.label,
          dataIndex: val.name,
          width:
            val.name === "address" ||
            val.name === "address_fmb" ||
            val.name === "building_fmb"
              ? 250
              : 100,
          key: val.name,
        })),
    ];
    if (userRole) {
      const userColumns = getFileTableUserColumns(userRole);
      if (userColumns && userColumns.length > 0) {
        dataColumns = dataColumns.filter((dataColumn) =>
          userColumns.includes(dataColumn.key)
        );
      }
    }
    setcolumns(dataColumns);
    toggleLoader(false);
  };

  useEffect(() => {
    getFileTableColumns();
  }, []);

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
};
