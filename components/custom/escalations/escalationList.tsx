import moment from "moment";
import React, {FC, useEffect, useState} from "react";
import {
  Criteria,
  escalationDBFields,
  getEscalationListByCriteriaClientSide,
} from "../../../pages/api/v1/db/escalationsCrud";
import {authUser, escalationData, userRoles} from "../../../types";
import useWindowDimensions, {isMobile} from "../../../utils/windowDimensions";
import {EscalationCard} from "./escalationCard";
import {EscalationTable} from "./escalationTable";

import styles from "../../../styles/components/custom/escalationList.module.scss";
import {EscalationFilter, EscalationFilterType} from "./escalationFilter";
import {filterOption} from "../../../types/escalation";
import {useRouter} from "next/router";
import {getUmoorList} from "../../../pages/api/v1/db/umoorsCrud";
import {Col, Empty, Row} from "antd";

interface EscalationListType {
  user: authUser;
  userRole: userRoles;
}
interface selectedFilterItemsType {
  selectedUmoors: filterOption[];
  selectedRegions: filterOption[];
  ready: boolean;
}
export const EscalationList: FC<EscalationListType> = ({user, userRole}) => {
  const router = useRouter();
  const {height} = useWindowDimensions();
  const [escalationList, setEscalationList] = useState<escalationData[]>([]);
  const [umoorList, setUmoorList] = useState([]);
  const [selectedfilterItems, setSelectedFilterItems] =
    useState<selectedFilterItemsType>({
      selectedUmoors: [],
      selectedRegions: [],
      ready: false,
    });
  const [filterProps, setFilterProps] = useState<EscalationFilterType[]>([]);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    initFilters();
  }, []);

  useEffect(() => {
    if (selectedfilterItems.ready) {
      getEscalationList();
    }
  }, [selectedfilterItems, userRole]);

  const initFilters = async () => {
    const queryUmoor = router.query.umoor?.toString();
    const querySector = router.query.sector?.toString();
    const umoors = await getUmoorList();
    setUmoorList(umoors);
    setSelectedFilterItems({
      selectedRegions: querySector
        ? [{label: querySector, value: querySector}]
        : user.assignedArea
        ? user.assignedArea.map((area) => {
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
        : user.assignedUmoor
        ? user.assignedUmoor.map((umoor) => {
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
    switch (userRole) {
      case userRoles.Masool:
      case userRoles.Masoola:
        // setTitle({label: "Region", value: user.assignedArea[0]});
        setFilterProps([
          {
            title: "Selected Regions",
            options: user.assignedArea.map((area) => {
              return {label: area, value: area};
            }),
            selectedOptions: user.assignedArea.map((area) => {
              return {label: area, value: area};
            }),
            disabled: true,
            onChange: null,
          },
        ]);
        criteria = [
          {
            field: escalationDBFields.sectorName,
            value: user.assignedArea[0],
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
            options: user.assignedArea.map((area) => {
              return {label: area, value: area};
            }),
            selectedOptions: user.assignedArea.map((area) => {
              return {label: area, value: area};
            }),
            disabled: true,
            onChange: null,
          },
        ]);
        criteria = [
          {
            field: escalationDBFields.subsectorName,
            value: user.assignedArea[0],
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
              options: user.assignedUmoor.map((umoor) => {
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
            options: user.assignedUmoor.map((umoor) => {
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
            options: user.assignedArea.map((area) => {
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
  return isReady ? (
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
  ) : (
    <Empty />
  );
};
