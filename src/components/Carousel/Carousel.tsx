"use client";

import { useSize } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { BGImagesWrapper, BGImages, BlurredImage, SliderImagesWrapper, SliderImage } from "@/app/page.styles";
import { ScrollControllerState } from "@/app/page.hooks";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  images: Array<{ id: number; url: string; alt: string }>;
  /* the size of the small images */
  imageSize: { width: number; height: number };
  scrollState: ScrollControllerState;
};

export const Carousel = (props: Props) => {
  const { images, imageSize, scrollState } = props;
  const pageDimensions = useSize(document.documentElement);

  const [canChange, setCanChange] = useState(true);

  useGSAP(() => {
    if (!canChange || !pageDimensions) {
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
  );
};
