import React, {FC, useEffect, useState} from "react";

import {escalationData, userRoles} from "../../../types";
import useWindowDimensions, {isMobile} from "../../../utils/windowDimensions";
import {EscalationCard} from "./escalationCard";
import {EscalationTable} from "./escalationTable";

import styles from "../../../styles/components/custom/escalationList.module.scss";
import {EscalationFilter, EscalationFilterType} from "./escalationFilter";

import {Col, Input, Row} from "antd";
import {SearchOutlined} from "@ant-design/icons";

interface EscalationListType {
  escalationList: escalationData[];
  filterProps: EscalationFilterType[];
  userRole: userRoles;
}

export const EscalationList: FC<EscalationListType> = ({
  escalationList,
  filterProps,
  userRole,
}) => {
  const {height} = useWindowDimensions();
  const [escalations, setEscalations] = useState<escalationData[]>([]);
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    setEscalations(
      !!filterString
        ? escalationList.filter((esc) => {
            return JSON.stringify(esc).toLowerCase().includes(filterString);
          })
        : escalationList
    );
  }, [filterString]);

  return (
    <>
      <Row>
        <Input
          suffix={<SearchOutlined />}
          placeholder="Search item"
          style={{marginBottom: "1em"}}
          onChange={(event) => setFilterString(event.target.value)}
        ></Input>
      </Row>
      <Row gutter={[16, 16]}>
        <Col
          style={{maxHeight: height ? height - 225 + "px" : "500px"}}
          className={styles.filtersContainer}
          xs={5}
        >
          {filterProps.map((filterProp, idx) => {
            return (
              <div key={idx} className={styles.filterContainer}>
                <EscalationFilter {...filterProp}></EscalationFilter>
              </div>
            );
          })}
        </Col>
        <Col xs={19}>
          <div className="flex-column">
            {escalations.length > 0 ? (
              isMobile() ? (
                escalations.map((val, idx) => (
                  <EscalationCard key={idx} escalation={val} />
                ))
              ) : escalations && escalations.length > 0 ? (
                <EscalationTable
                  hideDetails={
                    userRole !== userRoles.Admin && userRole !== userRoles.Umoor
                  }
                  escalationList={escalations}
                  userRole={userRole}
                />
              ) : null
            ) : (
              <h2 className="text-align-center mt-10">No data</h2>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};
