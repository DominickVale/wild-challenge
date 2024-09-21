"use client";

import { useGSAP } from "@gsap/react";
import { useSize } from "ahooks";
import gsap from "gsap";
import { TextPlugin } from "gsap/all";
import { useRef, useState } from "react";
import { Flex } from "../Flex";
import { ProgressBarDot } from "../ProgressBar";
import { ProgressContainer, ProgressCounterText } from "./CarouselProgress.styles";
import { theme } from "@/app/config/theme";

gsap.registerPlugin(TextPlugin);

type Props = {
  pageDimensions: ReturnType<typeof useSize>;
  state: {
    current: number;
    direction: "up" | "down";
    total: number;
  };
};

// todo fix counter on first render
export const CarouselProgress = (props: Props) => {
  const { pageDimensions, state } = props;
  const progressContainerRef = useRef(null);
  const [isFirstSpan, setIsFirstSpan] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useGSAP(() => {
    gsap.to(progressContainerRef.current, {
      delay: theme.animations.carousel.slideDuration,
      autoAlpha: 1,
      duration: 1,
      ease: "power3.inOut",
      onStart: () => {
        setIsAnimatingIn(true);
      },
    });
  }, []);

  // attach self to bottom of svg title
  useGSAP(() => {
    const svgTextElement = document.querySelector("#carousel__svg-text") as SVGTextElement;
    if (svgTextElement && svgTextElement.ownerSVGElement) {
      const bbox = svgTextElement.getBBox();
      const svgRect = svgTextElement.ownerSVGElement.getBoundingClientRect();

      gsap.set(progressContainerRef.current, {
        top: `calc((${Math.ceil(svgRect.top + bbox.y + bbox.height)} / 16 * 1rem) - 2rem)`,
        left: 0,
      });
    }
  }, [pageDimensions, isAnimatingIn]);

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
        duration: 1,
        ease: "power3.out",
      })
      .fromTo(
        animateInSelector,
        { autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.in",
        },
        "<"
      );
    setIsFirstSpan((s) => !s);
  }, [state.current]);

  return (
    <ProgressContainer ref={progressContainerRef}>
      <Flex direction="row" gap="1.5rem" align="center">
        <ProgressCounterText id="carousel__counter">
          <span>
            <span></span>
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
