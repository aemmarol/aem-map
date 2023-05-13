import {Card} from "antd";
import {FC} from "react";
import styles from "../../styles/components/cards/subSectorCard.module.scss";
import {ImMan, ImWoman, ImFolderOpen} from "react-icons/im";

export const SubSectorCard: FC<{
  musaidName: string;
  musaidaName: string;
  // directionLink: string;
  cardHeading: string;
  backgroundColor?: string;
  number_of_males: number;
  number_of_females: number;
  number_of_files: number;
  handleClick: () => any;
}> = ({
  musaidName,
  musaidaName,
  cardHeading,
  number_of_females,
  number_of_males,
  number_of_files,
  backgroundColor = "#000000",
  handleClick,
}) => {
  return (
    <Card
      onClick={handleClick}
      className={styles.subSectorCard}
      bodyStyle={{padding: 0}}
    >
      <div className={styles.cardContent}>
        <h2 className={styles.cardHeading}>{cardHeading}</h2>
        <div className={styles.inchargeDetails}>
          <p className={styles.detailsTitle}>Musaid</p>
          <p className={styles.detailsValue}>{musaidName}</p>
          <p className={styles.detailsTitle}>Musaida</p>
          <p className={styles.detailsValue}>{musaidaName}</p>
          {/* <p className={styles.detailsTitle}></p> */}
          {/* <p className={styles.detailsTitle}>
            Directions from {center.name}
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={directionLink}
              target="_blank"
              rel="noreferrer"
            >
              <GoLocation size={"28px"} />
            </a>
          </p> */}
        </div>
      </div>
      <div className={styles.cardFooter} style={{background: backgroundColor}}>
        <div className={styles.footerContent}>
          <p className={styles.footerContentTitle}>Total Mumineen</p>
          <div className={styles.footerDetails}>
            <div>
              <span className={styles.personIcon}>
                <ImMan />
              </span>
              <span className={styles.personCount}>{number_of_males}</span>
            </div>
            <div style={{marginLeft: "50px"}}>
              <span className={styles.personIcon}>
                <ImWoman />
              </span>
              <span className={styles.personCount}>{number_of_females}</span>
            </div>
            <div style={{marginLeft: "50px"}}>
              <span className={styles.personIcon}>
                <ImFolderOpen />
              </span>
              <span className={styles.personCount}>{number_of_files}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
