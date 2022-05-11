import moment from "moment";
import React, {FC, useEffect, useState} from "react";
import {
  Criteria,
  escalationDBFields,
  getEscalationListByCriteria,
} from "../../../pages/api/v1/db/escalationsCrud";
import {authUser, escalationData, userRoles} from "../../../types";
import {isMobile} from "../../../utils/windowDimensions";
import {EscalationCard} from "./escalationCard";
import {EscalationTable} from "./escalationTable";

interface EscalationListType {
  user: authUser;
  userRole: userRoles;
}
interface EscalationListTitle {
  label: string;
  value: string;
}
export const EscalationList: FC<EscalationListType> = ({user, userRole}) => {
  const [escalationList, setEscalationList] = useState<escalationData[]>([]);
  const [title, setTitle] = useState<EscalationListTitle>();
  useEffect(() => {
    getEscalationList();
  }, [userRole]);
  const getEscalationList = async () => {
    let criteria: Criteria[] = [];
    switch (userRole) {
      case userRoles.Masool:
      case userRoles.Masoola:
        setTitle({label: "Region", value: user.assignedArea[0]});
        criteria = [
          {
            field: escalationDBFields.sectorName,
            value: user.assignedArea[0],
            operator: "==",
          },
        ];
        break;
      case userRoles.Musaid:
      case userRoles.Musaida:
        setTitle({label: "Region", value: user.assignedArea[0]});
        criteria = [
          {
            field: escalationDBFields.subsectorName,
            value: user.assignedArea[0],
            operator: "==",
          },
        ];
        break;
      case userRoles.Umoor:
        setTitle({label: "Category", value: user.assignedUmoor[0]});
        criteria = [
          {
            field: escalationDBFields.umoorName,
            value: [user.assignedUmoor[0]],
            operator: "in",
          },
        ];
        break;
    }
    const escList: escalationData[] = await getEscalationListByCriteria(
      criteria
    );
    setEscalationList(
      escList.sort((a, b) =>
        moment(a.updated_at, "DD-MM-YYYY HH:mm:ss").diff(
          moment(b.updated_at, "DD-MM-YYYY HH:mm:ss")
        )
      )
    );
    console.log("list", escList);
  };
  return (
    <div className="flex-column">
      {title?.value ? <h3>{`${title?.label} : ` + title?.value}</h3> : null}
      {isMobile() ? (
        escalationList.map((val, idx) => (
          <EscalationCard key={idx} escalation={val} />
        ))
      ) : escalationList && escalationList.length > 0 ? (
        <EscalationTable escalationList={escalationList} />
      ) : null}
    </div>
  );
};
