import {Col, Divider, Empty, message, Row} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useGlobalContext} from "../../context/GlobalContext";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {
  authUser,
  escalationStatus,
  sectorData,
  umoorData,
  userRoles,
} from "../../types";
import {logout, verifyUser} from "../api/v1/authentication";

import {StatsCard} from "../../components/cards/statsCard";
import {getSectorList} from "../api/v2/services/sector";
import {getUmoorList} from "../api/v2/services/umoor";

import {findIndex} from "lodash";
import {getSectorStats, getUmoorStats} from "../api/v2/services/escalation";
import {useEscalationContext} from "../../context/EscalationContext";
import {filterTypes, selectedFilterItemsType} from "../../types/escalation";

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();
  const {setSelectedFilterItems} = useEscalationContext();
  const [umoorList, setUmoorList] = useState<umoorData[]>([]);
  const [sectorList, setSectorList] = useState<sectorData[]>([]);

  useEffect(() => {
    changeSelectedSidebarKey("0");
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
      } else {
        intiLists();
      }
    } else {
      notVerifierUserLogout();
    }
  }, []);

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showEscalations = (field: string, value: string) => {
    const tempSelectedFilters: selectedFilterItemsType = {
      [filterTypes.Sector]: [],
      [filterTypes.Umoor]: [],
    };
    if (field === filterTypes.Umoor) {
      tempSelectedFilters[filterTypes.Umoor] = [value];
      tempSelectedFilters[filterTypes.Sector] = sectorList.map(
        (val) => val.name
      );
    }
    if (field === filterTypes.Sector) {
      tempSelectedFilters[filterTypes.Umoor] = umoorList.map(
        (val) => val.value
      );
      tempSelectedFilters[filterTypes.Sector] = [value];
    }
    setSelectedFilterItems(tempSelectedFilters);
    router.push(`/escalations?${field}=${value}`);
  };

  const intiLists = async () => {
    toggleLoader(true);
    await getUmoorTileData();
    await getSectorTileData();
    toggleLoader(false);
  };

  const getUmoorTileData = async () => {
    const umoors: any[] = await getUmoorList();
    await getUmoorStats("all", async (response: any) => {
      await Promise.all(
        response.map((val: any) => {
          const index = findIndex(umoors, {value: val._id});
          umoors[index].total = val.count;
        })
      );
    });
    await Promise.all(
      Object.values(escalationStatus).map(async (key) => {
        await getUmoorStats(key, async (response: any) => {
          await Promise.all(
            response.map((val: any) => {
              const index = findIndex(umoors, {value: val._id});

              umoors[index][key] = val.count;
            })
          );
        });
      })
    );
    setUmoorList(umoors);
  };

  const getSectorTileData = async () => {
    await getSectorList(async (sectors: sectorData[]) => {
      const finalSectorList: any = sectors.map((val) => ({name: val.name}));
      await getSectorStats("all", async (response: any) => {
        await Promise.all(
          response.map((val: any) => {
            const index = findIndex(finalSectorList, {name: val._id});
            finalSectorList[index].total = val.count;
          })
        );
      });
      await Promise.all(
        Object.values(escalationStatus).map(async (key) => {
          await getSectorStats(key, async (response: any) => {
            await Promise.all(
              response.map((val: any) => {
                const index = findIndex(finalSectorList, {name: val._id});
                finalSectorList[index][key] = val.count;
              })
            );
          });
        })
      );
      setSectorList(finalSectorList);
    });
  };

  return (
    <Dashboardlayout headerTitle="Admin Dashboard">
      <h1>Umoors</h1>
      {umoorList.length > 0 ? (
        <Row gutter={[16, 16]}>
          {umoorList.map((umoor: any, idx) => {
            const stats: any = {total: umoor.total ? umoor.total : 0};
            Object.values(escalationStatus).map((value) => {
              stats[value] = umoor[value] ? umoor[value] : 0;
            });
            return (
              <Col xs={24} sm={12} md={8} xl={6} key={idx}>
                <StatsCard
                  title={umoor.label}
                  handleClick={() => showEscalations("umoor", umoor.value)}
                  stats={stats}
                ></StatsCard>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Empty />
      )}

      <Divider />

      <h1>Regions</h1>
      <Row gutter={[16, 16]}>
        {sectorList.map((sector: any, idx) => {
          const stats: any = {total: sector.total ? sector.total : 0};
          Object.values(escalationStatus).map((value) => {
            stats[value] = sector[value] ? sector[value] : 0;
          });
          return (
            <Col xs={24} sm={12} md={8} xl={6} key={idx}>
              <StatsCard
                title={sector.name}
                handleClick={() => showEscalations("sector", sector.name)}
                stats={stats}
              ></StatsCard>
            </Col>
          );
        })}
      </Row>
    </Dashboardlayout>
  );
};

export default AdminDashboard;
