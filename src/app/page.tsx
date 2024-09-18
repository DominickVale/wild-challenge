"use client";
import Image from "next/image";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useSize } from "ahooks";
import { Container } from "@/components/Container";
import { NavLogo } from "@/components/NavLogo";
import { CTA, HeroType, P } from "@/components/Typography";
import { Vec2 } from "@/types";
import { Flex } from "../components/Flex";
import { ProgressBar, ProgressBarDot } from "../components/ProgressBar";
import { useScrollController } from "./page.hooks";
import {
  BGImages,
  BGImagesWrapper,
  BlurredImage,
  CTASection,
  Header,
  HeroSection,
  SliderImage,
  SliderImagesWrapper,
} from "./page.styles";

const images = [
  { id: 0, url: "/images/image01.jpg", alt: "Background picture" },
  { id: 1, url: "/images/image02.jpg", alt: "Background picture" },
  { id: 2, url: "/images/image03.jpg", alt: "Background picture" },
  { id: 3, url: "/images/image04.jpg", alt: "Background picture" },
  { id: 4, url: "/images/image05.jpg", alt: "Background picture" },
];

const imageSize = {
  height: 330,
  width: 248,
};

export default function Home() {
  const scrollState = useScrollController(images);
  const pageDimensions = useSize(document.documentElement);

  const canChange = useRef(true);

  useEffect(() => {
    if (!canChange.current || !pageDimensions) {
      return;
    }
    const origin = {
      x: pageDimensions.width / 2,
      y: pageDimensions.height / 2,
    };

    const pattern = {
      x: origin.x - imageSize.width / 2 - 16,
      y: origin.y - imageSize.height / 2 - 16,
    };

    const positions = images.map((_, idx) => {
      const offset = idx - Math.floor(images.length / 2);
      return {
        x: origin.x + offset * pattern.x,
        y: origin.y - offset * pattern.y,
      };
    });
    const isOutside = (i: number) => i === 0 || i === positions.length - 1;

    const tl = gsap.timeline({
      onStart: () => {
        canChange.current = false;
      },
      onComplete: () => {
        canChange.current = true;
      },
    });

    gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el, idx) => {
      const oldIdx = Number(el.getAttribute("data-idx"));
      let newIdx = oldIdx;

      if (scrollState.direction === "down") {
        newIdx = (newIdx - 1 + images.length) % images.length;
      } else {
        newIdx = (newIdx + 1) % images.length;
      }

      const newPosition = positions[newIdx];
      // check if the image is being placed from an outside edge to another (0, to last)
      if (isOutside(oldIdx) && isOutside(newIdx)) {
        gsap.set(el as HTMLElement, {
          left: newPosition.x,
          top: newPosition.y,
        });
      } else {
        tl.to(
          el as HTMLElement,
          {
            left: newPosition.x,
            top: newPosition.y,
            // we are animating height & width because transform: scale
            // affects borders and makes life more complicated. TL;DR worth the compromise
            height: newPosition.x === origin.x ? imageSize.height * 2.05 : imageSize.height,
            width: newPosition.x === origin.x ? imageSize.width * 2.05 : imageSize.width,
            duration: 0.6,
            ease: "power4.inOut",
          },
          "<"
        );
      }
      el.setAttribute("data-idx", newIdx.toString());
    });
  }, [scrollState.activeIdx, scrollState.direction, pageDimensions]);

  return (
    <Container>
      <div className="debug" />
      <BGImagesWrapper>
        <BGImages>
          {images.map(({ id, url }) => (
            <BlurredImage key={id} src={url} fill alt="Background image" />
          ))}
        </BGImages>
        <SliderImagesWrapper id="slider-images__wrapper">
          {images.map(({ id, url, alt }) => (
            <SliderImage key={id} data-idx={id}>
              <Image src={url} fill alt={alt} />
            </SliderImage>
          ))}
        </SliderImagesWrapper>
      </BGImagesWrapper>
      <Header>
        <nav>
          <NavLogo href="/">XYZ PHOTOGRAPHY</NavLogo>
        </nav>
      </Header>
      <HeroSection>
        <HeroType>
          EVERYDAY
          <br />
          FLOWERS
        </HeroType>
        <Flex direction="row" gap="1.5rem">
          <P>1 of 5</P>
          <ProgressBar>
            <ProgressBarDot $isActive />
            <ProgressBarDot />
            <ProgressBarDot />
            <ProgressBarDot />
            <ProgressBarDot />
          </ProgressBar>
        </Flex>
        <CTASection>
          <P>
            JOHANNA HOBEL
            <br />
            FOR WILD
          </P>
          <P>DEC 2019</P>
          <CTA href="/">HAVE A LOOK</CTA>
        </CTASection>
      </HeroSection>
    </Container>
  );
}
