import {Divider, Drawer, Image, Menu} from "antd";
import {useRouter} from "next/router";
import {FC} from "react";
import styles from "../../styles/components/sidebars/dashboardSidebar.module.scss";

export const DashboardSidebar: FC<{
  visible: boolean;
  handleClose: () => any;
}> = ({visible, handleClose}) => {
  const router = useRouter();

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
        <Menu.Item key="1" onClick={() => router.push("/mohallah")}>
          Mohallah
        </Menu.Item>
        <Menu.Item key="4">Escalations</Menu.Item>
      </Menu>
    </Drawer>
  );
};
