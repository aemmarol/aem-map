import {Card, Col, Row} from "antd";
import {useRouter} from "next/router";
import React, {FC} from "react";
import styles from "../../../styles/components/mohallah/mohallah.module.scss";
import {sectorData} from "../../../types";

interface MohallahListProps {
  secData: sectorData[];
}

export const MohallahListComponent: FC<MohallahListProps> = ({secData}) => {
  const router = useRouter();

  const getIconLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const redirectToMohallahPage = (name: string) => {
    router.push("/mohallah/" + name);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {secData.map((val) => (
          <Col key={val.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
              onClick={() => redirectToMohallahPage(val.name as string)}
              style={{backgroundColor: val.primary_color}}
              className="border-radius-10 card-padding-20 cursor-pointer"
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
