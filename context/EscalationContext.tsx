import React, {ReactNode, useContext, useState} from "react";
import {authUser, escalationData, escalationStatus, userRoles} from "../types";
import {
  EscalationFilterType,
  filterTypes,
  selectedFilterItemsType,
} from "../types/escalation";
import {getDateDiffDays} from "../utils";

type Props = {
  children: ReactNode;
};

interface AppContextInterface {
  adminDetails: authUser;
  setAdminDetails: Function;
  selectedView: userRoles | null;
  setSelectedView: Function;
  escalationList: escalationData[];
  setEscalationList: Function;
  escalationFilterProps: EscalationFilterType[];
  setEscalationFilterProps: Function;
  selectedfilterItems: selectedFilterItemsType;
  setSelectedFilterItems: Function;
  getEscalationDownloadData: Function;
  getEscalationDownloadDataHeaders: Function;
}

const EscalationContext = React.createContext<AppContextInterface>({
  adminDetails: {} as authUser,
  setAdminDetails: () => {},
  selectedView: null,
  setSelectedView: () => {},
  escalationList: [] as escalationData[],
  setEscalationList: () => {},
  escalationFilterProps: [] as EscalationFilterType[],
  setEscalationFilterProps: () => {},
  selectedfilterItems: {} as selectedFilterItemsType,
  setSelectedFilterItems: () => {},
  getEscalationDownloadData: () => {},
  getEscalationDownloadDataHeaders: () => {},
});

export const useEscalationContext = () => {
  return useContext(EscalationContext);
};

export const EscalationProvider = ({children}: Props) => {
  const [adminDetails, setadmindetails] = useState<authUser>({} as authUser);
  const [selectedView, setselectedview] = useState<userRoles | null>(null);
  const [escalationList, setescalationlist] = useState<escalationData[]>([]);
  const [escalationFilterProps, setescalationfilterprops] = useState<
    EscalationFilterType[]
  >([]);
  const [selectedfilterItems, setselectedfilteritems] =
    useState<selectedFilterItemsType>({} as selectedFilterItemsType);

  const setAdminDetails = (data: authUser) => {
    setadmindetails(data);
  };
  const setSelectedView = (data: userRoles) => {
    setselectedview(data);
  };

  const setEscalationList = async (data: escalationData[]) => {
    setescalationlist(data);
  };

  const setEscalationFilterProps = (data: EscalationFilterType[]) => {
    setescalationfilterprops(data);
  };

  const setSelectedFilterItems = (data: selectedFilterItemsType) => {
    localStorage.setItem("escFilter", JSON.stringify(data));
    setselectedfilteritems(data);
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
            tempEscData[val.key] = data.type.label;
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

  return (
    <EscalationContext.Provider
      value={{
        setAdminDetails,
        adminDetails,
        selectedView,
        setSelectedView,
        escalationList,
        setEscalationList,
        escalationFilterProps,
        setEscalationFilterProps,
        selectedfilterItems,
        setSelectedFilterItems,
        getEscalationDownloadData,
        getEscalationDownloadDataHeaders,
      }}
    >
      {children}
    </EscalationContext.Provider>
  );
};

export default EscalationContext;
