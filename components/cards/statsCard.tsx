import {Card, Col, Row} from "antd";
import React, {FC} from "react";
import styles from "../../styles/components/cards/statsCard.module.scss";
import {EscStat} from "../custom/escalations/escalationStatus";
interface statsCardType {
  title: string;
  handleClick: any;
  stats: any;
  horizontal?: boolean;
}
export const StatsCard: FC<statsCardType> = ({title, handleClick, stats}) => {
  return (
    <Card title={title} onClick={handleClick} className={styles.statCard}>
      <Row gutter={[8, 8]}>
        {Object.keys(stats).map((key, idx) => {
          return (
            <Col xs={12}>
              <EscStat key={idx} label={key} value={stats[key]} />
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};
