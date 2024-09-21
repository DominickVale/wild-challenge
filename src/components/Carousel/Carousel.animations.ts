import { theme } from "@/app/config/theme";
import { images, imgScaleDownFactor } from "@/lib/constants";
import { isFirstOrLast } from "@/lib/utils/array";
import {
  CarouselPositions,
  onScrollControllerCb,
  recalculateCarouselPositions,
  ScrollDirection,
  useCarouselPositions,
  useScrollController,
} from "./Carousel.hooks";
import { useGSAP } from "@gsap/react";
import { Size, Vec2 } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import gsap from "gsap";
import { useDebouncedOnResize } from "@/lib/hooks/useDebouncedResize";
import { getResponsiveImageSize } from "@/lib/utils/size";

type Props = {
  canChange: boolean;
  setCanChange: Dispatch<SetStateAction<boolean>>;
  onChange(imgId: string, direction: ScrollDirection): void;
};

/////////
//
// Main carousel animation (diagonal slide)
//
export function useCarousel(props: Props) {
  const { canChange, setCanChange, onChange } = props;
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 });
  const [carouselPositions, setCarouselPositions] = useState<CarouselPositions>({
    positions: [],
    origin: { x: 0, y: 0 },
  });
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
  const updateCarousel = contextSafe<onScrollControllerCb>((newForcedIdx, direction) => {
    if (!canChange || positions.length < 5 || imageSize.width <= 0) {
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
      const scaledImageSize = getScaledImageSize(imageSize, isCenter);
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
            x: newPosition.x - imageSize.width / imgScaleDownFactor / 2,
            y: newPosition.y - imageSize.height / imgScaleDownFactor / 2,
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
            ...getNewMaskRecDimensions(newPosition, imageSize, scaledImageSize, isCenter),
            duration: theme.animations.carousel.slideDuration,
            ease: theme.animations.carousel.slideEase,
          },
          "<"
        );
      }

      console.log("new idx: ", oldIdx);
      el.setAttribute("data-idx", newIdx.toString());
      if (isCenter) {
        const imgId = el.getAttribute("data-img-id");
        console.log(el, "img id: ", imgId);
        onChange(imgId || "", direction);
      }
    });
  });

  const scrollState = useScrollController(images, updateCarousel);

  const recalculatePositions = contextSafe((newImageSize: Size) => recalculateCarouselPositions(images, newImageSize));

  // Fix layout on window resize
  const onResizeFix = contextSafe(() => {
    const size = imageSize.width > 0 ? imageSize : getResponsiveImageSize();
    console.log("resizing carousel positions: ", carouselPositions);
    if (carouselPositions.positions.length < 5) return;
    gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el) => {
      const idx = Number(el.getAttribute("data-idx"));

      const pos = positions[idx];
      const isCenter = pos.x === origin.x;
      const scaledImageSize = getScaledImageSize(size, isCenter);
      const maskRectangle = document.querySelector(`#carousel__title .carousel__svg-mask-rect:nth-of-type(${idx + 1})`);

      gsap.set(el, {
        left: pos.x,
        top: pos.y,
        height: scaledImageSize.height,
        width: scaledImageSize.width,
      });
      gsap.set(maskRectangle as SVGRectElement, getNewMaskRecDimensions(pos, size, scaledImageSize, isCenter));
    });
  });

  useEffect(onResizeFix, [imageSize, carouselPositions]);
  useDebouncedOnResize(
    () => {
      const newImageSize = getResponsiveImageSize();
      const newPositions = recalculatePositions(newImageSize)
      setCarouselPositions(newPositions);
      setImageSize(newImageSize);
    },
    { initialRun: true }
  );

  return { scrollState, imageSize, updateCarousel };
}

///////////
//
// dry helpers
//
function getScaledImageSize(imageSize: Size, isCenter: boolean) {
  return {
    width: isCenter ? imageSize.width : imageSize.width / imgScaleDownFactor,
    height: isCenter ? imageSize.height : imageSize.height / imgScaleDownFactor,
  };
}

function getNewMaskRecDimensions(pos: Vec2, imageSize: Size, scaledImageSize: Size, isCenter: boolean) {
  return {
    attr: {
      x: pos.x - scaledImageSize.width / 2 - 16,
      y: pos.y - scaledImageSize.height / 2 - 16,
    },
    autoAlpha: isCenter ? 1 : 0,
    ...getScaledImageSize(imageSize, isCenter),
  };
}
