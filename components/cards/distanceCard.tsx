import {FC} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/components/cards/distanceCard.module.scss";
import {Card} from "antd";

export const DistanceCard: FC<{
  backgroundColor?: string;
  distance: string;
  eta: string;
}> = ({backgroundColor = "#fffff", distance, eta}) => {
  return (
    <Card style={{background: backgroundColor}} className={styles.distanceCard}>
      <div className={styles.distanceCardContent}>
        <div>
          <FontAwesomeIcon
            icon={faLocationDot}
            className={styles.locationIcon}
          />
        </div>
        <div className={styles.distanceInfo}>
          <p>{distance}</p>
          <p className={styles.eta}>{eta}</p>
        </div>
      </div>
    </Card>
  );
};
