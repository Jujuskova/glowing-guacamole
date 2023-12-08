import { useState, useEffect } from "react";

function useResizeWindow() {
  const [windowSize, setWindowSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const handleWindowDimensions = () => {
    setWindowSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowDimensions);
    return () => {
      window.removeEventListener("resize", handleWindowDimensions);
    };
  }, []);

  return {
    windowHeight: windowSize.height,
    windowWidth: windowSize.width,
  };
}

export { useResizeWindow };
