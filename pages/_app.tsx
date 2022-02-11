import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import {config} from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import "../styles/globals.scss";
import "../firebase/firebaseConfig";
import type {AppProps} from "next/app";

function MyApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
