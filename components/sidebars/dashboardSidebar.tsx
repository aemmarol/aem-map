import {Divider, Drawer, Image, Menu} from "antd";
import {useRouter} from "next/router";
import {FC} from "react";
import {verifyUser} from "../../pages/api/v1/authentication";
import {getSubSectorDataByName} from "../../pages/api/v1/db/subSectorCrud";
import styles from "../../styles/components/sidebars/dashboardSidebar.module.scss";
import {authUser} from "../../types";

export const DashboardSidebar: FC<{
  visible: boolean;
  handleClose: () => any;
}> = ({visible, handleClose}) => {
  const router = useRouter();

  const handleMohallahRouting = async () => {
    if (typeof verifyUser() !== "string") {
      const {userRole, assignedArea} = verifyUser() as authUser;
      if (userRole.includes("Admin")) {
        router.push("/mohallah");
      } else if (userRole.includes("Masool") || userRole.includes("Masoola")) {
        router.push("/mohallah/" + assignedArea[0]);
      } else if (userRole.includes("Musaid") || userRole.includes("Musaida")) {
        const subsectorDetails = await getSubSectorDataByName(assignedArea[0]);
        router.push(
          "/mohallah/" + subsectorDetails.sector.name + "/" + assignedArea[0]
        );
      }
    }
  };

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
        <Menu.Item key="1" onClick={handleMohallahRouting}>
          Mohallah
        </Menu.Item>
        <Menu.Item key="4">Escalations</Menu.Item>
      </Menu>
    </Drawer>
  );
};
