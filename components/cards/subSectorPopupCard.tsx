import {FC, useContext} from "react";
import GlobalContext from "../../context/GlobalContext";
import {subSectorData} from "../../types";

import styles from "../../styles/components/cards/subSectorPopupCard.module.scss";

const SubSectorPopupCard: FC<{subsector: subSectorData}> = ({subsector}) => {
  const gContext = useContext(GlobalContext);
  const imageurl = subsector.image
    ? subsector.image
    : "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640";
  return (
    <div className={styles.subSectorPopupContainer}>
      {/* <div
        className={styles.subSectorPopupContainerImage}
        style={{
          background: `url(${imageurl})`,
        }}
      >
      </div> */}
      <img src={imageurl} className={styles.subSectorPopupContainerImage} />
      <div className={styles.subSectorPopupContainerDetails}>
        <h2>{subsector.name}</h2>
        <h4>Mohallah: {subsector.sector.name}</h4>
        {subsector.latlng ? (
          <p>
            Sample address, long string to test sample address, 400059 <br></br>
            <a
              href={`https://www.google.com/maps/dir/${gContext.center.latlng[0]},${gContext.center.latlng[1]}/${subsector.latlng[0]},${subsector.latlng[1]}/`}
              target="_blank"
              rel="noreferrer"
            >
              Directions from {gContext.center.name}
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
};
export default SubSectorPopupCard;
