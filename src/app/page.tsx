"use client";
import Image from "next/image";
import gsap from "gsap";
import { useEffect, useRef } from "react";
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
  const canChange = useRef(true);

  useEffect(() => {
    if (!canChange.current) {
      return;
    }
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

      if (state.direction === "down") {
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
  }, [state.activeIdx, state.direction]);

  return (
    <Container>
      <div className="debug" />
      <BGImagesWrapper>
        <BGImages>
          {images.map(({ id, url }) => (
            <BlurredImage key={id} src={url} $isActive={id === state.activeIdx} fill alt="Background image" />
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
