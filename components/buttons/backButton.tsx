import {Button} from "antd";
import {useRouter} from "next/router";
import {FC} from "react";
import {LeftOutlined, RollbackOutlined} from "@ant-design/icons";
import styles from "../../styles/components/buttons/BackButton.module.scss";

export const Backbutton: FC = () => {
  const router = useRouter();
  return (
    <LeftOutlined className={styles.button} onClick={() => router.back()} />
  );
};
