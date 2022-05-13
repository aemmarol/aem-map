import React, {FC} from "react";
import {Table, Tag} from "antd";
import {comment, escalationData, fileDetails} from "../../../types";

import {find} from "lodash";
import {escalationIssueStatusList} from "../../../utils";

interface EscalationTableType {
  escalationList: escalationData[];
}

const columns = [
  {
    title: "Id",
    dataIndex: "escalation_id",
    key: "escalation_id",
    render: (text: any) => <a>{text}</a>,
  },
  {
    title: "File No",
    dataIndex: "file_details",
    key: "file_details",
    render: (file_details: fileDetails) => file_details.tanzeem_file_no,
  },
  {
    title: "Umoor",
    dataIndex: "type",
    key: "type",
    render: (type: any) => type.label,
  },
  {
    title: "Sector",
    dataIndex: "file_details",
    key: "file_details",
    render: (file_details: any) => file_details.sub_sector.sector.name,
  },
  {
    title: "Issue",
    dataIndex: "issue",
    key: "issue",
    // render: (text: string) => <EscStat value={text} />,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: any) => (
      <Tag color={find(escalationIssueStatusList, {value: status})?.color}>
        {status}
      </Tag>
    ),
  },
  {
    title: "Latest Comment",
    dataIndex: "comments",
    key: "comments",
    render: (comments: comment[]) => comments[0].msg,
  },
];

export const EscalationTable: FC<EscalationTableType> = ({escalationList}) => {
  return <Table dataSource={escalationList} columns={columns} />;
};
