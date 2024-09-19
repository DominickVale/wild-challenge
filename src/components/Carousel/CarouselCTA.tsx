"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { images } from "@/lib/constants";
import { CTA, P } from "../Typography";
import { CTASection } from "./Carousel.styles";

type Props = {
  currentIdx: number;
};

export const CarouselCTA = (props: Props) => {
  const { currentIdx } = props;
  const sectionRef = useRef(null);
  const state = images[currentIdx];

  useGSAP(() => {}, [currentIdx]);

  return (
    <CTASection ref={sectionRef}>
      <P>
        {state.author}
        <br />
        FOR {state.client}
      </P>
      <P>{state.date}</P>
      <CTA href="/">HAVE A LOOK</CTA>
    </CTASection>
  );
};
