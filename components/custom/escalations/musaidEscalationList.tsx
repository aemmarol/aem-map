import {FC, useEffect, useState} from "react";
import {authUser, escalationData} from "../../../types";

import {
  escalationFields,
  getEscalationListByCriteria,
} from "../../../pages/api/v1/db/escalationsCrud";
import moment from "moment";

import {isMobile} from "../../../utils/windowDimensions";

import {EscalationTable} from "./escalationTable";
import {EscalationCard} from "./escalationCard";

interface MusaidEscalationListType {
  user: authUser;
}

export const MusaidEscalationList: FC<MusaidEscalationListType> = ({user}) => {
  const [escalationList, setEscalationList] = useState<escalationData[]>([]);
  useEffect(() => {
    getEscalationList(user.assignedArea[0]);
  }, []);
  const getEscalationList = async (selectedRegion: string) => {
    // const escList: escalationData[] = await getEscalationListBySubSector(
    //   selectedRegion
    // );
    const escList: escalationData[] = await getEscalationListByCriteria([
      {
        field: escalationFields.subsectorName,
        value: selectedRegion,
        operator: "==",
      },
    ]);
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
      <h3>{"Region : " + user.assignedArea[0]}</h3>
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
