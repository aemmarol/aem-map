import { faPerson, faPersonDress } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Card} from "antd";
import {FC} from "react";
import styles from "../../styles/components/cards/subSectorCard.module.scss";

export const SubSectorCard: FC<{
  musaidName: string;
  musaidaName: string;
  distance: string;
  eta: string;
  cardHeading: string;
  backgroundColor?: string;
  number_of_males: number;
  number_of_females: number;
}> = ({
  musaidName,
  musaidaName,
  distance,
  eta,
  cardHeading,
  number_of_females,
  number_of_males,
  backgroundColor = "#000000",
}) => {
  return (
    <Card className={styles.subSectorCard} bodyStyle={{padding: 0}}>
      <div className={styles.cardContent}>
        <h2 className={styles.cardHeading}>{cardHeading}</h2>
        <div className={styles.inchargeDetails}>
          <p className={styles.detailsTitle}>Musaid</p>
          <p className={styles.detailsValue}>{musaidName}</p>
          <p className={styles.detailsTitle}>Musaida</p>
          <p className={styles.detailsValue}>{musaidaName}</p>
          <p className={styles.detailsTitle}>Distance</p>
          <p className={styles.detailsValue}>
            {distance} / {eta}
          </p>
        </div>
      </div>
      <div className={styles.cardFooter} style={{background: backgroundColor}}>
        <div className={styles.footerContent}>
          <p className={styles.footerContentTitle}>Total Mumineen</p>
          <div className={styles.footerDetails}>
            <span className={styles.personIcon}>
              <FontAwesomeIcon icon={faPerson} />
            </span>
            <span className={styles.personCount}>{number_of_males}</span>
            <span className={styles.personIcon}>
              <FontAwesomeIcon icon={faPersonDress} />
            </span>
            <span className={styles.personCount}>{number_of_females}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
