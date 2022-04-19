import {FC} from "react";
import {sectorData} from "../../types";
import styles from "../../styles/components/cards/mapLegendCard.module.scss";

const MapLegendCard: FC<{
  sectorList: sectorData[];
  clickHandler: (sector: sectorData) => void;
}> = ({sectorList, clickHandler}) => {
  return (
    <div className={styles.legendContainer}>
      {sectorList.map((sector, idx) => (
        <div key={idx} className={styles.legends}>
          <div
            className={styles.bullet}
            style={{
              background: sector.primary_color,
            }}
          />
          <h4 style={{cursor: "pointer"}} onClick={() => clickHandler(sector)}>
            {sector.name}
          </h4>
        </div>
      ))}
    </div>
  );
};

export default MapLegendCard;
