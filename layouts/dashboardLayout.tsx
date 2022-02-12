import {Layout, Button, Menu, Drawer, Image, Divider, Avatar} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/DashboardLayout.module.scss";
import {useState} from "react";
import {DashboardHeader} from "../components/headers";

const {Header, Content} = Layout;

export const Dashboardlayout: FC<{
  headerTitle: string;
  backgroundColor?: string;
}> = ({children, headerTitle, backgroundColor = "#efefef"}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      <Drawer
        width={250}
        className="sidebar"
        visible={visible}
        placement="left"
        onClose={() => setVisible(false)}
        closable={false}
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
          <Menu.Item key="2">File List</Menu.Item>
          <Menu.Item key="3">User List</Menu.Item>
          <Menu.Item key="4">Escalations</Menu.Item>
        </Menu>
      </Drawer>
      <Layout>
        <DashboardHeader
          headerTitle={headerTitle}
          handleToggle={() => setVisible(!visible)}
        />
        <Content
          style={{background: backgroundColor}}
          className={styles.content}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
