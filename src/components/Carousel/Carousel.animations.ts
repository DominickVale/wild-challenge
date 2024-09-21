import { theme } from "@/app/config/theme";
import { images, imageSize } from "@/lib/constants";
import { isFirstOrLast } from "@/lib/utils/array";
import { CarouselPositions, onScrollControllerCb, ScrollDirection } from "./Carousel.hooks";
import { useGSAP } from "@gsap/react";
import { Size, Vec2 } from "@/types";
import { Dispatch, SetStateAction } from "react";
import gsap from "gsap";
import { useDebouncedOnResize } from "@/lib/hooks/useDebouncedResize";

type Props = {
  canChange: boolean;
  pageDimensions: Size | undefined;
  carouselPositions: CarouselPositions;
  setCanChange: Dispatch<SetStateAction<boolean>>;
  onChange(imgId: string, direction: ScrollDirection): void;
};

/////////
//
// Main carousel animation (diagonal slide)
//
export function useOnScrollCarousel(props: Props) {
  const { canChange, pageDimensions, carouselPositions, setCanChange, onChange } = props;
  const { positions, origin } = carouselPositions;

  const { contextSafe } = useGSAP();

  // Simple parallax
  const parallax = contextSafe((el: HTMLImageElement, direction: ScrollDirection) => {
    const offset = theme.animations.carousel.imageSizeOffset;
    const dividedOffset = offset / 3;
    const xMove = direction === "down" ? dividedOffset : -dividedOffset;
    const yMove = direction === "down" ? -dividedOffset : dividedOffset;

    gsap.set(el, {
      width: 100 + offset + "%",
      height: 100 + offset + "%",
      left: -dividedOffset + "%",
      top: -dividedOffset + "%",
    });
    gsap
      .timeline()
      .to(el, {
        transform: `translate(${xMove}%, ${yMove}%)`,
        duration: theme.animations.carousel.slideDuration / 1.8,
        ease: "power3.inOut",
      })
      .to(el, {
        transform: `translate(0, 0)`,
        duration: theme.animations.carousel.slideDuration / 2,
        ease: "power3.out",
      });
  });

  // Animate slider
  const updateSlider = contextSafe<onScrollControllerCb>((newScrollIdx, direction) => {
    if (!canChange || !pageDimensions || positions.length < 5) {
      return;
    }

    const tl = gsap.timeline({
      onStart: () => {
        setCanChange(false);
      },
      onComplete: () => {
        setTimeout(() => {
          setCanChange(true);
        }, theme.animations.carousel.slideEndOffset * 1000);
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
      const scaledImageSize = getScaledImageSize(isCenter);
      const maskRectangle = document.querySelector(`#carousel__title .carousel__svg-mask-rect:nth-of-type(${idx + 1})`);
      const imgEl = el.querySelector("img") as HTMLImageElement;
      parallax(imgEl, direction);

      // check if the image is being placed from an outside edge to another (0, to last)
      if (isFirstOrLast(oldIdx, images) && isFirstOrLast(newIdx, images)) {
        gsap.set(el, {
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
          el,
          {
            left: newPosition.x,
            top: newPosition.y,
            // we are animating height & width because transform: scale
            // affects borders and makes life more complicated. TL;DR worth the compromise
            height: scaledImageSize.height,
            width: scaledImageSize.width,
            duration: theme.animations.carousel.slideDuration,
            ease: theme.animations.carousel.slideEase,
            stagger: 0.5,
          },
          "<"
        ).to(
          maskRectangle as SVGRectElement,
          {
            ...getNewMaskRecDimensions(newPosition, scaledImageSize, isCenter),
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

//
// Fired on window resize — recalculates positions in place
export function useOnCarouselResizeFix(carouselPositions: CarouselPositions) {
  const { positions, origin } = carouselPositions;
  const { contextSafe } = useGSAP();

  const fn = contextSafe(() => {
    if (carouselPositions.positions.length < 5) return;
    gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el) => {
      const idx = Number(el.getAttribute("data-idx"));

      const pos = positions[idx];
      const isCenter = pos.x === origin.x;
      const scaledImageSize = getScaledImageSize(isCenter);
      const maskRectangle = document.querySelector(`#carousel__title .carousel__svg-mask-rect:nth-of-type(${idx + 1})`);

      gsap.set(el, {
        left: pos.x,
        top: pos.y,
        height: scaledImageSize.height,
        width: scaledImageSize.width,
      });
      gsap.set(maskRectangle as SVGRectElement, getNewMaskRecDimensions(pos, scaledImageSize, isCenter));
    });
  });

  useDebouncedOnResize(fn);
}

///////////
//
// dry helpers
//
function getScaledImageSize(isCenter: boolean) {
  return {
    width: isCenter ? imageSize.width * 2.05 : imageSize.width,
    height: isCenter ? imageSize.height * 2.05 : imageSize.height,
  };
}

function getNewMaskRecDimensions(pos: Vec2, scaledImageSize: Size, isCenter: boolean) {
  return {
    attr: {
      x: pos.x - scaledImageSize.width / 2 - 16,
      y: pos.y - scaledImageSize.height / 2 - 16,
    },
    height: isCenter ? imageSize.height * 2.05 : imageSize.height,
    width: isCenter ? imageSize.width * 2.05 : imageSize.width,
    autoAlpha: isCenter ? 1 : 0,
  };
}
