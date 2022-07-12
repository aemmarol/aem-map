import {FC, useState} from "react";
import {Avatar, Button, Layout, message, Tooltip} from "antd";
import {LeftOutlined, LogoutOutlined, MenuOutlined} from "@ant-design/icons";
import styles from "../../styles/components/headers/dashboardHeader.module.scss";
import {logout} from "../../pages/api/v1/authentication";
import {useRouter} from "next/router";
import useWindowDimensions from "../../utils/windowDimensions";
import {AddEscalationModal} from "../modals";

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

  const {width} = useWindowDimensions();
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);

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
      <div className="mr-16">
        <Button
          className={width && width < 576 ? "" : "ml-auto"}
          onClick={() => setShowEscalationModal(true)}
          type="primary"
          size="large"
        >
          Raise Escalation
        </Button>
        {/* <Tooltip title="Download Escalationdata">
          <CSVLink
            // className={styles.downloadLink}
            filename={"escalations.csv"}
            data={getEscalationDownloadData() || []}
            headers={getEscalationDownloadDataHeaders()}
            className="ml-16"
          >
            <DownloadOutlined style={{fontSize: 25}} />
          </CSVLink>
        </Tooltip> */}
      </div>
      <Tooltip title="Logout">
        <button className={styles.btnAvatar} onClick={handleLogout}>
          <Avatar
            className={styles.avatar}
            size={48}
            icon={<LogoutOutlined />}
          />
        </button>
      </Tooltip>
      {showEscalationModal ? (
        <AddEscalationModal
          handleClose={() => setShowEscalationModal(false)}
          showModal={showEscalationModal}
          successCallBack={() => {
            if (router.pathname.includes("escalations")) router.reload();
          }}
        />
      ) : null}
    </Header>
  );
};
