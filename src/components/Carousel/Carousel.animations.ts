import { theme } from "@/app/config/theme";
import { images, imageSize } from "@/lib/constants";
import { isFirstOrLast } from "@/lib/utils/array";
import { CarouselPositions, onScrollControllerCb, ScrollDirection } from "./Carousel.hooks";
import { useGSAP } from "@gsap/react";
import { Size, Vec2 } from "@/types";
import { Dispatch, SetStateAction } from "react";
import gsap from "gsap";

type Props = {
  canChange: boolean;
  pageDimensions: Size | undefined;
  carouselPositions: CarouselPositions;
  setCanChange: Dispatch<SetStateAction<boolean>>;
  onChange(imgId: string, direction: ScrollDirection): void;
};

export function useOnScrollCarousel(props: Props) {
  const { canChange, pageDimensions, carouselPositions, setCanChange, onChange } = props;
  const { positions, origin } = carouselPositions;

  const { contextSafe } = useGSAP();

  // Main carousel animation (diagonal slide)
  const updateSlider = contextSafe<onScrollControllerCb>((newScrollIdx, direction) => {
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

      if (direction === "down") {
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
            duration: theme.animations.carousel.slideDuration,
            ease: theme.animations.carousel.slideEase,
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
            duration: theme.animations.carousel.slideDuration,
            ease: theme.animations.carousel.slideEase,
          },
          "<"
        );
      }
      el.setAttribute("data-idx", newIdx.toString());
      if (isCenter) {
        const imgId = el.getAttribute("data-img-id");
        onChange(imgId || "", direction);
      }
    });
  });
  return updateSlider;
}
