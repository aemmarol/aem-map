import {Layout} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/signinLayout.module.scss";

const {Content} = Layout;

export const Signinlayout: FC = ({children}) => {
  return (
    <Layout>
      <Content className={styles.mainWrapper}>{children}</Content>
    </Layout>
  );
};
