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
}

const GlobalContext = React.createContext<AppContextInterface>({
  showLoader: false,
  showProgressLoader: false,
  progressValue: 40,
  toggleLoader: () => {},
  toggleProgressLoader: () => {},
  setProgressValue: () => {},
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

  return (
    <GlobalContext.Provider
      value={{
        toggleLoader,
        showLoader,
        toggleProgressLoader,
        showProgressLoader,
        progressValue,
        setProgressValue: (flag: number) => setProgressValue(flag),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
