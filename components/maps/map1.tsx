import {FC, useEffect} from "react";
import {ImLocation} from "react-icons/im";
import styles from "../../styles/components/maps/map1.module.scss";
import useWindowDimensions from "../../utils/windowDimensions";
import {Popover} from "antd";

const sectorImgArr = [
  {
    src: "/map-images/shujayi.png",
    left: 0,
    top: 0,
    markerLeft:100,
    markerTop:300,
    label: "Shujayi",
  },
  {
    src: "/map-images/najmi.png",
    left: 340,
    top: 0,
    markerLeft:460,
    markerTop:300,
    label: "Najmi",
  },
  {
    src: "/map-images/mohammedi.png",
    left: 726,
    top: 126,
    markerLeft:950,
    markerTop:300,
    label: "Mohammedi",
  },
  {
    src: "/map-images/hakimi.png",
    left: 480,
    top: 0,
    markerLeft:640,
    markerTop:120,
    label: "Hakimi",
  },
  {
    src: "/map-images/vajihi.png",
    left: 269,
    top: 250,
    markerLeft:340,
    markerTop:300,
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
        {sectorImgArr.map((val,label) => (
          <div key={label}>
            <img
              src={val.src}
              className={styles.areaImage}
              style={{left: val.left, top: val.top}}
            />
            <span>
              <Popover content={val.label}>
                <ImLocation
                  style={{left: val.markerLeft, top: val.markerTop}}
                  className={styles.marker}
                />
              </Popover>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
