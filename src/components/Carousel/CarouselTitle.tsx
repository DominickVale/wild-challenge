"use client";

import { theme } from "@/config/theme";
import { tungstenSemiBold } from "@/app/fonts";
import { images, imgScaleDownFactor } from "@/lib/constants";
import { useDebouncedWindowSize } from "@/lib/hooks/useDebouncedResize";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { Size } from "@/types";
import { Text } from "@visx/text";
import { useEffect, useRef, useState } from "react";
import { CarouselTitleWrapper, SrOnlyH1 } from "./CarouselTitle.styles";
import { useTitleChangeAnimation } from "./CarouselTitle.animations";

const WIDTH = 70;
const HEIGHT = "45.4%";
const X = "50.28%";
const LH = "0.85em";
const LS = "0.052em";

type Props = {
  text: string;
  imageSize: Size;
};

// I couldn't figure out why the SVG text broke when resizing, so i just hacked this together.
// Wraps around the actual Title, remounting it on resize
export const CarouselTitle = (props: Props) => {
  const [key, setKey] = useState(0);
  const wSize = useDebouncedWindowSize();
  const oldWSize = useRef(
    typeof window === "undefined"
      ? null
      : {
          height: document.documentElement.clientHeight,
          width: document.documentElement.clientWidth,
        }
  );

  useEffect(() => {
    if (wSize && oldWSize.current) {
      if (wSize.width !== oldWSize.current.width || wSize.height !== oldWSize.current.height) {
        setKey((prevKey) => prevKey + 1);
        oldWSize.current = { ...wSize };
      }
    }
  }, [wSize]);

  return <CarouselTitleInner key={key} {...props} />;
};

const CarouselTitleInner = (props: Props) => {
  const { text, imageSize } = props;

  const wrapperRef = useRef(null);
  const isClient = useIsClient();

  const [newText] = useTitleChangeAnimation(isClient, text, imageSize, { x: X, height: HEIGHT }, wrapperRef);

  const textToRender = isClient ? newText || images[0].title : "";

  return (
    <>
      <SrOnlyH1 className="sr-only" aria-live="polite" aria-atomic="false" aria-label="Work title">
        {textToRender}
      </SrOnlyH1>
      <CarouselTitleWrapper
        id="carousel__title"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        ref={wrapperRef}
      >
        <defs>
          <clipPath id="textClip">
            <Text
              id="carousel__svg-text-clipPath"
              x={X}
              y={HEIGHT}
              textAnchor="middle"
              lineHeight={LH}
              dominantBaseline="middle"
              fontSize={theme.fontSize.huge}
              className={tungstenSemiBold.className}
              fill="black"
              stroke="black"
              strokeWidth="1"
              verticalAnchor="middle"
              style={{ letterSpacing: LS, textTransform: "uppercase", transformOrigin: "center" }}
              width={WIDTH}
            >
              {textToRender}
            </Text>
          </clipPath>
        </defs>

        {images.map(({ id }) => (
          <rect
            key={id}
            data-img-id={id}
            data-idx={id}
            className="carousel__svg-mask-rect"
            width={imageSize.width / imgScaleDownFactor}
            height={imageSize.height / imgScaleDownFactor}
            x="35%"
            y="12%"
            fill="white"
            clipPath="url(#textClip)"
          />
        ))}

        <Text
          id="carousel__svg-text"
          x={X}
          y={HEIGHT}
          textAnchor="middle"
          dominantBaseline="middle"
          lineHeight={LH}
          verticalAnchor="middle"
          fontSize={theme.fontSize.huge}
          className={tungstenSemiBold.className}
          style={{ letterSpacing: LS, textTransform: "uppercase", transformOrigin: "center" }}
          fill="none"
          stroke="white"
          strokeWidth="1"
          width={WIDTH}
        >
          {textToRender}
        </Text>
      </CarouselTitleWrapper>
    </>
  );
};
