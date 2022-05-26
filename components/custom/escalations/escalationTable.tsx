import React, {FC} from "react";
import {Table, Tag} from "antd";
import {
  comment,
  escalationData,
  fileDetails,
  umoorData,
  userRoles,
} from "../../../types";
import moment from "moment";
import {useRouter} from "next/router";
import useWindowDimensions from "../../../utils/windowDimensions";
import {getEscalationStatusDetail} from "../../../utils";

interface EscalationTableType {
  escalationList: escalationData[];
  hideDetails: boolean;
  userRole: userRoles;
}

export const EscalationTable: FC<EscalationTableType> = ({
  escalationList,
  hideDetails,
  userRole,
}) => {
  const router = useRouter();
  const {height} = useWindowDimensions();
  const columns = [
    {
      title: "Id",
      dataIndex: "escalation_id",
      key: "escalation_id",
      render: (text: any, val: any) => (
        <Tag
          className="cursor-pointer"
          onClick={() => handleOpenEscalation(val.id as string)}
        >
          {text}
        </Tag>
      ),
      width: 100,
      fixed: "left",
    },
    {
      title: "File No",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: fileDetails) => file_details.tanzeem_file_no,
      width: 100,
    },
    {
      title: "HOF",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: fileDetails) => file_details.hof_name,
      width: 200,
    },
    {
      title: "Issue raised for",
      dataIndex: "issueRaisedFor",
      key: "issueRaisedFor",
      render: (issueRaisedFor: any) =>
        issueRaisedFor
          ? `${issueRaisedFor.name} (${issueRaisedFor.contact})`
          : "HOF",
      width: 200,
    },
    {
      title: "Umoor",
      dataIndex: "type",
      key: "type",
      render: (type: umoorData) => type.label,
      width: 100,
    },
    {
      title: "Umoor Coordinators",
      dataIndex: "type",
      key: "type",
      render: (type: umoorData) =>
        type.coordinators.length > 0
          ? type.coordinators
              .map(
                (coordinator) => `${coordinator.name} (${coordinator.contact})`
              )
              .join("\n")
          : "Unassigned",
      width: 250,
    },
    {
      title: "Sector",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: any) => file_details.sub_sector.sector.name,
      width: 125,
    },
    {
      title: "Masool",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: any) =>
        `${file_details.sub_sector.sector.masool_name} (${file_details.sub_sector.sector.masool_contact})`,
      width: 225,
    },
    {
      title: "Masoola",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: any) =>
        `${file_details.sub_sector.sector.masoola_name} (${file_details.sub_sector.sector.masoola_contact})`,
      width: 225,
    },
    {
      title: "Musaid",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: any) =>
        `${file_details.sub_sector.musaid_name} (${file_details.sub_sector.musaid_contact})`,
      width: 225,
    },
    {
      title: "Musaida",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: any) =>
        `${file_details.sub_sector.musaida_name} (${file_details.sub_sector.musaida_contact})`,
      width: 225,
    },
    {
      title: "Issue",
      dataIndex: "issue",
      key: "issue",
      // render: (text: string) => <EscStat value={text} />,
      width: 250,
    },
    {
      title: "Issue Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: any) =>
        moment(created_at, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY"),
      width: 150,
    },
    {
      title: "Pending Since",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: any) => {
        const issueDate = moment(created_at, "DD-MM-YYYY HH:mm:ss").format(
          "YYYY/MM/DD"
        );
        const now = moment(new Date());
        return `${now.diff(issueDate, "days")} days`;
      },
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <Tag color={getEscalationStatusDetail(status).color}>{status}</Tag>
      ),
      width: 150,
    },
    {
      title: "Latest Comment",
      dataIndex: "comments",
      key: "comments",
      render: (comments: comment[]) => comments[comments.length - 1].msg,
      width: 275,
    },
  ];

  const getTableColumns = () => {
    if (hideDetails) {
      return columns.filter((val) => val.key !== "comments");
    }
    return columns;
  };

  const handleOpenEscalation = (escId: string) => {
    if (userRole === userRoles.Admin || userRole === userRoles.Umoor) {
      router.push("/escalations/" + escId);
    }
  };

  return (
    <Table
      dataSource={escalationList.map((val) => ({...val, key: val.id}))}
      columns={getTableColumns() as any}
      pagination={false}
      scroll={{x: "100px", y: height ? height - 278 + "px" : "500px" + "px"}}
    />
  );
};
