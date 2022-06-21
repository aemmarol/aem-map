import React, { ReactNode, useContext, useState } from "react";
import { authUser, escalationData, userRoles } from "../types";
import { EscalationFilterType, filterTypes, selectedFilterItemsType } from "../types/escalation";

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
}

const EscalationContext = React.createContext<AppContextInterface>({
  adminDetails: {} as authUser,
  setAdminDetails: () => { },
  selectedView: null,
  setSelectedView: () => { },
  escalationList: [] as escalationData[],
  setEscalationList: () => { },
  escalationFilterProps: [] as EscalationFilterType[],
  setEscalationFilterProps: () => { },
  selectedfilterItems: {} as selectedFilterItemsType,
  setSelectedFilterItems: () => { },
});

export const useEscalationContext = () => {
  return useContext(EscalationContext);
};

export const EscalationProvider = ({ children }: Props) => {
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
    localStorage.setItem("escFilter",JSON.stringify(data))
    setselectedfilteritems(data);
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
        setSelectedFilterItems
      }}
    >
      {children}
    </EscalationContext.Provider>
  );
};

export default EscalationContext;
