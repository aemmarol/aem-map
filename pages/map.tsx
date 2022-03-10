import {NextPage} from "next";
import {useEffect} from "react";
import {Dashboardlayout} from "../layouts/dashboardLayout";
import styles from "../styles/map.module.scss";

const Map: NextPage = () => {
  return (
    <Dashboardlayout headerTitle="Map View">
      <img src="/map-images/view1_base.png" className={styles.areaImage} />
      <img src="/map-images/shujayi.png" className={styles.areaImage} />
      <img
        src="/map-images/najmi.png"
        className={styles.areaImage}
        style={{left: "24.5%"}}
      />
      <img
        src="/map-images/hakimi.png"
        className={styles.areaImage}
        style={{left: "33.5%"}}
      />
      <img
        src="/map-images/mohammedi.png"
        className={styles.areaImage}
        style={{left: "49.5%", bottom: 0}}
      />
      <img
        src="/map-images/vajihi.png"
        className={styles.areaImage}
        style={{left: "19.7%", top: "47%"}}
      />
    </Dashboardlayout>
  );
};

export default Map;
