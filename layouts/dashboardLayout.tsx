import {Layout} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/DashboardLayout.module.scss";
import {useState} from "react";
import {DashboardHeader} from "../components/headers";
import {DashboardSidebar} from "../components";
import {useGlobalContext} from "../context/GlobalContext";
import {
  FullPageLoader,
  FullPageLoaderWithProgress,
} from "../components/loaders";

const {Content} = Layout;

export const Dashboardlayout: FC<{
  headerTitle: string;
  backgroundColor?: string;
  showBackButton?: boolean;
}> = ({children, headerTitle, backgroundColor = "#efefef", showBackButton}) => {
  const [visible, setVisible] = useState(false);
  const {showLoader, showProgressLoader, progressValue} = useGlobalContext();
  return (
    <Layout>
      {showLoader ? (
        <FullPageLoader />
      ) : showProgressLoader ? (
        <FullPageLoaderWithProgress value={progressValue} />
      ) : null}
      <DashboardSidebar
        visible={visible}
        handleClose={() => setVisible(false)}
      />
      <Layout>
        <DashboardHeader
          headerTitle={headerTitle}
          handleToggle={() => setVisible(!visible)}
          showBackButton={showBackButton}
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
