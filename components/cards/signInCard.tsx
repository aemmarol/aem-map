import {Card} from "antd";
import {FC} from "react";
import styles from "../../styles/components/signInCard.module.scss";

export const SigninCard: FC<{title: string}> = ({children, title}) => {
  return (
    <Card bodyStyle={{width: "100%"}} className={styles.signInBox}>
      <h1 className={styles.signInHeader}>{title}</h1>
      {children}
    </Card>
  );
};
