import {Card, Col, Row} from "antd";
import {useRouter} from "next/router";
import React, {FC, useEffect, useState} from "react";
import {useGlobalContext} from "../../../context/GlobalContext";
import {getSectorList} from "../../../pages/api/v1/db/sectorCrud";
import styles from "../../../styles/components/mohallah/mohallah.module.scss";
import {sectorData} from "../../../types";

export const MohallahListComponent: FC = () => {
  const {toggleLoader} = useGlobalContext();
  const router = useRouter();
  const [mohallahlist, setMohallahlist] = useState<sectorData[]>([]);

  useEffect(() => {
    setList();
  }, []);

  const setList = async () => {
    toggleLoader(true);
    const listData: sectorData[] = await getSectorList();
    setMohallahlist(listData);
    toggleLoader(false);
  };

  const getIconLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const redirectToMohallahPage = (id: string) => {
    router.push("/mohallah/" + id);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {mohallahlist.map((val) => (
          <Col key={val.id} xs={12} sm={8} md={6} lg={6} xl={4}>
            <Card
              onClick={() => redirectToMohallahPage(val.id as string)}
              style={{backgroundColor: val.primary_color}}
              className="border-radius-10 card-padding-20"
            >
              <div className={styles.nameWrapper}>
                <span className={styles.icon}>{getIconLetter(val.name)}</span>
                <h3 className={styles.title}>{val.name}</h3>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
