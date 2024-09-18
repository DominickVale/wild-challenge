"use client";

import { ScrollControllerState } from "@/app/page.hooks";
import { BGImages, BGImagesWrapper, BlurredImage, SliderImage, SliderImagesWrapper } from "@/app/page.styles";
import { useGSAP } from "@gsap/react";
import { useSize } from "ahooks";
import gsap from "gsap";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useCarouselPositions } from "./Carousel.hooks";
import { isFirstOrLast } from "@/lib/utils/array";

type Props = {
  images: Array<{ id: number; url: string; alt: string }>;
  /* the size of the small images */
  imageSize: { width: number; height: number };
  scrollState: ScrollControllerState;
};

export const Carousel = (props: Props) => {
  const { images, imageSize, scrollState } = props;
  const pageDimensions = useSize(document.documentElement);
  const [activeImageId, setActiveImageId] = useState(0);

  const [canChange, setCanChange] = useState(true);
  const { positions, origin } = useCarouselPositions(pageDimensions, images, imageSize);

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

      console.log("old", oldIdx, "new", newIdx, idx);
      const newPosition = positions[newIdx];
      const isCenter = newPosition.x === origin.x;
      // check if the image is being placed from an outside edge to another (0, to last)
      if (isFirstOrLast(oldIdx, images) && isFirstOrLast(newIdx, images)) {
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
            height: isCenter ? imageSize.height * 2.05 : imageSize.height,
            width: isCenter ? imageSize.width * 2.05 : imageSize.width,
            duration: 0.6,
            ease: "power4.inOut",
          },
          "<"
        );
      }
      el.setAttribute("data-idx", newIdx.toString());
      if (isCenter) {
        const imgId = el.getAttribute("data-img-id");
        setActiveImageId(Number(imgId));
      }
    });
  }, [scrollState.activeIdx, scrollState.direction, pageDimensions]);

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

  return (
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
  );
};
