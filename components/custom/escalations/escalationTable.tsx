import React, {FC} from "react";
import {Table, Tag} from "antd";
import {
  comment,
  escalationData,
  escalationStatus,
  fileDetails,
  userRoles,
} from "../../../types";
import moment from "moment";
import {useRouter} from "next/router";
import {useWindowDimensions} from "../../../utils/hooks";
import {getDateDiffDays, getEscalationStatusDetail} from "../../../utils";

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
          onClick={() => handleOpenEscalation(val._id as string)}
        >
          {text}
        </Tag>
      ),
      sorter: (a: any, b: any) =>
        a.escalation_id.split("-")[1] - b.escalation_id.split("-")[1],
      width: 100,
      fixed: "left",
    },
    {
      title: "File No",
      dataIndex: "file_details",
      key: "file_details",
      render: (file_details: fileDetails) => file_details.tanzeem_file_no,
      width: 100,
      sorter: (a: any, b: any) =>
        a.file_details.tanzeem_file_no - b.file_details.tanzeem_file_no,
    },
    {
      title: "Issue Raised For",
      dataIndex: "issueRaisedFor",
      key: "issueRaisedFor",
      render: (issueRaisedFor: any) =>
        issueRaisedFor
          ? `${issueRaisedFor.name} (${issueRaisedFor.contact})`
          : "HOF",
      width: 200,
    },
    // {
    //   title: "Umoor",
    //   dataIndex: "type",
    //   key: "type",
    //   render: (type: umoorData) => {
    //     return type.label;
    //   },
    //   sorter: (a: any, b: any) => a.type.label.localeCompare(b.type.label),
    //   width: 100,
    // },
    // {
    //   title: "Umoor Coordinators",
    //   dataIndex: "type",
    //   key: "type.coordinator",
    //   render: (type: any) =>
    //     type.coordinators.length > 0 ? (
    //       <div>
    //         {type.coordinators.map((coordinator: any, idx: any) => (
    //           <p key={idx + coordinator.name}>
    //             {coordinator.name + " (" + coordinator.contact + ")"}
    //           </p>
    //         ))}
    //       </div>
    //     ) : (
    //       "Unassigned"
    //     ),
    //   width: 250,
    // },
    {
      title: "Sector",
      dataIndex: "file_details",
      key: "file_details.sub_sector.sector.name",
      render: (file_details: any) => file_details.sub_sector.sector.name,
      sorter: (a: any, b: any) =>
        a.file_details.sub_sector.sector.name.localeCompare(
          b.file_details.sub_sector.sector.name
        ),
      width: 125,
    },
    {
      title: "Sub Sector",
      dataIndex: "file_details",
      key: "file_details.sub_sector.name",
      render: (file_details: any) => file_details.sub_sector.name,
      sorter: (a: any, b: any) =>
        a.file_details.sub_sector.name.localeCompare(
          b.file_details.sub_sector.name
        ),
      width: 125,
    },
    {
      title: "Issue",
      dataIndex: "issue",
      key: "issue",
      width: 250,
    },
    {
      title: "Issue Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: any) =>
        moment(created_at, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY"),
      sorter: (a: any, b: any) =>
        getDateDiffDays(b.created_at) - getDateDiffDays(a.created_at),
      width: 150,
    },
    {
      title: "Pending Since",
      dataIndex: "created_at",
      key: "created_at.daydiff",
      render: (created_at: any, val: any) => {
        return `${
          val.status === escalationStatus.CLOSED ||
          val.status === escalationStatus.RESOLVED
            ? 0
            : getDateDiffDays(created_at)
        } days`;
      },
      sorter: (a: any, b: any) => {
        const firstVal =
          a.status === escalationStatus.CLOSED ||
          a.status === escalationStatus.RESOLVED
            ? 0
            : getDateDiffDays(a.created_at);
        const secondVal =
          b.status === escalationStatus.CLOSED ||
          b.status === escalationStatus.RESOLVED
            ? 0
            : getDateDiffDays(b.created_at);
        return firstVal - secondVal;
      },
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: escalationStatus) => (
        <Tag color={getEscalationStatusDetail(status).color}>{status}</Tag>
      ),
      filters: Object.values(escalationStatus).map((status) => {
        return {
          text: status,
          value: status,
        };
      }),
      onFilter: (value: any, record: any) => record.status === value,
      sorter: (a: any, b: any) =>
        getEscalationStatusDetail(a.status).index -
        getEscalationStatusDetail(b.status).index,
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

  console.log(
    "data",
    escalationList.map((val) => ({...val, key: val._id}))
  );

  return (
    <Table
      dataSource={escalationList.map((val) => ({...val, key: val._id}))}
      columns={getTableColumns() as any}
      pagination={false}
      scroll={{
        x: "100px",
        y: height ? height - 278 + "px" : "500px" + "px",
      }}
    />
  );
};
