import {FC, useContext} from "react";
import GlobalContext from "../../context/GlobalContext";
import {subSectorData} from "../../types";
import styles from "../../styles/components/cards/subSectorPopupCard.module.scss";
import {useRouter} from "next/router";

const SubSectorPopupCard: FC<{subsector: subSectorData}> = ({subsector}) => {
  const gContext = useContext(GlobalContext);
  const router = useRouter();

  const handleRedirectToSubSector = () => {
    router.push(
      "/mohallah/" +
        subsector.sector.name?.toUpperCase() +
        "/" +
        subsector.name.toUpperCase()
    );
  };
  const handleRedirectToSector = () => {
    router.push("/mohallah/" + subsector.sector.name?.toUpperCase());
  };

  return (
    <div className={styles.subSectorPopupContainer}>
      <div className={styles.subSectorPopupContainerDetails}>
        <h3 onClick={handleRedirectToSubSector}>{subsector.name}</h3>
        <h4 onClick={handleRedirectToSector}>
          Mohallah: {subsector.sector.name}
        </h4>
        {subsector.latlng ? (
          <a
            href={`https://www.google.com/maps/dir/${gContext.center.latlng[0]},${gContext.center.latlng[1]}/${subsector.latlng[0]},${subsector.latlng[1]}/`}
            target="_blank"
            rel="noreferrer"
          >
            Directions from {gContext.center.name}
          </a>
        ) : null}
      </div>
    </div>
  );
};
export default SubSectorPopupCard;
