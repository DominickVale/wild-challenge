"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { images } from "@/lib/constants";
import { theme } from "@/app/config/theme";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { CTA, P } from "../Typography";
import { CTASection } from "./Carousel.styles";

type Props = {
  currentIdx: number;
};

//@todo: fix text changing before animation
export const CarouselCTA = (props: Props) => {
  const { currentIdx } = props;
  const wrapperRef = useRef(null);
  const state = images[currentIdx];
  const isClient = useIsClient();

  useGSAP(() => {
    gsap.to(wrapperRef.current, {
      delay: theme.animations.carousel.slideDuration,
      autoAlpha: 1,
      duration: theme.animations.carousel.slideDuration / 2,
      ease: "power3.inOut",
    });
  }, []);

  useGSAP(() => {
    if (!isClient) return;
    const durationOut = theme.animations.carousel.slideDuration / 5;
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
        "<+20%"
      )
      // .to(
      //   "#carousel__cta-button",
      //   {
      //     autoAlpha: 0,
      //     duration: durationIn,
      //     ease,
      //   },
      //   "<"
      // )
      .set("#carousel__cta-details > p:first-child", {
        text: state.author,
      })
      .set("#carousel__cta-details > p:last-child", {
        text: "for " + state.client,
      })
      .set("#carousel__cta-date", {
        text: state.date,
      })
      .to("#carousel__cta > :first-child", {
        x: "0",
        // we need the CTA to attract the viewer's eye and not compete with the other anims
        // but the animation still needs to fit in the overall carousel slide tl
        delay: 0.5,
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
        "<+30%"
      );
    // .to(
    //   "#carousel__cta-button",
    //   {
    //     autoAlpha: 1,
    //     duration: durationIn,
    //     ease,
    //   },
    //   "<30%"
    // );
  }, [currentIdx]);

  return (
    <CTASection ref={wrapperRef} id="carousel__cta">
      <span id="carousel__cta-details">
        <P>{images[0].author}</P>
        <P>FOR {images[0].client}</P>
      </span>
      <P id="carousel__cta-date">{images[0].date}</P>
      <CTA href="/" id="carousel__cta-button" data-cursor-hover>
        HAVE A LOOK
      </CTA>
    </CTASection>
  );
};
