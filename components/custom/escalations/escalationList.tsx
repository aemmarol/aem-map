import React, {FC, useEffect, useState} from "react";

import {escalationData, userRoles} from "../../../types";
import useWindowDimensions, {isMobile} from "../../../utils/windowDimensions";
import {EscalationCard} from "./escalationCard";
import {EscalationTable} from "./escalationTable";

import styles from "../../../styles/components/custom/escalationList.module.scss";
import {EscalationFilter, EscalationFilterType} from "./escalationFilter";

import {Button, Card, Col, Divider, Drawer, Input, Row} from "antd";
import {FilterOutlined, SearchOutlined} from "@ant-design/icons";

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
  const {height, width} = useWindowDimensions();
  const [escalations, setEscalations] = useState<escalationData[]>([]);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
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
          xs={0}
          md={5}
        >
          {filterProps.map((filterProp, idx) => {
            return (
              <div key={idx} className={styles.filterContainer}>
                <EscalationFilter {...filterProp}></EscalationFilter>
              </div>
            );
          })}
        </Col>
        <Col xs={24} md={19}>
          <div className="flex-column">
            {escalations.length > 0 ? (
              width && width < 768 ? (
                <>
                  {escalations.map((val, idx) => (
                    <EscalationCard
                      hideDetails={
                        userRole !== userRoles.Admin &&
                        userRole !== userRoles.Umoor
                      }
                      key={idx}
                      escalation={val}
                    />
                  ))}
                  <Button
                    onClick={() => setShowFilterDrawer(true)}
                    className={styles.filterIcon}
                    type="primary"
                    icon={<FilterOutlined style={{fontSize: 25}} />}
                    size="large"
                  />
                </>
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
      {showFilterDrawer ? (
        <Drawer
          title="Filter and sorting options"
          placement="bottom"
          closable={false}
          onClose={() => setShowFilterDrawer(false)}
          visible={showFilterDrawer}
          height={600}
        >
          <h2>Filters:</h2>
          {filterProps.map((filterProp, idx) => {
            return (
              <div key={idx} className={styles.filterContainer}>
                <EscalationFilter {...filterProp}></EscalationFilter>
              </div>
            );
          })}
          {/* <h2 className="mt-16">Sort By:</h2> */}
        </Drawer>
      ) : null}
    </>
  );
};
