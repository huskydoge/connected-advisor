/* eslint-disable no-alert */
import React, { useEffect, useRef } from "react";
import {
  type WalineInstance,
  type WalineInitOptions,
  init,
} from "@waline/client";

import "@waline/client/style";

export type WalineOptions = Omit<WalineInitOptions, "el"> & { path: string };

export const Waline = (props: WalineOptions) => {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      lang: "en",
      dark: "auto",
      // @ts-ignore
      reaction: "true",
    });

    return () => walineInstanceRef.current?.destroy();
  }, [containerRef, props]);

  useEffect(() => {
    walineInstanceRef.current?.update(props);
  }, [props]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};
