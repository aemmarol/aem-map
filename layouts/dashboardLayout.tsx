import {Layout, Card, Image} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/Dashboardlayout.module.scss";

const {Sider, Header, Content} = Layout;

export const Dashboardlayout: FC = ({children}) => {
  return (
    <Layout>
      <Sider theme="light" className={styles.sidebar}>
        <Card className={styles.usercard}>
          <p>ITS ID</p>
        </Card>
      </Sider>
      <Layout>
        <Header className={styles.header}>AEM</Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};
