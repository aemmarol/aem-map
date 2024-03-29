import {Divider, Drawer, Image, Menu} from "antd";
import {useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import {useGlobalContext} from "../../context/GlobalContext";
import {verifyUser} from "../../pages/api/v1/authentication";
import {getSubSectorDataByName} from "../../pages/api/v2/services/subsector";
import styles from "../../styles/components/sidebars/dashboardSidebar.module.scss";
import {authUser, subSectorData, userRoles} from "../../types";

export const DashboardSidebar: FC<{
  visible: boolean;
  handleClose: () => any;
}> = ({visible, handleClose}) => {
  const router = useRouter();
  const {selectedSidebarKey, changeSelectedSidebarKey} = useGlobalContext();
  const [appUserRole, setappUserRole] = useState<string[]>([]);

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      setappUserRole(userRole);
    }
  }, []);

  const handleMohallahRouting = async () => {
    changeSelectedSidebarKey("1");
    if (typeof verifyUser() !== "string") {
      const {userRole, assignedArea} = verifyUser() as authUser;
      if (userRole.includes(userRoles.Admin)) {
        router.push("/mohallah");
      } else if (
        userRole.includes(userRoles.Masool) ||
        userRole.includes(userRoles.Masoola)
      ) {
        router.push("/mohallah/" + assignedArea[0]);
      } else if (
        userRole.includes(userRoles.Musaid) ||
        userRole.includes(userRoles.Musaida)
      ) {
        await getSubSectorDataByName(assignedArea[0], (data: subSectorData) => {
          router.push("/mohallah/" + data.sector.name + "/" + assignedArea[0]);
        });
      }
    }
  };

  const redirectToEscalations = () => {
    changeSelectedSidebarKey("2");
    if (appUserRole.includes(userRoles.Admin)) {
      router.push("/admin/dashboard");
    } else {
      router.push("/escalations");
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
      <Menu theme="light" mode="inline" selectedKeys={[selectedSidebarKey]}>
        {appUserRole.length === 1 && appUserRole[0] === "Admin" ? (
          <Menu.Item key="0" onClick={() => router.push("/admin/dashboard")}>
            Dashboard
          </Menu.Item>
        ) : null}
        {appUserRole.length === 1 && appUserRole[0] === "Admin" ? (
          <Menu.Item key="4" onClick={() => router.push("/admin/escalation")}>
            Escalations
          </Menu.Item>
        ) : null}
        {appUserRole.length === 1 && appUserRole[0] === "Umoor" ? null : (
          <Menu.Item key="1" onClick={handleMohallahRouting}>
            Mohallah
          </Menu.Item>
        )}
        {appUserRole.length === 1 && appUserRole[0] === "Admin" ? null : (
          <Menu.Item onClick={redirectToEscalations} key="2">
            Escalations
          </Menu.Item>
        )}
        {appUserRole.length === 1 && appUserRole[0] === "Admin" ? (
          <Menu.Item key="5" onClick={() => router.push("/admin/users")}>
            User List
          </Menu.Item>
        ) : null}
        {appUserRole.length === 1 && appUserRole[0] === "Admin" ? (
          <Menu.Item key="3" onClick={() => router.push("/admin/settings")}>
            Settings
          </Menu.Item>
        ) : null}
      </Menu>
    </Drawer>
  );
};
