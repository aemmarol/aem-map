import {FC} from "react";
import {sectorData} from "../../types";

import styles from "../../styles/components/cards/mapLegendCard.module.scss";
const MapLegendCard: FC<{sectorList: sectorData[]}> = ({sectorList}) => {
  return (
    <div className={styles.legendContainer}>
      {sectorList.map((sector, idx) => (
        <div key={idx} className={styles.legends}>
          <div
            className={styles.bullet}
            style={{
              background: sector.primary_color,
            }}
          ></div>
          <h2 style={{color: "black"}}>{sector.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default MapLegendCard;
