"use client";

import { useGSAP } from "@gsap/react";
import { useSize } from "ahooks";
import gsap from "gsap";
import { TextPlugin } from "gsap/all";
import { useRef, useState } from "react";
import { Flex } from "../Flex";
import { ProgressBarDot } from "../ProgressBar";
import { ProgressContainer, ProgressCounterText } from "./CarouselProgress.styles";

gsap.registerPlugin(TextPlugin);

type Props = {
  pageDimensions: ReturnType<typeof useSize>;
  state: {
    current: number;
    direction: "up" | "down";
    total: number;
  };
};

export const CarouselProgress = (props: Props) => {
  const { pageDimensions, state } = props;
  const carouselRef = useRef(null);
  const [isFirstSpan, setIsFirstSpan] = useState(true);

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

  useGSAP(() => {
    const animateOutSelector = `#carousel__counter span > :nth-child(${isFirstSpan ? 1 : 2})`;
    const animateInSelector = `#carousel__counter span > :nth-child(${isFirstSpan ? 2 : 1})`;
    gsap.set(animateInSelector, {
      text: (state.current + 1).toString() + " ",
      y: state.direction === "up" ? 20 : -20,
    });
    gsap
      .timeline()
      .to(animateOutSelector, {
        y: state.direction === "up" ? -20 : 20,
        autoAlpha: 0,
        duration: 0.8,
      })
      .to(
        animateInSelector,
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
        },
        "<"
      );
    setIsFirstSpan((s) => !s);
  }, [state.current]);

  return (
    <ProgressContainer ref={carouselRef}>
      <Flex direction="row" gap="1.5rem" align="flex-end">
        <ProgressCounterText id="carousel__counter">
          <span>
            <span>{state.current + 1}</span>
            <span></span>
          </span>
          of {state.total}
        </ProgressCounterText>
        <Flex direction="row" gap="0.5rem" align="flex-end">
          {Array(state.total)
            .fill(null)
            .map((_, idx) => (
              <ProgressBarDot key={idx} $isActive={idx === state.current} />
            ))}
        </Flex>
      </Flex>
    </ProgressContainer>
  );
};
