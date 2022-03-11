import { NextPage } from "next";
import { Dashboardlayout } from "../layouts/dashboardLayout";
import styles from "../styles/map.module.scss";

// create a div with height 642
// set background image
// checkout css so that the div takes width of image
// bg image css will be height 642 with auto
//  dive will be position relative and center aligned to the screen

const sectorImgArr = [
  {
    src: "/map-images/shujayi.png",
    left: 0,
    top: 0,
  },
  {
    src: "/map-images/najmi.png",
    left: 340,
    top: 0,
  },
  {
    src: "/map-images/mohammedi.png",
    left: 726,
    top: 126,
  },
  {
    src: "/map-images/hakimi.png",
    left: 480,
    top: 0,
  },
  {
    src: "/map-images/vajihi.png",
    left: 269,
    top: 250,
  },
];

const Map: NextPage = () => {
  return (
    <Dashboardlayout headerTitle="Map View">
      <div className={styles.mainWrapper}>
        <div className={styles.relativeWrapper}>
          <img src="/map-images/view1_base.png" className={styles.baseImage} />
          {sectorImgArr.map((val, index) => (
            <img
              src={val.src}
              className={styles.areaImage}
              style={{ left: val.left, top: val.top }}
            />
          ))}
        </div>
      </div>
    </Dashboardlayout>
  );
};

export default Map;
