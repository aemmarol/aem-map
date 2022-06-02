import React, {FC, useEffect, useState} from "react";

import {escalationData, userRoles} from "../../../types";
import useWindowDimensions from "../../../utils/windowDimensions";
import {EscalationCard} from "./escalationCard";
import {EscalationTable} from "./escalationTable";

import styles from "../../../styles/components/custom/escalationList.module.scss";
import {EscalationFilter, EscalationFilterType} from "./escalationFilter";

import {Button, Col, Drawer, Input, Radio, Row, Space} from "antd";
import {FilterOutlined, SearchOutlined} from "@ant-design/icons";
import {orderBy} from "lodash";

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
  const [sortValue, setSortValue] = useState("");

  useEffect(() => {
    setEscalations(
      !!filterString
        ? escalationList.filter((esc) => {
            return JSON.stringify(esc).toLowerCase().includes(filterString);
          })
        : escalationList
    );
  }, [filterString]);

  useEffect(() => {
    console.log(escalationList);
    setEscalations(sortEscalationList(escalationList));
  }, [escalationList]);

  useEffect(() => {
    setEscalations(sortEscalationList(escalations));
  }, [sortValue]);

  const sortEscalationList = (arr: Array<any>) => {
    if (sortValue !== "") {
      const key = sortValue.split("-")[0];
      const order = sortValue.split("-")[1] === "asc" ? "asc" : "desc";
      const tempEscList = [...arr];
      return orderBy(tempEscList, [key], [order === "asc" ? "asc" : "desc"]);
    }
    return [...arr];
  };

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
                      userRole={userRole}
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
          <h2 className="mt-16">Sort By:</h2>
          <Radio.Group
            onChange={(e) => setSortValue(e.target.value)}
            value={sortValue}
          >
            <Space direction="vertical">
              <Radio value="escalation_id-asc">Id Ascending</Radio>
              <Radio value="escalation_id-desc">Id Descending</Radio>
              <Radio value="status-asc">Status Ascending</Radio>
              <Radio value="status-desc">Status Descending</Radio>
              <Radio value="created_at-asc">Issue Date Ascending</Radio>
              <Radio value="created_at-desc">Issue Date Descending</Radio>
            </Space>
          </Radio.Group>
        </Drawer>
      ) : null}
    </>
  );
};
