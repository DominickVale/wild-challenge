"use client";

import { Text } from "@visx/text";
import { theme } from "@/app/config/theme";
import { tungstenSemiBold } from "@/app/fonts";
import { images, imageSize } from "@/lib/constants";
import { useIsClient } from "@/lib/hooks/useIsClient";

const width = 70;
const height = "64.4%";
const x = "50.28%";
const lh = "20.3%";
const ls = "0.04em";

type Props = {
  text: string;
};

export const CarouselTitle = (props: Props) => {
  const { text } = props;
  const isClient = useIsClient();

  return (
    <svg
      id="carousel__title"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", userSelect: "none", zIndex: 10 }}
    >
      <defs>
        <clipPath id="textClip">
          <Text
            x={x}
            y={height}
            textAnchor="middle"
            lineHeight={lh}
            dominantBaseline="middle"
            fontSize={theme.fontSize.huge}
            className={tungstenSemiBold.className}
            fill="black"
            stroke="black"
            strokeWidth="2"
            style={{ letterSpacing: ls, textTransform: "uppercase" }}
            width={width}
          >
            {isClient ? text : ""}
          </Text>
        </clipPath>
      </defs>

      {images.map(({ id }) => (
        <rect
          key={id}
          data-img-id={id}
          data-idx={id}
          className="carousel__svg-mask-rect"
          width={imageSize.width}
          height={imageSize.height}
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
        fontSize={theme.fontSize.huge}
        className={tungstenSemiBold.className}
        style={{ letterSpacing: ls, textTransform: "uppercase" }}
        fill="none"
        stroke="white"
        strokeWidth="2"
        width={width}
      >
        {isClient ? text : ""}
      </Text>
    </svg>
  );
};
