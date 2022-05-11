import Airtable from "airtable";
import {Card, Col, message, Row} from "antd";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useGlobalContext} from "../../context/GlobalContext";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {authUser, escalationData, userRoles} from "../../types";
import {logout, verifyUser} from "../api/v1/authentication";
import {
  getEscalationListByCriteria,
  groupEscalationListBy,
} from "../api/v1/db/escalationsCrud";

import styles from "../../styles/pages/dashboard.module.scss";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const umoorTable = airtableBase("umoorList");

interface AdminDashboardProps {
  escalationsList: escalationData[];
}
const AdminDashboard: NextPage<AdminDashboardProps> = ({escalationsList}) => {
  const router = useRouter();
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();
  const [umoorList, setUmoorList] = useState([]);
  const escalationsByUmoor = groupEscalationListBy(
    escalationsList,
    "type.value"
  );
  const escalationsByRegion = groupEscalationListBy(
    escalationsList,
    "file_details.sub_sector.sector.name"
  );
  useEffect(() => {
    // console.log("GROUP BY UMOOR");
    // console.log(getUmoorList());
    getUmoorList();
    // getEscalationListByCriteria([
    //   {
    //     field: escalationDBFields.sectorName,
    //     value: "HAKIMI",
    //     operator: "==",
    //   },
    //   {
    //     field: escalationDBFields.sectorName,
    //     value: "VAJIHI",
    //     operator: "==",
    //   },
    // ]).then((res) => console.log(res));

    // console.log("GROUP BY REGION");
    // console.log(escalationsByRegion);

    changeSelectedSidebarKey("0");
    toggleLoader(true);
    // getUmoorList();
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      console.log(userRole);
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
      }
    } else {
      notVerifierUserLogout();
    }
    toggleLoader(false);
  }, []);

  const getUmoorList = async () => {
    const temp: any = [];
    await umoorTable
      .select({
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            temp.push(record.fields);
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          setUmoorList(temp);
        }
      );
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
            {escalationsByUmoor.map((escalationGroup, idx) => {
              return (
                <Col xs={24} sm={12} md={8} xl={6} key={idx}>
                  <Card
                    title={
                      umoorList.find(
                        (umoor: any) => umoor.value == escalationGroup.groupName
                      )?.["label"]
                    }
                    onClick={() =>
                      showEscalations("umoor", escalationGroup.groupName)
                    }
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
        {escalationsByRegion.map((escalationGroup, idx) => {
          return (
            <Col xs={24} sm={12} md={8} xl={6} key={idx}>
              <Card
                title={escalationGroup.groupName}
                onClick={() =>
                  showEscalations("sector", escalationGroup.groupName)
                }
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
  const escalationsList: escalationData[] = await getEscalationListByCriteria(
    []
  );

  return {
    props: {
      escalationsList,
    },
  };
};
