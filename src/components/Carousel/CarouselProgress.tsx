"use client";

import { useGSAP } from "@gsap/react";
import { useSize } from "ahooks";
import gsap from "gsap";
import { useRef } from "react";
import { Flex } from "../Flex";
import { ProgressBar, ProgressBarDot } from "../ProgressBar";
import { P } from "../Typography";
import { ProgressContainer } from "./CarouselProgress.styles";

type Props = {
  pageDimensions: ReturnType<typeof useSize>;
  state: {
    current: number;
    total: number;
  };
};

export const CarouselProgress = (props: Props) => {
  const { pageDimensions, state } = props;
  const carouselRef = useRef(null);

  useGSAP(() => {
    const svgTextElement = document.querySelector("#carousel__svg-text");
    if (svgTextElement) {
      const tspans = svgTextElement.querySelectorAll("tspan");
      if (tspans.length > 1) {
        const lastTspan = tspans[tspans.length - 1];
        const boundingBox = lastTspan.getBoundingClientRect();

        gsap.set(carouselRef.current, {
          top: `calc((${Math.ceil(boundingBox.bottom)} / 16 * 1rem) - 2rem)`,
          left: 0,
        });
      }
    }
  }, [pageDimensions]);

  return (
    <ProgressContainer ref={carouselRef}>
      <Flex direction="row" gap="1.5rem">
        <P>
          {state.current + 1} of {state.total}
        </P>
        <ProgressBar>
          {Array(state.total)
            .fill(null)
            .map((_, idx) => (
              <ProgressBarDot key={idx} $isActive={idx === state.current} />
            ))}
        </ProgressBar>
      </Flex>
    </ProgressContainer>
  );
};
