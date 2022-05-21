import {Card} from "antd";
import React, {FC} from "react";
import styles from "../../styles/components/cards/statsCard.module.scss";
interface statsCardType {
  title: string;
  handleClick: any;
  stats: any;
  horizontal?: boolean;
}
export const StatsCard: FC<statsCardType> = ({
  title,
  handleClick,
  stats,
  horizontal = false,
}) => {
  return (
    <Card
      title={title}
      onClick={handleClick}
      className={styles.statCard}
      bodyStyle={
        horizontal ? {display: "flex", justifyContent: "space-between"} : {}
      }
    >
      {Object.keys(stats).map((key, idx) => {
        return (
          <div key={idx} className={styles.stat}>
            <b>
              {key}: {stats[key]}
            </b>
          </div>
        );
      })}
    </Card>
  );
};
