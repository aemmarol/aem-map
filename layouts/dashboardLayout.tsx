import {Layout, Button, Menu, Drawer, Image, Divider, Dropdown} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/DashboardLayout.module.scss";
import {useState} from "react";
const {Header, Content} = Layout;
import {DownOutlined, MenuOutlined, LogoutOutlined} from "@ant-design/icons";

export const Dashboardlayout: FC = ({children}) => {
  const handleNavClick = () => {
    setVisible(false);
  };

  const userDropdownOverlay = (
    <Menu>
      <Menu.Item>
        <LogoutOutlined className={styles.logoutlogo} />
        Logout
      </Menu.Item>
    </Menu>
  );

  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      <Drawer
        width={250}
        className={styles.sidebar}
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
        <br />
        <div className={styles.userinfo}>
          <Dropdown overlay={userDropdownOverlay}>
            <div>
              ITS ID <DownOutlined />
            </div>
          </Dropdown>
        </div>
        <Divider />
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item onClick={handleNavClick} key="1">
            Map View
          </Menu.Item>
          <Menu.Item onClick={handleNavClick} key="2">
            User List
          </Menu.Item>
          <Menu.Item onClick={handleNavClick} key="3">
            Escalations
          </Menu.Item>
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
