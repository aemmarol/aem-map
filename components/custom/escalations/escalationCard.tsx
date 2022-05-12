import {Card, Col, Row} from "antd";
import {find} from "lodash";
import {FC} from "react";
import styles from "../../../styles/pages/Escalation.module.scss";
import {escalationData} from "../../../types";
import {escalationIssueStatusList} from "../../../utils";
import {EscStat} from "./escalationStatus";
export const EscalationCard: FC<{
  escalation: escalationData;
}> = ({escalation}) => {
  return (
    <Card className={styles.escalationCard} key={escalation.id}>
      <Row gutter={[16, 16]}>
        <Col xs={12}>
          <EscStat label="Id" value={escalation.escalation_id} />
        </Col>
        <Col xs={12}>
          <EscStat
            label="Status"
            value={escalation.status}
            type="tag"
            tagColor={
              find(escalationIssueStatusList, {value: escalation.status})?.color
            }
          />
        </Col>
        <Col xs={24}>
          <EscStat label="issue" value={escalation.issue} />
        </Col>
      </Row>
    </Card>
  );
};
