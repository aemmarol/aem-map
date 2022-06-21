import {Card, Col, Row} from "antd";
import moment from "moment";
import {useRouter} from "next/router";
import {FC} from "react";
import styles from "../../../styles/pages/Escalation.module.scss";
import {escalationData, userRoles} from "../../../types";
import {getDateDiffDays, getEscalationStatusDetail} from "../../../utils";
import {EscStat} from "./escalationStatus";

export const EscalationCard: FC<{
  escalation: escalationData;
  hideDetails: boolean;
  userRole: userRoles;
}> = ({escalation, hideDetails, userRole}) => {
  const router = useRouter();

  const columns = [
    {
      title: "Id",
      dataIndex: escalation.escalation_id,
      size: 12,
      type: "tag",
    },
    {
      title: "Status",
      dataIndex: escalation.status,
      size: 12,
      type: "tag",
      tagColor: getEscalationStatusDetail(escalation.status).color,
    },
    {
      title: "Issue",
      dataIndex: escalation.issue,
      size: 24,
    },
    {
      title: "Umoor",
      dataIndex: escalation.type?.label,
      size: 24,
    },
    {
      title: "Issue Date",
      dataIndex: moment(escalation.created_at, "DD-MM-YYYY HH:mm:ss").format(
        "DD-MM-YYYY"
      ),
      size: 12,
    },
    {
      title: "Pending Since",
      dataIndex: `${getDateDiffDays(escalation.created_at as string)} days`,
      size: 12,
    },
    {
      title: "File No",
      dataIndex: escalation.file_details.tanzeem_file_no,
      size: 12,
    },

    {
      title: "Sector",
      dataIndex: escalation.file_details.sub_sector.sector?.name,
      size: 12,
    },

    {
      title: "Latest Comment",
      dataIndex: escalation.comments[escalation.comments.length - 1].msg,
      size: 24,
    },
  ];

  const getTableColumns = () => {
    if (hideDetails) {
      return columns.filter((val) => val.title !== "Latest Comment");
    }
    return columns;
  };

  const handleOpenEscalation = (escId: string) => {
    if (userRole === userRoles.Admin || userRole === userRoles.Umoor) {
      router.push("/escalations/" + escId);
    }
  };

  return (
    <Card
      onClick={() => handleOpenEscalation(escalation._id as string)}
      className={styles.escalationCard}
      key={escalation._id}
    >
      <Row gutter={[16, 16]}>
        {getTableColumns().map((val, idx) => {
          return (
            <Col key={`ESC-CARD_${idx}`} xs={val.size}>
              <EscStat
                type={val.type}
                tagColor={val.tagColor}
                label={val.title}
                value={val.dataIndex as string}
              />
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};
