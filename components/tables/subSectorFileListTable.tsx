import {FC, useEffect, useState} from "react";
import {message, Table} from "antd";
import styles from "../../styles/components/tables/fileListTable.module.scss";
import {getFileDataFields} from "../../pages/api/v1/db/databaseFields";
import {useGlobalContext} from "../../context/GlobalContext";
import {useRouter} from "next/router";
import {logout, verifyUser} from "../../pages/api/v1/authentication";
import {authUser} from "../../types";
import {getFileTableUserColumns} from "./columnsUtil";
import useWindowDimensions from "../../utils/windowDimensions";

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

    const fieldData = await getFileDataFields();
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
      .filter((val) => val.name !== "tanzeem_file_no")
      .forEach((val) => {
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

  return <div>pool</div>;
};
