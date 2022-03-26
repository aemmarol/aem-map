import {FC, useEffect} from "react";
import styles from "../../styles/map.module.scss";
import useWindowDimensions from "../../utils/windowDimensions";

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

export const Map1: FC = () => {
  const {height: windowHeight, width: windowWidth} = useWindowDimensions();

  useEffect(() => {
    console.log("dimensions", windowHeight, windowWidth);
  }, [windowHeight, windowWidth]);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.relativeWrapper}>
        <img src="/map-images/view1_base.png" className={styles.baseImage} />
        {sectorImgArr.map((val, index) => (
          <img
            src={val.src}
            className={styles.areaImage}
            style={{left: val.left, top: val.top}}
          />
        ))}
      </div>
    </div>
  );
};
