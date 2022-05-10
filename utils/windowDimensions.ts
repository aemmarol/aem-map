import {useEffect, useState} from "react";

const hasWindow = typeof window !== "undefined";

function getWindowDimensions() {
  const width = hasWindow ? window.innerWidth : null;
  const height = hasWindow ? window.innerHeight : null;
  return {
    width: width,
    height: height,
  };
}

export function isMobile() {
  const dim = getWindowDimensions();
  return dim.width && dim.width < 550;
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}
