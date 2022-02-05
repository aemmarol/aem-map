import React, {useState} from "react";
import {Drawer, Button, MenuItemProps, MenuProps, SubMenuProps} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import styles from "../../styles/components/NavBar.module.scss";

export const NavBar = ({menu}: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Button
        className={styles.menu}
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setVisible(true)}
      />
      <Drawer
        title="Topics"
        placement="left"
        onClick={() => setVisible(false)}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        {menu}
      </Drawer>
    </nav>
  );
};
