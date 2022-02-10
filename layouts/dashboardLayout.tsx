import {Layout, Button, Menu, Drawer, Image, Divider} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/DashboardLayout.module.scss";
import {useState} from "react";
const {Header, Content} = Layout;
import {MenuOutlined} from "@ant-design/icons";

export const Dashboardlayout: FC<{headerTitle: string}> = ({
  children,
  headerTitle,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      <Drawer
        width={250}
        className="sidebar"
        visible={visible}
        placement="left"
        onClose={() => setVisible(false)}
      >
        <div className={styles.navhead}>
          <Image
            src="/jamaatLogo.png"
            alt="logo"
            width={100}
            height={100}
            preview={false}
          />
        </div>
        <Divider />
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Mohallah List</Menu.Item>
          <Menu.Item key="1">File List</Menu.Item>
          <Menu.Item key="2">User List</Menu.Item>
          <Menu.Item key="3">Escalations</Menu.Item>
        </Menu>
      </Drawer>
      <Layout>
        <Header className={styles.header}>
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setVisible(!visible)}
          />
          <h1>{headerTitle}</h1>
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};
