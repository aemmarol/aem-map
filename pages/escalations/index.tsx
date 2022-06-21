import { Button, message, Select, Tooltip } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Dashboardlayout } from "../../layouts/dashboardLayout";
import { useEffect, useState } from "react";
import { logout, verifyUser } from "../api/v1/authentication";
import {
  authUser,
  escalationData,
  escalationStatus,
  sectorData,
  umoorData,
  userRoles,
} from "../../types";
import { AddEscalationModal } from "../../components";
import { useGlobalContext } from "../../context/GlobalContext";
import { EscalationList } from "../../components/custom/escalations/escalationList";

import { filterOption, filterTypes, selectedFilterItemsType } from "../../types/escalation";
import { StatsCard } from "../../components/cards/statsCard";
import useWindowDimensions from "../../utils/windowDimensions";
import { DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { getDateDiffDays } from "../../utils";
import { getSectorList } from "../api/v2/services/sector";
import { getUmoorList } from "../api/v2/services/umoor";
import { useEscalationContext } from "../../context/EscalationContext";
import { find, isEmpty } from "lodash";
import { getEscalationListFromDb, getSectorStats, getUmoorStats } from "../api/v2/services/escalation";


const EscalationDashboard: NextPage = () => {
  const router = useRouter();
  const { changeSelectedSidebarKey, toggleLoader } = useGlobalContext();
  const {
    setAdminDetails,
    adminDetails,
    selectedView,
    setSelectedView,
    setEscalationFilterProps,
    selectedfilterItems,
    setEscalationList,
    setSelectedFilterItems
  } = useEscalationContext();
  const { width } = useWindowDimensions();

  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const user: authUser = verifyUser() as authUser;
      setUserDetails(user);
      changeSelectedSidebarKey("2");
    } else {
      notVerifierUserLogout();
    }
    return () => {
      setEscalationFilterProps({})
    }
  }, []);

  useEffect(() => {
    if (selectedView) {
      setupFiltersAndData();
    }
  }, [selectedView]);

  useEffect(() => {
    if (!isEmpty(selectedfilterItems)) {
      callEscalationListApi();
    }
  }, [selectedfilterItems])

  const setUserDetails = async (user: authUser) => {
    if (user.userRole.includes(userRoles.Admin)) {
      await getSectorList((data: sectorData[]) => {
        user.assignedArea = data.map((sector) => sector.name);
      });
      const umoors: umoorData[] = await getUmoorList();
      user.assignedUmoor = umoors.map((umoor: umoorData) => umoor.value);
      setAdminDetails(user);
      setSelectedView(userRoles.Admin);
    } else {
      setAdminDetails(user);
      setSelectedView(user.userRole[0]);
    }
    const filters = JSON.parse(localStorage.getItem("escFilter") as string);
    if (filters) {
      setSelectedFilterItems(filters)
    }
  };

  const setupFiltersAndData = async () => {
    switch (selectedView) {
      case userRoles.Masool:
      case userRoles.Masoola:
      case userRoles.Musaid:
      case userRoles.Musaida:
        setEscalationFilterProps([]);
      case userRoles.Umoor:
        setEscalationFilterProps([
          {
            title: "Selected Umoors",
            filterKey: filterTypes.Umoor,
            options: [],
            disabled: false,
          },
        ]);
        break;
      case userRoles.Admin:

        const queryUmoor = router.query.umoor?.toString();
        const querySector = router.query.sector?.toString();
        await getUmoorStats("all", async (umoordata: any) => {
          const umoorCount = umoordata;
          const umoorList = await getUmoorList()
          await getSectorStats("all", async (sectorData: any) => {
            const sectorCount = sectorData;
            setEscalationFilterProps([
              {
                title: "Selected Umoors",
                filterKey: filterTypes.Umoor,
                options: umoorCount.map((umoor: any) => {
                  return {
                    label: find(umoorList, { value: umoor._id })?.label + " (" + umoor.count + ")",
                    value: umoor._id,
                  };
                }),
                disabled: false,
              },
              {
                title: "Selected Regions",
                options: sectorCount.map((area: any) => {
                  return { label: area._id + " (" + area.count + ")", value: area._id };
                }),
                disabled: false,
                filterKey: filterTypes.Sector,
              },
            ]);
          })
        })

        break;
    }
  };

  const callEscalationListApi = async () => {
    toggleLoader(true)
    await getEscalationListFromDb(selectedfilterItems, (data: any) => {
      setEscalationList(data)
    })
    toggleLoader(false)
  }


  // const getStatCardList = () => {
  //   if (!escalationsStatsGroup) return null;
  //   switch (selectedView) {
  //     case userRoles.Masool:
  //     case userRoles.Masoola:
  //     case userRoles.Musaid:
  //     case userRoles.Musaida:
  //       return adminDetails.assignedArea.map((area, idx) => {
  //         let escalationGroup: any = escalationsStatsGroup[area];
  //         if (!escalationGroup) {
  //           escalationGroup = {
  //             groupName: area,
  //             data: [],
  //             stats: {
  //               total: 0,
  //             },
  //           };
  //           for (const escStatus of Object.values(escalationStatus)) {
  //             escalationGroup["stats"][escStatus] = 0;
  //           }
  //         }

  //         return (
  //           <div key={"stat_" + area + "_" + idx} className="mb-16">
  //             <StatsCard
  //               title={area}
  //               handleClick={null}
  //               stats={escalationGroup.stats}
  //               horizontal={true}
  //             ></StatsCard>
  //           </div>
  //         );
  //       });
  //     case userRoles.Umoor:
  //       return adminDetails.assignedUmoor.map((umoor, idx) => {
  //         let escalationGroup: any = escalationsStatsGroup[umoor];
  //         if (!escalationGroup) {
  //           escalationGroup = {
  //             groupName: umoor,
  //             data: [],
  //             stats: {
  //               total: 0,
  //               // "Issue Reported": 0,
  //               // "Resolution In Process": 0,
  //               // Resolved: 0,
  //             },
  //           };
  //           for (const escStatus of Object.values(escalationStatus)) {
  //             escalationGroup["stats"][escStatus] = 0;
  //           }
  //         }

  //         return (
  //           <div key={"stat_" + umoor + "_" + idx} className="mb-16">
  //             <StatsCard
  //               title={getLabelForUmoor(umoor)}
  //               handleClick={null}
  //               stats={escalationGroup.stats}
  //               horizontal={true}
  //             ></StatsCard>
  //           </div>
  //         );
  //       });
  //   }
  // };

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showAddEscalationModal = () => {
    setShowEscalationModal(true);
  };

  // const getEscalationDownloadData: any = () => {
  //   const tempArr: escalationData[] = escalationList.map((data:escalationData) => {
  //     const tempEscData: any = {};
  //     getEscalationDownloadDataHeaders().forEach((val:any) => {
  //       switch (val.key) {
  //         case "file_details":
  //           tempEscData[val.key] = data.file_details.tanzeem_file_no;
  //           break;

  //         case "sector":
  //           let sectorName:string = data.file_details.sub_sector.sector.name as string
  //           tempEscData[val.key] = sectorName;
  //           break;

  //         case "pending_since":
  //           tempEscData[val.key] = `${data.status === escalationStatus.CLOSED ||
  //             data.status === escalationStatus.RESOLVED
  //             ? 0
  //             : getDateDiffDays(data.created_at)
  //             } days`;
  //           break;

  //         case "comments":
  //           tempEscData[val.key] = data.comments[data.comments.length - 1].msg;
  //           break;

  //         case "type":
  //           tempEscData[val.key] = data.type.label;
  //           break;

  //         default:
  //           tempEscData[val.key] = data[val.key];
  //           break;
  //       }
  //     });

  //     return tempEscData;
  //   });

  //   return tempArr;
  // };

  // const getEscalationDownloadDataHeaders = () => {
  //   const columns = [
  //     {
  //       label: "Id",
  //       key: "escalation_id",
  //     },
  //     {
  //       label: "File No",
  //       key: "file_details",
  //     },

  //     {
  //       label: "Umoor",
  //       key: "type",
  //     },

  //     {
  //       label: "Sector",
  //       key: "sector",
  //     },

  //     {
  //       label: "Issue",
  //       key: "issue",
  //     },
  //     {
  //       label: "Issue Date",
  //       key: "created_at",
  //     },
  //     {
  //       label: "Pending Since",
  //       key: "pending_since",
  //     },
  //     {
  //       label: "Status",
  //       key: "status",
  //     },
  //     {
  //       label: "Latest Comment",
  //       key: "comments",
  //     },
  //   ];
  //   return columns;
  // };

  return (
    <Dashboardlayout
      showBackButton={
        adminDetails.userRole && adminDetails.userRole.includes(userRoles.Admin)
      }
      headerTitle="Escalations"
    >
      {/* <div
        className="d-flex"
        style={{
          flexDirection: "column",
          justifyContent: "space-around",
          marginBottom: "1em",
          width: width && width > 991 ? "50%" : "100%",
          margin: "0 auto",
        }}
      >
        {getStatCardList()}
      </div> */}

      <div className="mb-16">
        {adminDetails &&
          adminDetails.userRole &&
          adminDetails.userRole.length > 1 ? (
          <div className="flex-align-center mb-16 flex-1">
            <h4 className="mr-10 mb-0 w-100">Select View : </h4>
            <Select
              onChange={(e) => setSelectedView(e)}
              value={selectedView}
              className="w-150"
            >
              {adminDetails.userRole &&
                adminDetails.userRole.map((val) => (
                  <Select.Option value={val} key={val}>
                    {val}
                  </Select.Option>
                ))}
            </Select>
          </div>
        ) : null}

        <div className="flex-align-center w-full">
          <Button
            className={width && width < 576 ? "" : "ml-auto"}
            onClick={showAddEscalationModal}
            type="primary"
            size="large"
          >
            Raise Escalation
          </Button>
          {/* <Tooltip title="Download Escalationdata">
            <CSVLink
              // className={styles.downloadLink}
              filename={"escalations.csv"}
              data={getEscalationDownloadData() || []}
              headers={getEscalationDownloadDataHeaders()}
              className="ml-16"
            >
              <DownloadOutlined style={{ fontSize: 25 }} />
            </CSVLink>
          </Tooltip> */}
        </div>
      </div>

      {/* {selectedView && isReady ? ( */}
      {selectedView ? (
        <EscalationList
          userRole={selectedView}
        />
      ) : null}

      {showEscalationModal ? (
        <AddEscalationModal
          handleClose={() => setShowEscalationModal(false)}
          showModal={showEscalationModal}
        />
      ) : null}
    </Dashboardlayout>
  );
};

export default EscalationDashboard;
