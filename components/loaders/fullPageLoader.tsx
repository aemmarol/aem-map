import {Spin} from "antd";
import {FC} from "react";
import styles from "../../styles/components/loaders/fullPageLoader.module.scss";

export const FullPageLoader: FC = () => {
  return (
    <div className={styles.mainWrapper}>
      <Spin size="large" />
    </div>
  );
};
