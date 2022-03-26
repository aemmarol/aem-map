import {Progress} from "antd";
import {FC} from "react";

import styles from "../../styles/components/loaders/loader.module.scss";

interface ProgressProps {
  value: number;
}

export const FullPageLoaderWithProgress: FC<ProgressProps> = ({value}) => {
  return (
    <div className={styles.loaderContainer}>
      <div>
        <Progress type="circle" percent={value} />
      </div>
    </div>
  );
};
