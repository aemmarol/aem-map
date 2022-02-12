import {FC} from "react";
import {Avatar, Button, Layout} from "antd";
import {MenuOutlined, UserOutlined} from "@ant-design/icons";
import styles from "../../styles/components/headers/dashboardHeader.module.scss";

const {Header} = Layout;

export const DashboardHeader: FC<{
  handleToggle: () => any;
  headerTitle: string;
}> = ({handleToggle, headerTitle}) => {
  return (
    <Header className={styles.header}>
      <Button
        className={styles.toggleBtn}
        type="primary"
        icon={<MenuOutlined />}
        onClick={handleToggle}
      />
      <h1 className={styles.headerTitle}>{headerTitle}</h1>
      <Avatar className={styles.avatar} size={48} icon={<UserOutlined />} />
    </Header>
  );
};
