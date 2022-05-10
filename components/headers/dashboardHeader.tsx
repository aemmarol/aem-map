import {FC} from "react";
import {Avatar, Button, Layout} from "antd";
import {MenuOutlined, UserOutlined} from "@ant-design/icons";
import styles from "../../styles/components/headers/dashboardHeader.module.scss";
import {Backbutton} from "../buttons";

const {Header} = Layout;

export const DashboardHeader: FC<{
  handleToggle: () => any;
  headerTitle: string;
  displayBackButton: boolean;
}> = ({handleToggle, headerTitle, displayBackButton = true}) => {
  return (
    <Header className={styles.header}>
      <Button
        className={styles.toggleBtn}
        type="primary"
        icon={<MenuOutlined />}
        onClick={handleToggle}
      />
      {displayBackButton ? <Backbutton></Backbutton> : null}
      <h1 className={styles.headerTitle}>{headerTitle}</h1>
      <Avatar className={styles.avatar} size={48} icon={<UserOutlined />} />
    </Header>
  );
};
