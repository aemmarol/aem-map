import {Card} from "antd";
import {FC} from "react";
import styles from "../../styles/components/cards/signInCard.module.scss";
import Image from "next/image";

export const SigninCard: FC<{title: string}> = ({children, title}) => {
  return (
    <Card
      bodyStyle={{width: "100%", textAlign: "center"}}
      className={styles.signInBox}
    >
      <Image src="/jamaatLogo.png" alt="logo" width={150} height={150} />
      <h1 className={styles.signInHeader}>{title}</h1>
      {children}
      <p className={styles.masoolNotification}>
        Login available to umoor heads, masools and musaids only!!
      </p>
      <p className={styles.mumeneenNotification}>
        Mumeneen are requested to connect with their respective masools and
        musaids!
      </p>
    </Card>
  );
};
