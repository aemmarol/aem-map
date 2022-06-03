import {Button, message, Select} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {logout, verifyUser} from "../api/v1/authentication";
import {
  authUser,
  escalationData,
  escalationStatus,
  umoorData,
  userRoles,
} from "../../types";
import {AddEscalationModal} from "../../components";
import {useGlobalContext} from "../../context/GlobalContext";
import {EscalationList} from "../../components/custom/escalations/escalationList";
import {getSectorList} from "../api/v1/db/sectorCrud";
import {getUmoorList} from "../api/v1/db/umoorsCrud";
import {
  Criteria,
  escalationDBFields,
  groupEscalationListBy,
  getEscalationList as getEscalationListFromDB,
  getEscalationListByCriteria,
} from "../api/v1/db/escalationsCrud";
import {EscalationFilterType} from "../../components/custom/escalations/escalationFilter";
import {filterOption} from "../../types/escalation";
import moment from "moment";
import {StatsCard} from "../../components/cards/statsCard";
import useWindowDimensions from "../../utils/windowDimensions";

interface selectedFilterItemsType {
  selectedUmoors: filterOption[];
  selectedRegions: filterOption[];
  ready: boolean;
}
const Dashboard: NextPage = () => {
  const router = useRouter();
  const {changeSelectedSidebarKey} = useGlobalContext();
  const {width} = useWindowDimensions();

  const [adminDetails, setAdminDetails] = useState<authUser>({} as authUser);
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<userRoles>();
  const [filterProps, setFilterProps] = useState<EscalationFilterType[]>([]);
  const [umoorList, setUmoorList] = useState<any[]>([]);
  const [selectedfilterItems, setSelectedFilterItems] =
    useState<selectedFilterItemsType>({
      selectedUmoors: [],
      selectedRegions: [],
      ready: false,
    });
  const [escalationsStatsGroup, setEscalationsStatsGroup] = useState();
  const [escalationList, setEscalationList] = useState<escalationData[]>([]);

  const [escalationsByUmoor, setEscalationsByUmoor] = useState<any>();
  const [escalationsBySector, setEscalationsBySector] = useState<any>();
  const [escalationsBySubSector, setEscalationsBySubSector] = useState<any>();
  const {toggleLoader} = useGlobalContext();

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const user: authUser = verifyUser() as authUser;
      setUserDetails(user);
      changeSelectedSidebarKey("2");
    } else {
      notVerifierUserLogout();
    }
  }, []);

  useEffect(() => {
    if (Object.keys(adminDetails).length > 0) {
      initFilters();
    }
  }, [adminDetails]);

  useEffect(() => {
    if (selectedfilterItems.ready) {
      getEscalationList();
    }
  }, [selectedfilterItems, selectedView]);

  const initFilters = async () => {
    setEscalationsByUmoor(
      groupEscalationListBy(await getEscalationListFromDB(), "type.value")
    );
    setEscalationsBySector(
      groupEscalationListBy(
        await getEscalationListFromDB(),
        "file_details.sub_sector.sector.name"
      )
    );
    setEscalationsBySubSector(
      groupEscalationListBy(
        await getEscalationListFromDB(),
        "file_details.sub_sector.name"
      )
    );
    const queryUmoor = router.query.umoor?.toString();
    const querySector = router.query.sector?.toString();
    const umoors: umoorData[] = await getUmoorList();
    console.log(adminDetails, "USER");
    setUmoorList(umoors);
    setSelectedFilterItems({
      selectedRegions: querySector
        ? [{label: querySector, value: querySector}]
        : adminDetails.assignedArea
        ? adminDetails.assignedArea.map((area) => {
            return {label: area, value: area};
          })
        : [],
      selectedUmoors: queryUmoor
        ? [
            {
              label:
                umoors.find((item: umoorData) => item.value == queryUmoor)
                  ?.label || "",
              value: queryUmoor,
            },
          ]
        : adminDetails.assignedUmoor
        ? adminDetails.assignedUmoor.map((umoor) => {
            return {
              label:
                umoors.find((item: any) => item.value == umoor)?.label || "",
              value: umoor,
            };
          })
        : [],
      // : [],
      ready: true,
    });
  };

  const getLabelForUmoor = (value: string) => {
    const umoor: any = umoorList.find((item: any) => item.value == value);
    return umoor ? umoor.label : null;
  };
  const getCountForUmoor = (value: string) => {
    return escalationsByUmoor
      ? escalationsByUmoor[value]
        ? ` (${escalationsByUmoor[value].data.length})`
        : " (0)"
      : "";
  };
  const getCountForSector = (value: string) => {
    return escalationsBySector
      ? escalationsBySector[value]
        ? ` (${escalationsBySector[value].data.length})`
        : " (0)"
      : "";
  };
  const getCountForSubSector = (value: string) => {
    return escalationsBySubSector
      ? escalationsBySubSector[value]
        ? ` (${escalationsBySubSector[value].data.length})`
        : " (0)"
      : "";
  };
  const getStatCardList = () => {
    if (!escalationsStatsGroup) return null;
    switch (selectedView) {
      case userRoles.Masool:
      case userRoles.Masoola:
      case userRoles.Musaid:
      case userRoles.Musaida:
        return adminDetails.assignedArea.map((area, idx) => {
          let escalationGroup: any = escalationsStatsGroup[area];
          if (!escalationGroup) {
            escalationGroup = {
              groupName: area,
              data: [],
              stats: {
                total: 0,
              },
            };
            for (const escStatus of Object.values(escalationStatus)) {
              escalationGroup["stats"][escStatus] = 0;
            }
          }

          return (
            <div key={"stat_" + area + "_" + idx} className="mb-16">
              <StatsCard
                title={area}
                handleClick={null}
                stats={escalationGroup.stats}
                horizontal={true}
              ></StatsCard>
            </div>
          );
        });
      case userRoles.Umoor:
        return adminDetails.assignedUmoor.map((umoor, idx) => {
          let escalationGroup: any = escalationsStatsGroup[umoor];
          if (!escalationGroup) {
            escalationGroup = {
              groupName: umoor,
              data: [],
              stats: {
                total: 0,
                // "Issue Reported": 0,
                // "Resolution In Process": 0,
                // Resolved: 0,
              },
            };
            for (const escStatus of Object.values(escalationStatus)) {
              escalationGroup["stats"][escStatus] = 0;
            }
          }

          return (
            <div key={"stat_" + umoor + "_" + idx} className="mb-16">
              <StatsCard
                title={getLabelForUmoor(umoor)}
                handleClick={null}
                stats={escalationGroup.stats}
                horizontal={true}
              ></StatsCard>
            </div>
          );
        });
    }
  };
  const getEscalationList = async () => {
    toggleLoader(true);
    let criteria: Criteria[] = [];
    let groupName;
    switch (selectedView) {
      case userRoles.Masool:
      case userRoles.Masoola:
        // setTitle({label: "Region", value: user.assignedArea[0]});
        groupName = "file_details.sub_sector.sector.name";
        setFilterProps([
          {
            title: "Selected Regions",
            options: adminDetails.assignedArea.map((area) => {
              return {label: area + getCountForSector(area), value: area};
            }),
            selectedOptions: adminDetails.assignedArea.map((area) => {
              return {label: area + getCountForSector(area), value: area};
            }),
            disabled: true,
            onChange: null,
          },
        ]);
        criteria = [
          {
            field: escalationDBFields.sectorName,
            value: adminDetails.assignedArea[0],
            operator: "==",
          },
        ];
        break;
      case userRoles.Musaid:
      case userRoles.Musaida:
        // setTitle({label: "Region", value: user.assignedArea[0]});
        groupName = "file_details.sub_sector.name";
        setFilterProps([
          {
            title: "Selected Regions",
            options: adminDetails.assignedArea.map((area) => {
              return {label: area + getCountForSubSector(area), value: area};
            }),
            selectedOptions: adminDetails.assignedArea.map((area) => {
              return {label: area + getCountForSubSector(area), value: area};
            }),
            disabled: true,
            onChange: null,
          },
        ]);
        criteria = [
          {
            field: escalationDBFields.subsectorName,
            value: adminDetails.assignedArea[0],
            operator: "==",
          },
        ];
        break;
      case userRoles.Umoor:
        // setTitle({label: "Category", value: user.assignedUmoor[0]});
        groupName = "type.value";
        if (!umoorList) getEscalationList();
        else {
          setFilterProps([
            {
              title: "Selected Umoors",
              options: adminDetails.assignedUmoor.map((umoor) => {
                return {
                  label: getLabelForUmoor(umoor) + getCountForUmoor(umoor),
                  value: umoor,
                };
              }),
              selectedOptions: selectedfilterItems.selectedUmoors,
              onChange: (selectedUmoors: string[]) =>
                setSelectedFilterItems({
                  ...selectedfilterItems,
                  selectedUmoors: selectedUmoors.map((umoor) => {
                    return {
                      label: getLabelForUmoor(umoor) + getCountForUmoor(umoor),
                      value: umoor,
                    };
                  }),
                }),
            },
          ]);
          criteria = [
            {
              field: escalationDBFields.umoorName,
              value: selectedfilterItems.selectedUmoors.map(
                (umoor) => umoor.value
              ),
              operator: "in",
            },
          ];
        }
        break;
      case userRoles.Admin:
        setFilterProps([
          {
            title: "Selected Umoors",
            options: adminDetails.assignedUmoor.map((umoor) => {
              return {
                label: getLabelForUmoor(umoor) + getCountForUmoor(umoor),
                value: umoor,
              };
            }),
            selectedOptions: selectedfilterItems.selectedUmoors,
            onChange: (selectedUmoors: string[]) =>
              setSelectedFilterItems({
                ...selectedfilterItems,
                selectedUmoors: selectedUmoors.map((umoor) => {
                  return {
                    label: getLabelForUmoor(umoor) + getCountForUmoor(umoor),
                    value: umoor,
                  };
                }),
              }),
          },
          {
            title: "Selected Regions",
            options: adminDetails.assignedArea.map((area) => {
              return {label: area + getCountForSector(area), value: area};
            }),
            selectedOptions: selectedfilterItems.selectedRegions,
            onChange: (selectedRegions: string[]) =>
              setSelectedFilterItems({
                ...selectedfilterItems,
                selectedRegions: selectedRegions.map((region) => {
                  return {
                    label: region + getCountForSector(region),
                    value: region,
                  };
                }),
              }),
          },
        ]);
        criteria = [
          {
            field: escalationDBFields.umoorName,
            value: selectedfilterItems.selectedUmoors.map(
              (umoor) => umoor.value
            ),
            operator: "in",
          },
          {
            field: escalationDBFields.sectorName,
            value: selectedfilterItems.selectedRegions.map(
              (region) => region.value
            ),
            operator: "in",
          },
        ];
        break;
    }

    let escList: escalationData[] = await getEscalationListByCriteria(criteria);
    // escList = await addExtraDetails(escList);
    // console.log(escList[0].type);

    setEscalationList(
      escList.sort((a, b) =>
        moment(b.created_at, "DD-MM-YYYY HH:mm:ss").diff(
          moment(a.created_at, "DD-MM-YYYY HH:mm:ss")
        )
      )
    );
    if (groupName) {
      setEscalationsStatsGroup(groupEscalationListBy(escList, groupName));
    }
    // console.log(escList, "ESCLIST");
    // getFilterProps();
    toggleLoader(false);
  };

  const setUserDetails = async (user: authUser) => {
    if (user.userRole[0].includes(userRoles.Admin)) {
      const sectors = await getSectorList();
      user.assignedArea = sectors.map((sector) => sector.name);
      const umoors: umoorData[] = await getUmoorList();
      user.assignedUmoor = umoors.map((umoor: umoorData) => umoor.value);
    }
    setAdminDetails(user);
    setSelectedView(user.userRole[0]);
  };

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showAddEscalationModal = () => {
    setShowEscalationModal(true);
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
        {getStatCardList()}
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

        <div className="d-flex w-full float-right">
          <Button
            className={width && width < 576 ? "" : "ml-auto"}
            onClick={showAddEscalationModal}
            type="primary"
            size="large"
          >
            Raise Escalation
          </Button>
        </div>
      </div>

      {/* {selectedView && isReady ? ( */}
      {selectedView ? (
        <EscalationList
          escalationList={escalationList}
          filterProps={filterProps}
          userRole={selectedView}
        />
      ) : null}

      {showEscalationModal ? (
        <AddEscalationModal
          handleClose={() => setShowEscalationModal(false)}
          showModal={showEscalationModal}
          adminDetails={adminDetails as authUser}
          submitCallback={getEscalationList}
        />
      ) : null}
    </Dashboardlayout>
  );
};

export default Dashboard;
