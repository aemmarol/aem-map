import React from "react";
import {Layout} from "antd";
import styles from "../../styles/components/SideBar.module.scss";

export const SideBar = ({menu}: any) => {
  return (
    <Layout.Sider
      className={styles.sidebar}
      breakpoint={"lg"}
      theme="light"
      collapsedWidth={0}
      trigger={null}
    >
      {menu}
    </Layout.Sider>
  );
};
