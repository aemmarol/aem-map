import {Card} from "antd";
import {FC} from "react";
import styles from "../../styles/components/cards/inchargeDetailsCard.module.scss";

export const InchargeDetailsCard: FC<{
  cardTitle: string;
  inchargeName: string;
  inchargeIts: string;
  inchargeContactNumber: string;
}> = ({cardTitle, inchargeName, inchargeIts, inchargeContactNumber}) => {
  return (
    <Card className={styles.masoolCard}>
      <div className={styles.masoolCardContent}>
        <h3 className={styles.masoolCardHeader}>{cardTitle}</h3>
        <p className={styles.masoolName}>{inchargeName}</p>
        <p className={styles.masoolDetails}>{inchargeIts}</p>
        <p className={styles.masoolDetails}>{inchargeContactNumber}</p>
      </div>
    </Card>
  );
};
