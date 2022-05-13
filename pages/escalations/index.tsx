import {Button, message, Select} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {logout, verifyUser} from "../api/v1/authentication";
import {authUser, escalationData, userRoles} from "../../types";
import {AddEscalationModal} from "../../components";
import {useGlobalContext} from "../../context/GlobalContext";
import {EscalationList} from "../../components/custom/escalations/escalationList";
import {getSectorList} from "../api/v1/db/sectorCrud";
import {getUmoorList} from "../api/v1/db/umoorsCrud";
import {
  Criteria,
  escalationDBFields,
  getEscalationListByCriteriaClientSide,
} from "../api/v1/db/escalationsCrud";
import {EscalationFilterType} from "../../components/custom/escalations/escalationFilter";
import {filterOption} from "../../types/escalation";
import moment from "moment";

interface selectedFilterItemsType {
  selectedUmoors: filterOption[];
  selectedRegions: filterOption[];
  ready: boolean;
}
const Dashboard: NextPage = () => {
  const router = useRouter();
  const {changeSelectedSidebarKey} = useGlobalContext();

  const [adminDetails, setAdminDetails] = useState<authUser>({} as authUser);
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<userRoles>();
  const [filterProps, setFilterProps] = useState<EscalationFilterType[]>([]);
  const [umoorList, setUmoorList] = useState([]);
  const [selectedfilterItems, setSelectedFilterItems] =
    useState<selectedFilterItemsType>({
      selectedUmoors: [],
      selectedRegions: [],
      ready: false,
    });
  const [escalationList, setEscalationList] = useState<escalationData[]>([]);
  const [isReady, setIsReady] = useState(false);

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
    const queryUmoor = router.query.umoor?.toString();
    const querySector = router.query.sector?.toString();
    const umoors = await getUmoorList();
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
              label: umoors.find((item: any) => item.value == queryUmoor).label,
              value: queryUmoor,
            },
          ]
        : adminDetails.assignedUmoor
        ? adminDetails.assignedUmoor.map((umoor) => {
            return {
              label: umoors.find((item: any) => item.value == umoor).label,
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
  const getEscalationList = async () => {
    let criteria: Criteria[] = [];
    switch (selectedView) {
      case userRoles.Masool:
      case userRoles.Masoola:
        // setTitle({label: "Region", value: user.assignedArea[0]});
        setFilterProps([
          {
            title: "Selected Regions",
            options: adminDetails.assignedArea.map((area) => {
              return {label: area, value: area};
            }),
            selectedOptions: adminDetails.assignedArea.map((area) => {
              return {label: area, value: area};
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
        setFilterProps([
          {
            title: "Selected Regions",
            options: adminDetails.assignedArea.map((area) => {
              return {label: area, value: area};
            }),
            selectedOptions: adminDetails.assignedArea.map((area) => {
              return {label: area, value: area};
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
        if (!umoorList) getEscalationList();
        else {
          setFilterProps([
            {
              title: "Selected Umoors",
              options: adminDetails.assignedUmoor.map((umoor) => {
                return {label: getLabelForUmoor(umoor), value: umoor};
              }),
              selectedOptions: selectedfilterItems.selectedUmoors,
              onChange: (selectedUmoors: string[]) =>
                setSelectedFilterItems({
                  ...selectedfilterItems,
                  selectedUmoors: selectedUmoors.map((umoor) => {
                    return {label: getLabelForUmoor(umoor), value: umoor};
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
              return {label: getLabelForUmoor(umoor), value: umoor};
            }),
            selectedOptions: selectedfilterItems.selectedUmoors,
            onChange: (selectedUmoors: string[]) =>
              setSelectedFilterItems({
                ...selectedfilterItems,
                selectedUmoors: selectedUmoors.map((umoor) => {
                  return {label: getLabelForUmoor(umoor), value: umoor};
                }),
              }),
          },
          {
            title: "Selected Regions",
            options: adminDetails.assignedArea.map((area) => {
              return {label: area, value: area};
            }),
            selectedOptions: selectedfilterItems.selectedRegions,
            onChange: (selectedRegions: string[]) =>
              setSelectedFilterItems({
                ...selectedfilterItems,
                selectedRegions: selectedRegions.map((region) => {
                  return {label: region, value: region};
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
    const escList: escalationData[] =
      await getEscalationListByCriteriaClientSide(criteria);
    setEscalationList(
      escList.sort((a, b) =>
        moment(b.created_at, "DD-MM-YYYY HH:mm:ss").diff(
          moment(a.created_at, "DD-MM-YYYY HH:mm:ss")
        )
      )
    );
    setIsReady(true);
  };

  const setUserDetails = async (user: authUser) => {
    if (user.userRole[0].includes(userRoles.Admin)) {
      const sectors = await getSectorList();
      user.assignedArea = sectors.map((sector) => sector.name);
      const umoors = await getUmoorList();
      user.assignedUmoor = umoors.map((umoor: any) => umoor.value);
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
      <div className="d-flex mb-16">
        {adminDetails &&
        adminDetails.userRole &&
        adminDetails.userRole.length > 1 ? (
          <div className="flex-align-center flex-1">
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

        {selectedView === "Umoor" ? null : (
          <div className="d-flex w-full float-right">
            <Button
              className="ml-auto"
              onClick={showAddEscalationModal}
              type="primary"
              size="large"
            >
              Raise Escalation
            </Button>
          </div>
        )}
      </div>

      {selectedView && isReady ? (
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
