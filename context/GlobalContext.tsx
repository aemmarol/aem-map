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
  center: any;
}

const GlobalContext = React.createContext<AppContextInterface>({
  showLoader: false,
  showProgressLoader: false,
  progressValue: 40,
  toggleLoader: () => {},
  toggleProgressLoader: () => {},
  setProgressValue: () => {},
  center: {},
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({children}: Props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [showProgressLoader, setShowProgressLoader] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const toggleLoader = (flag: boolean) => {
    setShowLoader(flag);
  };
  const toggleProgressLoader = (flag: boolean) => {
    setShowProgressLoader(flag);
  };

  const center = {
    name: "Marol Saifee Masjid",
    latlng: [19.114092679220292, 72.87610986824751],
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
