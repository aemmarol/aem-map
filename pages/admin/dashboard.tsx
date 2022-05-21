import {Card, Col, message, Row} from "antd";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useGlobalContext} from "../../context/GlobalContext";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {authUser, escalationData, sectorData, userRoles} from "../../types";
import {logout, verifyUser} from "../api/v1/authentication";
import {
  getEscalationList,
  groupEscalationListBy,
} from "../api/v1/db/escalationsCrud";

import styles from "../../styles/pages/dashboard.module.scss";
import {getUmoorList} from "../api/v1/db/umoorsCrud";
import {getSectorList} from "../api/v1/db/sectorCrud";

interface AdminDashboardProps {
  escalationsList: escalationData[];
}
const AdminDashboard: NextPage<AdminDashboardProps> = ({escalationsList}) => {
  const router = useRouter();
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();
  const [umoorList, setUmoorList] = useState<any[]>([]);
  const [sectorList, setSectorList] = useState<sectorData[]>([]);
  const escalationsByUmoor = groupEscalationListBy(
    escalationsList,
    "type.value"
  );
  const escalationsByRegion = groupEscalationListBy(
    escalationsList,
    "file_details.sub_sector.sector.name"
  );
  useEffect(() => {
    intiLists();

    changeSelectedSidebarKey("0");
    toggleLoader(true);
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
      }
    } else {
      notVerifierUserLogout();
    }
    toggleLoader(false);
  }, []);

  const intiLists = async () => {
    const umoors: any[] = await getUmoorList();
    setUmoorList(umoors);
    const sectors = await getSectorList();
    setSectorList(sectors);
  };

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showEscalations = (field: string, value: string) => {
    router.push(`/escalations?${field}=${value}`);
  };
  return (
    <Dashboardlayout headerTitle="Admin Dashboard">
      {umoorList.length > 0 ? (
        <>
          <h1>Umoors</h1>
          <Row gutter={[16, 16]}>
            {umoorList.map((umoor: any, idx) => {
              let escalationGroup = escalationsByUmoor[umoor.value];
              if (!escalationGroup) {
                escalationGroup = {
                  groupName: umoor.value,
                  data: [],
                  stats: {
                    total: 0,
                    "Issue Reported": 0,
                    "Resolution In Process": 0,
                    Resolved: 0,
                  },
                };
              }

              return (
                <Col xs={24} sm={12} md={8} xl={6} key={idx}>
                  <Card
                    title={umoor.label}
                    onClick={() => showEscalations("umoor", umoor.value)}
                    className={styles.statCard}
                  >
                    {Object.keys(escalationGroup.stats).map((key, idx) => {
                      return (
                        <p key={idx}>
                          {key}: {escalationGroup.stats[key]}
                        </p>
                      );
                    })}
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      ) : null}
      <hr />
      <h1>Regions</h1>
      <Row gutter={[16, 16]}>
        {sectorList.map((sector, idx) => {
          let escalationGroup = escalationsByRegion[sector.name];
          if (!escalationGroup) {
            escalationGroup = {
              groupName: sector.name,
              data: [],
              stats: {
                total: 0,
                "Issue Reported": 0,
                "Resolution In Process": 0,
                Resolved: 0,
              },
            };
          }
          return (
            <Col xs={24} sm={12} md={8} xl={6} key={idx}>
              <Card
                title={sector.name}
                onClick={() => showEscalations("sector", sector.name)}
                className={styles.statCard}
              >
                {Object.keys(escalationGroup.stats).map((key, idx) => {
                  return (
                    <p key={idx}>
                      {key}: {escalationGroup.stats[key]}
                    </p>
                  );
                })}
              </Card>
            </Col>
          );
        })}
      </Row>
    </Dashboardlayout>
  );
};

export default AdminDashboard;

export const getServerSideProps: GetServerSideProps<
  AdminDashboardProps
> = async () => {
  const escalationsList: escalationData[] = await getEscalationList();

  return {
    props: {
      escalationsList,
    },
  };
};
