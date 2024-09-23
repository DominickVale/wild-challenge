import { useGSAP } from "@gsap/react";
import { MutableRefObject, useRef, useState } from "react";
import { theme } from "@/app/config/theme";
import { Size } from "@/types";
import gsap from "gsap";

export function useTitleChangeAnimation(
  isClient: boolean,
  text: string,
  imageSize: Size,
  initialDimensions: { x: string; height: string },
  wrapperRef: MutableRefObject<SVGSVGElement | null>
) {
  const [newText, setNewText] = useState("");
  const { x } = initialDimensions;

  useGSAP(() => {
    if (!isClient || newText === text) return;
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
      .set(wrapperRef.current, { autoAlpha: 1})
      .add(() => {
        setNewText(text);
      });
  }, [text, imageSize]);

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

  return [newText];
}
