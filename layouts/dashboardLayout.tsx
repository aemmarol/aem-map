import {Layout} from "antd";
import {FC} from "react";
import styles from "../styles/layouts/DashboardLayout.module.scss";
import {useState} from "react";
import {DashboardHeader} from "../components/headers";
import {DashboardSidebar} from "../components";

const {Content} = Layout;

export const Dashboardlayout: FC<{
  headerTitle: string;
  backgroundColor?: string;
}> = ({children, headerTitle, backgroundColor = "#efefef"}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      <DashboardSidebar
        visible={visible}
        handleClose={() => setVisible(false)}
      />
      <Layout>
        <DashboardHeader
          headerTitle={headerTitle}
          handleToggle={() => setVisible(!visible)}
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
