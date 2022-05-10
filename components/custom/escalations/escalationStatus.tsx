import {Tag} from "antd";
import React, {FC} from "react";
import {EscStatType} from "../../../types/escalation";
import styles from "../../../styles/pages/Escalation.module.scss";

export const EscStat: FC<EscStatType> = ({label, value, type, tagColor}) => (
  <div className="flex-column">
    <p className={styles.escStatLabel}>{label}</p>
    {type === "tag" ? (
      <Tag color={tagColor}>{value}</Tag>
    ) : (
      <p className={styles.escStatValue}>{value}</p>
    )}
  </div>
);
