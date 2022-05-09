import {Card, Col, Row, Tag} from "antd";
import {FC} from "react";
import {escalationData} from "../../../types";
import styles from "../../../styles/pages/Escalation.module.scss";
import {find} from "lodash";
import {escalationIssueStatusList} from "../../../utils";

interface MusaidEscalationListType {
  region: string;
  escalationlist: escalationData[];
}

interface EscStatType {
  label: string;
  value: string;
  type?: string;
  tagColor?: string;
}

const EscStat: FC<EscStatType> = ({label, value, type, tagColor}) => (
  <div className="flex-column">
    <p className={styles.escStatLabel}>{label}</p>
    {type === "tag" ? (
      <Tag color={tagColor}>{value}</Tag>
    ) : (
      <p className={styles.escStatValue}>{value}</p>
    )}
  </div>
);

export const MusaidEscalationList: FC<MusaidEscalationListType> = ({
  region,
  escalationlist,
}) => {
  return (
    <div className="flex-column">
      <h3>{"Region : " + region}</h3>
      {escalationlist.map((val) => (
        <Card className={styles.escalationCard} key={val.id}>
          <Row gutter={[16, 16]}>
            <Col xs={12}>
              <EscStat label="Id" value={val.escalation_id} />
            </Col>
            <Col xs={12}>
              <EscStat
                label="Status"
                value={val.status}
                type="tag"
                tagColor={
                  find(escalationIssueStatusList, {value: val.status})?.color
                }
              />
            </Col>
            <Col xs={24}>
              <EscStat label="issue" value={val.issue} />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};
