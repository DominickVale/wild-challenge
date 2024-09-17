"use client";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { Container } from "@/components/Container";
import { NavLogo } from "@/components/NavLogo";
import { CTA, HeroType, P } from "@/components/Typography";
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
  const state = useScrollController(images);
  const firstRender = useRef(true);

  useEffect(() => {
    const pageDimensions = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };

    const origin = {
      x: pageDimensions.width / 2,
      y: pageDimensions.height / 2,
    };

    const pattern = {
      x: origin.x - imageSize.width / 2 - 16,
      y: origin.y - imageSize.height / 2 - 16,
    };

    const positions = [
      {
        x: origin.x - 2 * pattern.x,
        y: origin.y + 2 * pattern.y,
      },
      {
        x: origin.x - pattern.x,
        y: origin.y + pattern.y,
      },
      origin,
      {
        x: origin.x + pattern.x,
        y: origin.y - pattern.y,
      },
      {
        x: origin.x + 2 * pattern.x,
        y: origin.y - 2 * pattern.y,
      },
    ];

    const imgs = gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el, idx) => {
      let elIdx = Number(el.getAttribute("data-idx"));

      if (state.direction === "down") {
        elIdx = (elIdx - 1 + images.length) % images.length;
      } else {
        elIdx = (elIdx + 1) % images.length;
      }

      if (elIdx === 0 || elIdx === images.length - 1) {
        gsap.set(el as HTMLElement, {
          left: positions[elIdx].x,
          top: positions[elIdx].y,
        });
      } else {
        gsap.to(el as HTMLElement, {
          left: positions[elIdx].x,
          top: positions[elIdx].y,
        });
      }
      el.setAttribute("data-idx", elIdx.toString());
    });
  }, [state.activeIdx, state.direction]);

  return (
    <Container>
      <div className="debug" />
      <BGImagesWrapper>
        <SliderImagesWrapper id="slider-images__wrapper">
          {images.map(({ id, url, alt }) => (
            <SliderImage key={id} data-idx={id}>
              <Image src={url} fill alt={alt} />
            </SliderImage>
          ))}
        </SliderImagesWrapper>
        <BGImages>
          {images.map(({ id, url }) => (
            <BlurredImage key={id} src={url} $isActive={id === state.activeIdx} fill alt="Background image" />
          ))}
        </BGImages>
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

// const state = useScrollController(images);
// const firstRender = useRef(true);
//
// const initImages = useCallback((arr: number[]) => {
//   const pageDimensions = {
//     width: document.documentElement.clientWidth,
//     height: document.documentElement.clientHeight,
//   };
//   let addX = 0;
//   arr.forEach((imgId, idx) => {
//     const el = gsap.utils.toArray<HTMLElement>(
//       `#slider-images__wrapper > :nth-child(${imgId + 1})`
//     )[0] as HTMLElement;
//     const bbox = el.getBoundingClientRect();
//     if (addX === 0) {
//       addX += bbox.width / 2 + 16;
//     }
//
//     gsap.set(el, {
//       left: addX,
//     });
//     const toChange = pageDimensions.width / 2 - bbox.width / 2 - 16; // displace (mind the page padding)
//     addX += toChange;
//   });
//   firstRender.current = false;
// }, []);
//
// useEffect(() => {
//   let left = (state.activeIdx - 1) % images.length;
//   left = left < 0 ? 4 : left;
//   const right = (state.activeIdx + 1) % images.length;
//
//   const pageDimensions = {
//     width: document.documentElement.clientWidth,
//     height: document.documentElement.clientHeight,
//   };
//
//   if (firstRender.current) {
//     initImages([left, state.activeIdx, right]);
//   } else {
//     const el = gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el, idx) => {
//       const bbox = el.getBoundingClientRect();
//
//       let newLeft = bbox.x + bbox.width / 2; // base pos
//
//       if (newLeft - bbox.width / 2 < 0) {
//         newLeft = pageDimensions.width + Math.abs(newLeft);
//         gsap.set(el, {
//           left: newLeft,
//         });
//       }
//
//       const toChange = pageDimensions.width / 2 - bbox.width / 2 - 16; // displace (mind the page padding)
//       if (state.direction === "up") {
//         newLeft = newLeft + toChange;
//       } else {
//         newLeft = newLeft - toChange;
//       }
//       console.log(newLeft);
//
//       gsap.set(".debug", {
//         height: 10,
//         width: 10,
//         backgroundColor: "red",
//         position: "fixed",
//         left: newLeft,
//       });
//       gsap.to(el, {
//         left: newLeft,
//         duration: 1,
//         ease: "power4.inOut",
//       });
//     });
//   }
// }, [initImages, state.activeIdx, state.direction]);
//
