import {FC, useEffect} from "react";
import {ImLocation} from "react-icons/im";
import styles from "../../styles/map.module.scss";
import useWindowDimensions from "../../utils/windowDimensions";
import {Popover} from "antd";

const sectorImgArr = [
  {
    src: "/map-images/shujayi.png",
    left: 0,
    top: 0,
    label: "Shujayi",
  },
  {
    src: "/map-images/najmi.png",
    left: 340,
    top: 0,
    label: "Najmi",
  },
  {
    src: "/map-images/mohammedi.png",
    left: 726,
    top: 126,
    label: "Mohammedi",
  },
  {
    src: "/map-images/hakimi.png",
    left: 480,
    top: 0,
    label: "Hakimi",
  },
  {
    src: "/map-images/vajihi.png",
    left: 269,
    top: 250,
    label: "Vajihi",
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
        {sectorImgArr.map((val) => (
          <div>
            <img
              src={val.src}
              className={styles.areaImage}
              style={{left: val.left, top: val.top}}
            />
            <span>
              <Popover content={val.label}>
                <ImLocation
                  style={{left: val.left + 90, top: val.top + 90}}
                  className={styles.areaImage}
                />
              </Popover>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
