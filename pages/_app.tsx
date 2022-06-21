import "../styles/globals.scss";
import type {AppProps} from "next/app";
import {GlobalProvider} from "../context/GlobalContext";
import {EscalationProvider} from "../context/EscalationContext";

const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <GlobalProvider>
        <EscalationProvider>
          <Component {...pageProps} />
        </EscalationProvider>
      </GlobalProvider>
    </>
  );
};

export default MyApp;
