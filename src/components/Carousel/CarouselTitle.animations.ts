import { theme } from "@/config/theme";
import { Size } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MutableRefObject, useState } from "react";

export function useTitleChangeAnimation(
  isClient: boolean,
  text: string | null,
  imageSize: Size,
  initialDimensions: { x: string; height: string },
  wrapperRef: MutableRefObject<SVGSVGElement | null>
) {
  const [newText, setNewText] = useState("");
  const { x } = initialDimensions;

  useGSAP(() => {
    disappear({
      wrapperRef,
      text,
      newText,
      setNewText,
      isClient,
    });
  }, [text, imageSize]);

  useGSAP(() => {
    reappear(isClient, x);
  }, [newText]);

  return [newText];
}

//
//
/////////

type DisappearProps = {
  isClient: boolean;
  text: string | null;
  wrapperRef: MutableRefObject<SVGSVGElement | null>;
  setNewText: React.Dispatch<React.SetStateAction<string>>;
  newText: string;
};

function disappear(props: DisappearProps) {
  const { isClient, text, wrapperRef, newText, setNewText } = props;
  if (!isClient || newText === text || !text) return;
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
    .set(wrapperRef.current, { autoAlpha: 1 })
    .add(() => {
      setNewText(text);
    });
}

function reappear(isClient: boolean, x: string) {
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
}
