import {Tag} from "antd";
import React, {FC} from "react";
import {EscStatType} from "../../../types/escalation";
import styles from "../../../styles/pages/Escalation.module.scss";

export const EscStat: FC<EscStatType> = ({label, value, type, tagColor}) => (
  <div className="flex-column">
    <p className={styles.escStatLabel}>{label}</p>
    {type === "tag" ? (
      <div>
        <Tag color={tagColor}>
          <span className={styles.statTag}>{value}</span>
        </Tag>
      </div>
    ) : (
      <p className={styles.escStatValue}>{value}</p>
    )}
  </div>
);
