import {Card} from "antd";
import {FC} from "react";
import styles from "../../styles/components/signInCard.module.scss";
import Image from 'next/image'

export const SigninCard: FC<{title: string}> = ({children, title}) => {
  return (
    <Card bodyStyle={{width: "100%",textAlign:"center"}} className={styles.signInBox}>
      <Image src="/jamaatLogo.png" alt="logo" width={150} height={150} />
      <h1 className={styles.signInHeader}>{title}</h1>
      {children}
    </Card>
  );
};
