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
  const [newText, setNewText] = useState("");
  const wrapperRef = useRef(null);
  const isClient = useIsClient();

  useGSAP(() => {
    gsap.fromTo(
      wrapperRef.current,
      {
        autoAlpha: 0,
      },
      {
        delay: theme.animations.carousel.slideDuration / 2,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.inOut",
      }
    );
  }, []);

  useGSAP(() => {
    if (!isClient && text) return;
    const durationOut = theme.animations.carousel.slideDuration / 4;
    const ease = "power4.inOut";
    const textId = "#carousel__svg-text-clipPath";
    const textClipId = "#carousel__svg-text";

    gsap
      .timeline()
      // SCALE
      .to([textId, textClipId], {
        transform: "scale(0.5)",
        duration: durationOut,
        ease: "power4.out",
      })
      .to([textId, textClipId], {
        transform: "scale(1)",
        duration: 0.8,
        ease: "power4.in",
      })
      // DISAPPEAR
      // TEXT
      .to(
        textId + " > :first-child",
        {
          attr: {
            x: "0%",
          },
          autoAlpha: 0,
          duration: durationOut,
          ease,
        },
        "<"
      )
      .to(
        textId + " > :nth-child(2)",
        {
          attr: {
            x: "100%",
          },
          autoAlpha: 0,
          duration: durationOut,
          ease,
        },
        "<"
      )
      // CLIP
      .to(
        textClipId + " > :first-child",
        {
          attr: {
            x: "0%",
          },
          autoAlpha: 0,
          duration: durationOut,
          ease,
        },
        "<"
      )
      .to(
        textClipId + " > :nth-child(2)",
        {
          attr: {
            x: "100%",
          },
          autoAlpha: 0,
          duration: durationOut,
          ease,
        },
        "<"
      )
      .add(() => {
        setNewText(text);
      });
  }, [text]);

  useGSAP(() => {
    if (!isClient) return;
    const ease = "power4.inOut";
    const durationIn = theme.animations.carousel.slideDuration / 1.8;
    const textId = "#carousel__svg-text-clipPath";
    const textClipId = "#carousel__svg-text";
    gsap
      .timeline()
      // REAPPEAR
      // TEXT
      .to(textId + " > :first-child", {
        attr: {
          x,
        },
        autoAlpha: 1,
        duration: durationIn,
        ease,
      })
      .to(
        textId + " > :nth-child(2)",
        {
          attr: {
            x,
          },
          autoAlpha: 1,
          duration: durationIn,
          ease,
        },
        "<"
      )
      // CLIP
      .to(
        textClipId + " > :first-child",
        {
          attr: {
            x,
          },
          autoAlpha: 1,
          duration: durationIn,
          ease,
        },
        "<"
      )
      .to(
        textClipId + " > :nth-child(2)",
        {
          attr: {
            x,
          },
          autoAlpha: 1,
          duration: durationIn,
          ease,
        },
        "<"
      );
  }, [newText]);

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

