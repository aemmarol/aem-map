import {Card} from "antd";
import {FC} from "react";
import styles from "../../styles/components/cards/inchargeDetailsCard.module.scss";

export const InchargeDetailsCard: FC<{
  cardTitle: string;
  inchargeName: string;
  inchargeIts: string;
  inchargeContactNumber: string;
}> = ({cardTitle, inchargeName, inchargeContactNumber}) => {
  const openWhatsapp = () => {};
  return (
    <Card className={styles.masoolCard}>
      <div className={styles.masoolCardContent}>
        <h3 className={styles.masoolCardHeader}>{cardTitle}</h3>
        <p className={styles.masoolName}>{inchargeName}</p>
        <a
          target="_blank"
          rel="noreferrer"
          href={"https://wa.me/" + inchargeContactNumber}
          onClick={openWhatsapp}
          className={styles.masoolDetails}
        >
          {inchargeContactNumber}
        </a>
      </div>
    </Card>
  );
};
