"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { images } from "@/lib/constants";
import { theme } from "@/app/config/theme";
import { CTA, P } from "../Typography";
import { CTASection } from "./Carousel.styles";

type Props = {
  currentIdx: number;
};

//@todo: fix text changing before animation
export const CarouselCTA = (props: Props) => {
  const { currentIdx } = props;
  const sectionRef = useRef(null);
  const state = images[currentIdx];

  useGSAP(() => {
    const durationOut = theme.animations.carousel.slideDuration / 3;
    const durationIn = theme.animations.carousel.slideDuration / 1.5;
    const ease = "power4.inOut";
    gsap
      .timeline()
      .to("#carousel__cta > :first-child", {
        x: "-5vh",
        autoAlpha: 0,
        duration: durationOut,
        ease,
      })
      .to(
        "#carousel__cta > :nth-child(2)",
        {
          x: "5vh",
          autoAlpha: 0,
          duration: durationOut,
          ease,
        },
        "<"
      )
      .to(
        "#carousel__cta-button",
        {
          autoAlpha: 0,
          duration: durationOut,
          ease,
        },
        "<"
      )
      .to("#carousel__cta > :first-child", {
        delay: theme.animations.carousel.slideDuration,
        x: "0",
        autoAlpha: 1,
        duration: durationIn,
        ease,
      })

      .to(
        "#carousel__cta > :nth-child(2)",
        {
          x: "0",
          autoAlpha: 1,
          duration: durationIn,
          ease,
        },
        "<"
      )
      .to(
        "#carousel__cta-button",
        {
          autoAlpha: 1,
          duration: durationIn,
          ease,
        },
        "<"
      );
  }, [currentIdx]);

  return (
    <CTASection ref={sectionRef} id="carousel__cta">
      <P>
        {state.author}
        <br />
        FOR {state.client}
      </P>
      <P>{state.date}</P>
      <CTA href="/" id="carousel__cta-button">
        HAVE A LOOK
      </CTA>
    </CTASection>
  );
};
