"use client";

import { useGSAP } from "@gsap/react";
import { useSize } from "ahooks";
import gsap from "gsap";
import Image from "next/image";
import { useState } from "react";
import { isFirstOrLast } from "@/lib/utils/array";
import { images, imageSize } from "@/lib/constants";
import { CTA, P } from "../Typography";
import { useCursor } from "../Cursor";
import { useCarouselPositions, useScrollController } from "./Carousel.hooks";
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

export const Carousel = () => {
  const scrollState = useScrollController(images);
  const pageDimensions = useSize(typeof window !== "undefined" ? document.documentElement : null);
  const { setCursorState } = useCursor();
  const [activeImageId, setActiveImageId] = useState(0);

  const [canChange, setCanChange] = useState(true);
  const [text, setText] = useState("");
  const { positions, origin } = useCarouselPositions(pageDimensions, images, imageSize);

  // Main carousel animation (diagonal slide)
  useGSAP(() => {
    if (!canChange || !pageDimensions || positions.length < 5) {
      return;
    }

    const tl = gsap.timeline({
      onStart: () => {
        setCanChange(false);
      },
      onComplete: () => {
        setCanChange(true);
      },
    });

    gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el, idx) => {
      const oldIdx = Number(el.getAttribute("data-idx"));
      let newIdx = oldIdx || 0;

      if (scrollState.direction === "down") {
        newIdx = (newIdx - 1 + images.length) % images.length;
      } else {
        newIdx = (newIdx + 1) % images.length;
      }

      const newPosition = positions[newIdx];
      const isCenter = newPosition.x === origin.x;
      const scaledImageSize = {
        width: isCenter ? imageSize.width * 2.05 : imageSize.width,
        height: isCenter ? imageSize.height * 2.05 : imageSize.height,
      };
      const maskRectangle = document.querySelector(`#carousel__title .carousel__svg-mask-rect:nth-child(${idx + 2})`);
      // check if the image is being placed from an outside edge to another (0, to last)
      if (isFirstOrLast(oldIdx, images) && isFirstOrLast(newIdx, images)) {
        gsap.set(el as HTMLElement, {
          left: newPosition.x,
          top: newPosition.y,
        });
        gsap.set(maskRectangle as SVGRectElement, {
          attr: {
            x: newPosition.x - imageSize.width / 2,
            y: newPosition.y - imageSize.height / 2,
          },
        });
      } else {
        tl.to(
          el as HTMLElement,
          {
            left: newPosition.x,
            top: newPosition.y,
            // we are animating height & width because transform: scale
            // affects borders and makes life more complicated. TL;DR worth the compromise
            height: scaledImageSize.height,
            width: scaledImageSize.width,
            duration: 0.3,
            ease: "power4.inOut",
          },
          "<"
        ).to(
          maskRectangle as SVGRectElement,
          {
            attr: {
              x: newPosition.x - scaledImageSize.width / 2 - 16,
              y: newPosition.y - scaledImageSize.height / 2 - 16,
            },
            height: isCenter ? imageSize.height * 2.05 : imageSize.height,
            width: isCenter ? imageSize.width * 2.05 : imageSize.width,
            duration: 0.3,
            ease: "power4.inOut",
          },
          "<"
        );
      }
      el.setAttribute("data-idx", newIdx.toString());
      if (isCenter) {
        const imgId = Number(el.getAttribute("data-img-id"));
        setActiveImageId(imgId);
        if (setCursorState) {
          setCursorState({
            current: imgId,
            total: images.length,
            direction: scrollState.direction,
          });
        }
      }
    });
  }, [scrollState.activeIdx, scrollState.direction, pageDimensions]);

  // Background (blurred) images animations
  useGSAP(() => {
    const tl = gsap
      .timeline()
      .to("#slider-bg__wrapper > *", {
        opacity: 0,
        duration: 0.5,
        ease: "power4.inOut",
      })
      .to(
        `#slider-bg__wrapper > *:nth-child(${activeImageId + 1})`,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power4.inOut",
        },
        "<"
      );
  }, [activeImageId]);

  //Title & mask animations
  useGSAP(() => {
    setText(images[activeImageId].title);
  }, [activeImageId]);

  return (
    <Container id="carousel">
      <BGImagesWrapper>
        <BGImages id="slider-bg__wrapper">
          {images.map(({ id, url }) => (
            <BlurredImage key={id} src={url} data-img-id={id} fill alt="Background image" />
          ))}
        </BGImages>
        <SliderImagesWrapper id="slider-images__wrapper">
          {images.map(({ id, url, alt }) => (
            <SliderImage key={id} data-idx={id} data-img-id={id}>
              <Image src={url} fill alt={alt} />
            </SliderImage>
          ))}
        </SliderImagesWrapper>
      </BGImagesWrapper>
      <TitleSection>
        <CarouselTitle text={text} />
        <CarouselProgress pageDimensions={pageDimensions} state={{ current: activeImageId, total: images.length }} />
        <CarouselCTA currentIdx={activeImageId} />
      </TitleSection>
    </Container>
  );
};
