import "../styles/globals.scss";
import "../firebase/firebaseConfig";
import type {AppProps} from "next/app";
import {GlobalProvider} from "../context/GlobalContext";

const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <GlobalProvider>
        <Component {...pageProps} />
      </GlobalProvider>
    </>
  );
};

export default MyApp;
