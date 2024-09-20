"use client";

import { useGSAP } from "@gsap/react";
import { useMount, useSize } from "ahooks";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isFirstOrLast } from "@/lib/utils/array";
import { images, imageSize } from "@/lib/constants";
import { theme } from "@/app/config/theme";
import { CTA, P } from "../Typography";
import { useCursor } from "../Cursor";
import { type onScrollControllerCb, useCarouselPositions, useScrollController } from "./Carousel.hooks";
import {
  BGImages,
  BGImagesWrapper,
  BlurredImage,
  Container,
  CTASection,
  SliderImage,
  SliderImagesWrapper,
  TitleSection,
} from "./Carousel.styles";
import { CarouselProgress } from "./CarouselProgress";
import { CarouselTitle } from "./CarouselTitle";
import { CarouselCTA } from "./CarouselCTA";
import { useOnScrollCarousel } from "./Carousel.animations";

gsap.registerPlugin(useGSAP);

export const Carousel = () => {
  const pageDimensions = useSize(typeof window !== "undefined" ? document.documentElement : null);
  const { setCursorState } = useCursor();
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const hasAnimatedIn = useRef(true);

  const [canChange, setCanChange] = useState(true);
  const [text, setText] = useState(images[activeImageIdx].title);
  const carouselPositions = useCarouselPositions(pageDimensions, images, imageSize);

  const onScrollCarousel = useOnScrollCarousel({
    canChange,
    setCanChange,
    carouselPositions,
    pageDimensions,
    onChange: (imgId, direction) => {
      const imgIdx = findImageIdxById(imgId);
      if (setCursorState && imgIdx >= 0) {
        setActiveImageIdx(imgIdx);
        setCursorState({
          current: imgIdx,
          total: images.length,
          direction: direction,
        });
      }
    },
  });

  useGSAP(() => {
    if (hasAnimatedIn.current && carouselPositions.positions?.length >= 5) {
      onScrollCarousel(0, "down");
      hasAnimatedIn.current = false;
    }
  }, [carouselPositions.positions, onScrollCarousel]);

  const scrollState = useScrollController(images, onScrollCarousel);

  // Background (blurred) images animations
  useGSAP(() => {
    if (activeImageIdx >= 0) {
      const tl = gsap
        .timeline()
        .to("#slider-bg__wrapper > *", {
          opacity: 0,
          duration: theme.animations.carousel.backgroundDuration,
          ease: "power4.inOut",
        })
        .to(
          `#slider-bg__wrapper > *:nth-child(${activeImageIdx + 1})`,
          {
            opacity: 1,
            duration: theme.animations.carousel.backgroundDuration,
            ease: "power4.inOut",
          },
          "<"
        );
    }
  }, [activeImageIdx]);

  //Title & mask animations
  useGSAP(() => {
    const title = images[activeImageIdx]?.title;
    if (title) {
      setText(title);
    }
  }, [activeImageIdx]);

  function onSliderImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const idx = Number(e.currentTarget.getAttribute("data-idx")) || 0;
    const middleIdx = Math.floor(images.length / 2);
    if (idx < middleIdx) {
      onScrollCarousel(activeImageIdx - 1, "up");
    } else if (idx > middleIdx) {
      onScrollCarousel(activeImageIdx + 1, "down");
    }
  }

  return (
    <Container id="carousel">
      <BGImagesWrapper>
        <BGImages id="slider-bg__wrapper">
          {images.map(({ id, url }) => (
            <BlurredImage key={id} src={url} data-img-id={id} fill alt="Background image" />
          ))}
        </BGImages>
        <SliderImagesWrapper id="slider-images__wrapper">
          {images.map(({ id, url, alt }, idx) => (
            <SliderImage key={id} data-idx={idx} data-img-id={id} onClick={onSliderImageClick}>
              <Image src={url} fill alt={alt} />
            </SliderImage>
          ))}
        </SliderImagesWrapper>
      </BGImagesWrapper>
      <TitleSection>
        <CarouselTitle text={text} />
        <CarouselProgress
          pageDimensions={pageDimensions}
          state={{ current: activeImageIdx, total: images.length, direction: scrollState.direction }}
        />
        <CarouselCTA currentIdx={activeImageIdx} />
      </TitleSection>
    </Container>
  );
};

const findImageById = (id: string) => images.find((v) => v.id === id);
const findImageIdxById = (id: string) => images.findIndex((v) => v.id === id);
