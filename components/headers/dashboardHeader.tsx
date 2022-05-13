import {FC} from "react";
import {Avatar, Button, Layout, message, Tooltip} from "antd";
import {LeftOutlined, LogoutOutlined, MenuOutlined} from "@ant-design/icons";
import styles from "../../styles/components/headers/dashboardHeader.module.scss";
import {logout} from "../../pages/api/v1/authentication";
import {useRouter} from "next/router";

const {Header} = Layout;

export const DashboardHeader: FC<{
  handleToggle: () => any;
  headerTitle: string;
  showBackButton?: boolean;
}> = ({handleToggle, headerTitle, showBackButton}) => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    message.info("User Logged Out!");
    router.push("/");
  };

  return (
    <Header className={styles.header}>
      <Button
        className={styles.toggleBtn}
        type="primary"
        icon={<MenuOutlined />}
        onClick={handleToggle}
      />
      <h1 className={styles.headerTitle}>
        {showBackButton ? (
          <LeftOutlined
            className="cursor-pointer"
            onClick={() => router.back()}
          />
        ) : null}
        {headerTitle}
      </h1>
      <Tooltip title="Logout">
        <button className={styles.btnAvatar} onClick={handleLogout}>
          <Avatar
            className={styles.avatar}
            size={48}
            icon={<LogoutOutlined />}
          />
        </button>
      </Tooltip>
    </Header>
  );
};
