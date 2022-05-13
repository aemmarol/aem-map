import React, {FC} from "react";

import {escalationData, userRoles} from "../../../types";
import useWindowDimensions, {isMobile} from "../../../utils/windowDimensions";
import {EscalationCard} from "./escalationCard";
import {EscalationTable} from "./escalationTable";

import styles from "../../../styles/components/custom/escalationList.module.scss";
import {EscalationFilter, EscalationFilterType} from "./escalationFilter";

import {Col, Row} from "antd";

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

  return (
    <Row gutter={[16, 16]}>
      <Col
        style={{maxHeight: height ? height - 175 + "px" : "500px"}}
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
          {escalationList.length > 0 ? (
            isMobile() ? (
              escalationList.map((val, idx) => (
                <EscalationCard key={idx} escalation={val} />
              ))
            ) : escalationList && escalationList.length > 0 ? (
              <EscalationTable
                hideDetails={
                  userRole !== userRoles.Admin && userRole !== userRoles.Umoor
                }
                escalationList={escalationList}
              />
            ) : null
          ) : (
            <h2 className="text-align-center mt-10">No data</h2>
          )}
        </div>
      </Col>
    </Row>
  );
};
