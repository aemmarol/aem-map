import {Button, message, Select, Tooltip} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {logout, verifyUser} from "../api/v1/authentication";
import {
  authUser,
  escalationData,
  escalationStatus,
  sectorData,
  umoorData,
  userRoles,
} from "../../types";
import {AddEscalationModal} from "../../components";
import {useGlobalContext} from "../../context/GlobalContext";
import {EscalationList} from "../../components/custom/escalations/escalationList";

import {filterTypes} from "../../types/escalation";
import {StatsCard} from "../../components/cards/statsCard";
import useWindowDimensions from "../../utils/windowDimensions";
import {DownloadOutlined} from "@ant-design/icons";
import {CSVLink} from "react-csv";
import {getDateDiffDays} from "../../utils";
import {getSectorList} from "../api/v2/services/sector";
import {getUmoorListWithCoordinators} from "../api/v2/services/umoor";
import {useEscalationContext} from "../../context/EscalationContext";
import {find, isEmpty} from "lodash";
import {
  getEscalationListFromDb,
  getEscalationStatsByFilter,
  getSectorStats,
  getUmoorStats,
} from "../api/v2/services/escalation";

const EscalationDashboard: NextPage = () => {
  const router = useRouter();
  const {changeSelectedSidebarKey, toggleLoader} = useGlobalContext();
  const {
    setAdminDetails,
    adminDetails,
    selectedView,
    setSelectedView,
    setEscalationFilterProps,
    selectedfilterItems,
    setEscalationList,
    setSelectedFilterItems,
    escalationList,
  } = useEscalationContext();
  const {width} = useWindowDimensions();

  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);

  const [statCardList, setStatCardList] = useState<any>([]);
  const [umoorList, setUmoorList] = useState<umoorData[]>([]);

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const user: authUser = verifyUser() as authUser;
      setUserDetails(user);
      changeSelectedSidebarKey("2");
    } else {
      notVerifierUserLogout();
    }
    return () => {
      setEscalationFilterProps({});
      setStatCardList([]);
      setSelectedView(null);
    };
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
  }, [selectedfilterItems]);

  const setUserDetails = async (user: authUser) => {
    const umoors: umoorData[] = await getUmoorListWithCoordinators();
    setUmoorList(umoors);
    if (user.userRole.includes(userRoles.Admin)) {
      await getSectorList((data: sectorData[]) => {
        user.assignedArea = data.map((sector) => sector.name);
      });
      const umoors: umoorData[] = await getUmoorListWithCoordinators();
      setUmoorList(umoors);
      user.assignedUmoor = umoors.map((umoor: umoorData) => umoor.value);
      setAdminDetails(user);
      setSelectedView(userRoles.Admin);
    } else {
      setAdminDetails(user);
      setSelectedView(user.userRole[0]);
    }
    const filters = JSON.parse(localStorage.getItem("escFilter") as string);
    if (filters) {
      setSelectedFilterItems(filters);
    }
  };

  const setupFiltersAndData = async () => {
    let sectorList: any[] = [];
    await getSectorList((data: sectorData[]) => {
      sectorList = data.map((val) => val.name);
    });
    switch (selectedView) {
      case userRoles.Masool:
      case userRoles.Masoola:
        setEscalationFilterProps([]);
        setSelectedFilterItems({
          [filterTypes.Sector]: adminDetails.assignedArea,
          [filterTypes.Umoor]: umoorList.map((val) => val.value),
        });
        const statarr = await Promise.all(
          adminDetails.assignedArea.map(async (val) => {
            const statObj: any = {
              title: val,
              total: 0,
            };
            Object.values(escalationStatus).map((val) => {
              statObj[val] = 0;
            });
            await getEscalationStatsByFilter(
              filterTypes.Sector,
              "all",
              filterTypes.Sector,
              val,
              (data: any) => {
                statObj.total = data[0] ? data[0].count : 0;
              }
            );
            await Promise.all(
              Object.values(escalationStatus).map(async (key) => {
                await getEscalationStatsByFilter(
                  filterTypes.Sector,
                  key,
                  filterTypes.Sector,
                  val,
                  async (response: any) => {
                    await Promise.all(
                      response.map((newVal: any) => {
                        statObj[key] = newVal.count;
                      })
                    );
                  }
                );
              })
            );
            return statObj;
          })
        );
        setStatCardList(statarr);
        break;
      case userRoles.Musaid:
      case userRoles.Musaida:
        setEscalationFilterProps([]);
        setSelectedFilterItems({
          [filterTypes.SubSector]: adminDetails.assignedArea,
        });
        const musaidArr = await Promise.all(
          adminDetails.assignedArea.map(async (val) => {
            const statObj: any = {
              title: val,
              total: 0,
            };
            Object.values(escalationStatus).map((val) => {
              statObj[val] = 0;
            });
            await getEscalationStatsByFilter(
              filterTypes.SubSector,
              "all",
              filterTypes.SubSector,
              val,
              (data: any) => {
                statObj.total = data[0] ? data[0].count : 0;
              }
            );
            await Promise.all(
              Object.values(escalationStatus).map(async (key) => {
                await getEscalationStatsByFilter(
                  filterTypes.SubSector,
                  key,
                  filterTypes.SubSector,
                  val,
                  async (response: any) => {
                    await Promise.all(
                      response.map((newVal: any) => {
                        statObj[key] = newVal.count;
                      })
                    );
                  }
                );
              })
            );
            return statObj;
          })
        );
        setStatCardList(musaidArr);

        break;
      case userRoles.Umoor:
        setSelectedFilterItems({
          [filterTypes.Sector]: sectorList,
          [filterTypes.Umoor]: adminDetails.assignedUmoor,
        });
        const umoorOptionsArr: any = [];
        const umoorStatarr = await Promise.all(
          adminDetails.assignedUmoor.map(async (val) => {
            const statObj: any = {
              title: find(umoorList, {value: val})?.label,
              total: 0,
            };
            Object.values(escalationStatus).map((val) => {
              statObj[val] = 0;
            });
            await getEscalationStatsByFilter(
              filterTypes.Umoor,
              "all",
              filterTypes.Umoor,
              val,
              (data: any) => {
                statObj.total = data[0] ? data[0].count : 0;
                umoorOptionsArr.push({
                  label: statObj.title + " (" + data[0].count + ")",
                  value: val,
                });
              }
            );
            await Promise.all(
              Object.values(escalationStatus).map(async (key) => {
                await getEscalationStatsByFilter(
                  filterTypes.Umoor,
                  key,
                  filterTypes.Umoor,
                  val,
                  async (response: any) => {
                    await Promise.all(
                      response.map((newVal: any) => {
                        statObj[key] = newVal.count;
                      })
                    );
                  }
                );
              })
            );
            return statObj;
          })
        );
        setStatCardList(umoorStatarr);
        if (umoorOptionsArr.length > 1) {
          setEscalationFilterProps([
            {
              title: "Selected Umoors",
              filterKey: filterTypes.Umoor,
              options: umoorOptionsArr,
              disabled: false,
            },
          ]);
        }
        break;
      case userRoles.Admin:
        await getUmoorStats("all", async (umoordata: any) => {
          const umoorCount = umoordata;
          await getSectorStats("all", async (sectorData: any) => {
            const sectorCount = sectorData;
            setEscalationFilterProps([
              {
                title: "Selected Umoors",
                filterKey: filterTypes.Umoor,
                options: umoorCount.map((umoor: any) => {
                  return {
                    label:
                      find(umoorList, {value: umoor._id})?.label +
                      " (" +
                      umoor.count +
                      ")",
                    value: umoor._id,
                  };
                }),
                disabled: false,
              },
              {
                title: "Selected Regions",
                options: sectorCount.map((area: any) => {
                  return {
                    label: area._id + " (" + area.count + ")",
                    value: area._id,
                  };
                }),
                disabled: false,
                filterKey: filterTypes.Sector,
              },
            ]);
          });
        });
        break;
    }
  };

  const callEscalationListApi = async () => {
    toggleLoader(true);
    await getEscalationListFromDb(selectedfilterItems, (data: any) => {
      setEscalationList(
        data.map((escData: escalationData) => ({
          ...escData,
          type: find(umoorList, {value: escData.type?.value}),
        }))
      );
    });
    toggleLoader(false);
  };

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showAddEscalationModal = () => {
    setShowEscalationModal(true);
  };

  const getEscalationDownloadData: any = () => {
    const tempArr: any = escalationList.map((data: any) => {
      const tempEscData: any = {};
      getEscalationDownloadDataHeaders().forEach((val: any) => {
        switch (val.key) {
          case "file_details":
            tempEscData[val.key] = data.file_details.tanzeem_file_no;
            break;

          case "sector":
            const sectorName: string = data.file_details.sub_sector.sector
              .name as string;
            tempEscData[val.key] = sectorName;
            break;

          case "pending_since":
            tempEscData[val.key] = `${
              data.status === escalationStatus.CLOSED ||
              data.status === escalationStatus.RESOLVED
                ? 0
                : getDateDiffDays(data.created_at)
            } days`;
            break;

          case "comments":
            tempEscData[val.key] = data.comments[data.comments.length - 1].msg;
            break;

          case "type":
            if (data.type) {
              tempEscData[val.key] = data.type.label;
            }
            break;

          default:
            tempEscData[val.key] = data[val.key];
            break;
        }
      });

      return tempEscData;
    });

    return tempArr;
  };

  const getEscalationDownloadDataHeaders = () => {
    const columns = [
      {
        label: "Id",
        key: "escalation_id",
      },
      {
        label: "File No",
        key: "file_details",
      },

      {
        label: "Umoor",
        key: "type",
      },

      {
        label: "Sector",
        key: "sector",
      },

      {
        label: "Issue",
        key: "issue",
      },
      {
        label: "Issue Date",
        key: "created_at",
      },
      {
        label: "Pending Since",
        key: "pending_since",
      },
      {
        label: "Status",
        key: "status",
      },
      {
        label: "Latest Comment",
        key: "comments",
      },
    ];
    return columns;
  };

  const successCallBack = async () => {
    await setupFiltersAndData();
    await callEscalationListApi();
  };

  return (
    <Dashboardlayout
      showBackButton={
        adminDetails.userRole && adminDetails.userRole.includes(userRoles.Admin)
      }
      headerTitle="Escalations"
    >
      <div
        className="d-flex"
        style={{
          flexDirection: "column",
          justifyContent: "space-around",
          marginBottom: "1em",
          width: width && width > 991 ? "50%" : "100%",
          margin: "0 auto",
        }}
      >
        {statCardList.map((val: any, idx: any) => {
          const statsObj = {...val};
          delete statsObj.title;
          return (
            <div key={"stat_" + val.title + "_" + idx} className="mb-16">
              <StatsCard
                title={val.title}
                handleClick={null}
                stats={statsObj}
              />
            </div>
          );
        })}
      </div>

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
          <Tooltip title="Download Escalationdata">
            <CSVLink
              // className={styles.downloadLink}
              filename={"escalations.csv"}
              data={getEscalationDownloadData() || []}
              headers={getEscalationDownloadDataHeaders()}
              className="ml-16"
            >
              <DownloadOutlined style={{fontSize: 25}} />
            </CSVLink>
          </Tooltip>
        </div>
      </div>

      {selectedView ? <EscalationList userRole={selectedView} /> : null}

      {showEscalationModal ? (
        <AddEscalationModal
          handleClose={() => setShowEscalationModal(false)}
          showModal={showEscalationModal}
          successCallBack={successCallBack}
        />
      ) : null}
    </Dashboardlayout>
  );
};

export default EscalationDashboard;
