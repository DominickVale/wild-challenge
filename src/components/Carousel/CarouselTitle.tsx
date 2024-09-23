"use client";

import { Text } from "@visx/text";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { theme } from "@/app/config/theme";
import { tungstenSemiBold } from "@/app/fonts";
import { images, imgScaleDownFactor } from "@/lib/constants";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { Size } from "@/types";
import { CarouselTitleWrapper } from "./Carousel.styles";
import { useTitleChangeAnimation } from "./CarouselTitle.animations";

const width = 70;
const height = "45.4%";
const x = "50.28%";
const lh = "0.85em";
const ls = "0.052em";

type Props = {
  text: string;
  imageSize: Size;
};

const L_BREAKPOINT = 750;
// todo fix height to ~55% on mobile
export const CarouselTitle = (props: Props) => {
  const { text, imageSize } = props;

  const wrapperRef = useRef(null);
  const isClient = useIsClient();

  const [newText] = useTitleChangeAnimation(isClient, text, imageSize, { x, height }, wrapperRef);

  return (
    <CarouselTitleWrapper
      id="carousel__title"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      ref={wrapperRef}
    >
      <defs>
        <clipPath id="textClip">
          <Text
            id="carousel__svg-text-clipPath"
            x={x}
            y={height}
            textAnchor="middle"
            lineHeight={lh}
            dominantBaseline="middle"
            fontSize={theme.fontSize.huge}
            className={tungstenSemiBold.className}
            fill="black"
            stroke="black"
            strokeWidth="1"
            verticalAnchor="middle"
            style={{ letterSpacing: ls, textTransform: "uppercase", transformOrigin: "center" }}
            width={width}
          >
            {isClient ? newText || images[0].title : ""}
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
        x={x}
        y={height}
        textAnchor="middle"
        dominantBaseline="middle"
        lineHeight={lh}
        verticalAnchor="middle"
        fontSize={theme.fontSize.huge}
        className={tungstenSemiBold.className}
        style={{ letterSpacing: ls, textTransform: "uppercase", transformOrigin: "center" }}
        fill="none"
        stroke="white"
        strokeWidth="1"
        width={width}
      >
        {isClient ? newText || images[0].title : ""}
      </Text>
    </CarouselTitleWrapper>
  );
};
