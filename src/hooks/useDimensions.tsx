// hooks/useDimensions.js
import { useLayoutEffect, useState, useRef } from "react";

const useDimensions = () => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return [ref, dimensions];
};

export default useDimensions;
