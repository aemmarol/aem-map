import {Spin} from "antd";
import {FC} from "react";

import styles from "../../styles/components/loaders/loader.module.scss";

export const FullPageLoader: FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <Spin size="large" />
    </div>
  );
};
