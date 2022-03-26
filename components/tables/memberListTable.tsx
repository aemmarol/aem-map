import {FC, useEffect, useState} from "react";
import {Table} from "antd";
import styles from "../../styles/components/tables/fileListTable.module.scss";
import {getMumeneenDataFields} from "../../pages/api/v1/db/databaseFields";
import {useGlobalContext} from "../../context/GlobalContext";
import {useRouter} from "next/router";

interface TableProps {
  dataSource: any[];
}

export const MemberListTable: FC<TableProps> = ({dataSource}) => {
  const [columns, setcolumns] = useState<any[]>([]);

  const {toggleLoader} = useGlobalContext();
  const router = useRouter();

  const getFileTableColumns = async () => {
    toggleLoader(true);
    const fieldData = await getMumeneenDataFields();
    const dataColumns = [
      {
        title: "ITS",
        dataIndex: "id",
        key: "id",
        width: 150,
        fixed: "left",
      },
      ...fieldData
        .filter((val) => val.name !== "tanzeem_file_no")
        .map((val: any) => ({
          title: val.label,
          dataIndex: val.name,
          width:
            val.name === "address" ||
            val.name === "address_fmb" ||
            val.name === "building_fmb"
              ? 250
              : 150,
          key: val.name,
        })),
    ];
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
      scroll={{x: "150px", y: "500px"}}
    />
  );
};
