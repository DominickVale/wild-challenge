"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useState } from "react";
import { images } from "@/lib/constants";
import { theme } from "@/app/config/theme";
import { useCursor } from "../Cursor";
import { useCarousel } from "./Carousel.animations";
import {
  BGImages,
  BGImagesWrapper,
  BlurredImage,
  Container,
  SliderImage,
  SliderImagesWrapper,
  TitleSection,
} from "./Carousel.styles";
import { CarouselCTA } from "./CarouselCTA";
import { CarouselProgress } from "./CarouselProgress";
import { CarouselTitle } from "./CarouselTitle";

gsap.registerPlugin(useGSAP);

export const Carousel = () => {
  const cursor = useCursor();
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const [canChange, setCanChange] = useState(true);
  const [text, setText] = useState(images[activeImageIdx].title);

  const { scrollState, imageSize, updateCarousel } = useCarousel({
    canChange,
    setCanChange,
    onChange: (imgId, direction) => {
      const imgIdx = findImageIdxById(imgId);
      if (cursor?.current && imgIdx >= 0) {
        setActiveImageIdx(imgIdx);
        cursor.current.setState({
          current: imgIdx,
          total: images.length,
          direction: direction,
        });
      }
    },
  });

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

  useEffect(() => {
    const title = images[activeImageIdx]?.title;
    if (title) {
      setText(title);
    }
  }, [activeImageIdx]);

  function onSliderImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const idx = Number(e.currentTarget.getAttribute("data-idx")) || 0;
    const middleIdx = Math.floor(images.length / 2);
    gsap
      .timeline()
      .to(e.currentTarget, {
        scale: 0.98,
        duration: 0.05,
        ease: "power4.out",
      })
      .to(e.currentTarget, {
        scale: 1,
        duration: 0.15,
        ease: "power4.in",
      });
    if (idx < middleIdx) {
      updateCarousel(activeImageIdx - 1, "up");
    } else if (idx > middleIdx) {
      updateCarousel(activeImageIdx + 1, "down");
    }
  }

  function onImageHover(target: HTMLElement, isHovering: boolean) {
    // avoid center image
    if (Number(target.getAttribute("data-idx")) === Math.floor(images.length / 2)) {
      return;
    }
    gsap
      .timeline()
      .to(target, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.8,
        ease: "power4.out",
      })
      .to(
        target,
        {
          duration: 0.15,
          outline: isHovering ? "1px solid white" : "1px solid black",
          ease: "power4.inOut",
        },
        "<"
      );
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
            <SliderImage
              key={id}
              data-idx={idx}
              data-img-id={id}
              onClick={onSliderImageClick}
              onMouseEnter={(e) => onImageHover(e.currentTarget as HTMLElement, true)}
              onMouseLeave={(e) => onImageHover(e.currentTarget as HTMLElement, false)}
            >
              <Image src={url} fill objectFit="cover" alt={alt} />
            </SliderImage>
          ))}
        </SliderImagesWrapper>
      </BGImagesWrapper>
      <TitleSection>
        <CarouselTitle text={text} imageSize={imageSize} />
        <CarouselProgress state={{ current: activeImageIdx, total: images.length, direction: scrollState.direction }} />
        <CarouselCTA currentIdx={activeImageIdx} />
      </TitleSection>
    </Container>
  );
};

const findImageIdxById = (id: string) => images.findIndex((v) => v.id === id);
