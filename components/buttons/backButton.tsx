import {Button} from "antd";
import {useRouter} from "next/router";
import {FC} from "react";
import {RollbackOutlined} from "@ant-design/icons";
import styles from "../../styles/components/buttons/BackButton.module.scss";

export const Backbutton: FC = () => {
  const router = useRouter();
  return (
    <Button
      className={styles.button}
      type="primary"
      icon={<RollbackOutlined />}
      onClick={() => router.back()}
    ></Button>
  );
};
