import React, {FC, useEffect, useState} from "react";
import {Table, Tag} from "antd";
import {
  comment,
  escalationData,
  escalationStatus,
  fileDetails,
  umoorData,
  userRoles,
} from "../../../types";
import moment from "moment";
import {useRouter} from "next/router";
import useWindowDimensions from "../../../utils/windowDimensions";
import {getDateDiffDays, getEscalationStatusDetail} from "../../../utils";
import {getUmoorListWithCoordinators} from "../../../pages/api/v2/services/umoor";

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
    // {
    //   title: "HOF",
    //   dataIndex: "file_details",
    //   key: "file_details",
    //   render: (file_details: fileDetails) => file_details.hof_name,
    //   width: 200,
    // },
    // {
    //   title: "Issue raised for",
    //   dataIndex: "issueRaisedFor",
    //   key: "issueRaisedFor",
    //   render: (issueRaisedFor: any) =>
    //     issueRaisedFor
    //       ? `${issueRaisedFor.name} (${issueRaisedFor.contact})`
    //       : "HOF",
    //   width: 200,
    // },
    {
      title: "Umoor",
      dataIndex: "type",
      key: "type",
      render: (type: umoorData) => type.label,
      sorter: (a: any, b: any) => a.type.label.localeCompare(b.type.label),
      width: 100,
    },
    {
      title: "Umoor Coordinators",
      dataIndex: "type",
      key: "type.coordinator",
      render: (type: umoorData) => {
        const umoorWithCoordinators = umoorListWithCoordinators.find(
          (umoor) => umoor.value == type.value
        );
        return umoorWithCoordinators?.coordinators &&
          umoorWithCoordinators.coordinators.length > 0
          ? umoorWithCoordinators.coordinators
              .map(
                (coordinator) => `${coordinator.name} (${coordinator.contact})`
              )
              .join("\n")
          : "Unassigned";
      },
      width: 250,
      hidden: userRole == userRoles.Admin || userRole == userRoles.Umoor,
    },
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
    // {
    //   title: "Masool",
    //   dataIndex: "file_details",
    //   key: "file_details.sub_sector.sector.masool_name",
    //   render: (file_details: any) =>
    //     `${file_details.sub_sector.sector.masool_name} (${file_details.sub_sector.sector.masool_contact})`,
    //   width: 225,
    // },
    // {
    //   title: "Masoola",
    //   dataIndex: "file_details",
    //   key: "file_details.sub_sector.sector.masoola_name",
    //   render: (file_details: any) =>
    //     `${file_details.sub_sector.sector.masoola_name} (${file_details.sub_sector.sector.masoola_contact})`,
    //   width: 225,
    // },
    // {
    //   title: "Musaid",
    //   dataIndex: "file_details",
    //   key: "file_details.sub_sector.musaid_name",
    //   render: (file_details: any) =>
    //     `${file_details.sub_sector.musaid_name} (${file_details.sub_sector.musaid_contact})`,
    //   width: 225,
    // },
    // {
    //   title: "Musaida",
    //   dataIndex: "file_details",
    //   key: "file_details.sub_sector.musaida_name",
    //   render: (file_details: any) =>
    //     `${file_details.sub_sector.musaida_name} (${file_details.sub_sector.musaida_contact})`,
    //   width: 225,
    // },
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
  ].filter((item) => !item.hidden);

  const [umoorListWithCoordinators, setUmoorListWithCoordinators] = useState<
    umoorData[]
  >([]);

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

  const initUmoorList = async () => {
    const umoorList: umoorData[] = await getUmoorListWithCoordinators();
    setUmoorListWithCoordinators(umoorList);
  };
  useEffect(() => {
    initUmoorList();
  });

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
