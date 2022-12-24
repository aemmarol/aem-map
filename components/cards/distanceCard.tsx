import {FC} from "react";
import styles from "../../styles/components/cards/distanceCard.module.scss";
import {Card} from "antd";
import {GoLocation} from "react-icons/go";

export const DistanceCard: FC<{
  backgroundColor?: string;
  directionLink?: string;
  fromLocation: string;
}> = ({
  backgroundColor = "#000000",
  directionLink,
  fromLocation = "your location",
}) => {
  return (
    <Card style={{background: backgroundColor}} className={styles.distanceCard}>
      <a
        className={styles.hyperlink}
        href={directionLink}
        target="_blank"
        rel="noreferrer"
      >
        <div className={styles.distanceCardContent}>
          <div className={styles.locationIcon}>
            <span>
              <GoLocation />
            </span>
          </div>
          <div className={styles.distanceInfo}>
            <p>Direction from</p>
            <p>{fromLocation}</p>
          </div>
        </div>
      </a>
    </Card>
  );
};
