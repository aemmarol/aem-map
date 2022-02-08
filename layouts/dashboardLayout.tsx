import {Layout, Button, Menu, Drawer, Image, Divider} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/DashboardLayout.module.scss";
import {useState} from "react";
const {Header, Content} = Layout;
import {MenuOutlined} from "@ant-design/icons";

export const Dashboardlayout: FC = ({children}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      <Drawer
        className={styles.sidebar}
        visible={visible}
        placement="left"
        onClick={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        <div className={styles.navhead}>
          <Image src="/jamaatLogo.png" alt="logo" width={50} height={50} />
          <span className={styles.navheadtitle}> AEM </span>
        </div>
        <br />
        <div className={styles.userinfo}>ITS ID</div>
        <Divider />
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
          <Menu.Item key="4">nav 4</Menu.Item>
        </Menu>
      </Drawer>
      <Layout>
        <Header className={styles.header}>
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setVisible(!visible)}
          />
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};
