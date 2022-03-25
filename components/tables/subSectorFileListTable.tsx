import {FC, useEffect, useState} from "react";
import {Table} from "antd";
import styles from "../../styles/components/tables/fileListTable.module.scss";
import {getFileDataFields} from "../../pages/api/v1/db/databaseFields";
import {useGlobalContext} from "../../context/GlobalContext";

interface TableProps {
  dataSource: any[];
}

export const SubSectorFileListTable: FC<TableProps> = ({dataSource}) => {
  const [columns, setcolumns] = useState<any[]>([]);
  const {toggleLoader} = useGlobalContext();

  const getFileTableColumns = async () => {
    toggleLoader(true);
    const fieldData = await getFileDataFields();
    const dataColumns = [
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
    setcolumns(dataColumns);
    toggleLoader(false);
  };

  useEffect(() => {
    getFileTableColumns();
  }, []);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className={styles.fileListTable}
      pagination={false}
      scroll={{x: "500px", y: "500px"}}
    />
  );
};
