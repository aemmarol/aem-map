import React, {FC, ReactNode, useContext, useState} from "react";

type Props = {
  children: ReactNode;
};

interface AppContextInterface {
  showLoader: boolean;
  showProgressLoader: boolean;
  toggleLoader: Function;
  toggleProgressLoader: Function;
  progressValue: number;
  setProgressValue: Function;
  changeSelectedSidebarKey: Function;
  center: any;
  selectedSidebarKey: string;
}

const GlobalContext = React.createContext<AppContextInterface>({
  showLoader: false,
  showProgressLoader: false,
  progressValue: 40,
  toggleLoader: () => {},
  toggleProgressLoader: () => {},
  setProgressValue: () => {},
  center: {},
  selectedSidebarKey: "0",
  changeSelectedSidebarKey: () => {},
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({children}: Props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [showProgressLoader, setShowProgressLoader] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [selectedSidebarKey, setSelectedSidebarKey] = useState("0");

  const toggleLoader = (flag: boolean) => {
    setShowLoader(flag);
  };
  const toggleProgressLoader = (flag: boolean) => {
    setShowProgressLoader(flag);
  };
  const changeSelectedSidebarKey = (key: string) => {
    setSelectedSidebarKey(key);
  };
  const center = {
    name: "Marol Saifee Masjid",
    latlng: [19.114085290747965, 72.87583087016348],
  };

  return (
    <GlobalContext.Provider
      value={{
        toggleLoader,
        showLoader,
        toggleProgressLoader,
        showProgressLoader,
        progressValue,
        setProgressValue: (flag: number) => setProgressValue(flag),
        center,
        selectedSidebarKey,
        changeSelectedSidebarKey,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
