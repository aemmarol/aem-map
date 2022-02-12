import {Divider, Drawer, Image, Menu} from "antd";
import {FC} from "react";
import styles from "../../styles/components/sidebars/dashboardSidebar.module.scss";

export const DashboardSidebar: FC<{
  visible: boolean;
  handleClose: () => any;
}> = ({visible, handleClose}) => {
  return (
    <Drawer
      width={250}
      className="sidebar"
      visible={visible}
      placement="left"
      onClose={handleClose}
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
  );
};
