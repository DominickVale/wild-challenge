import { theme } from "@/app/config/theme";
import { images, imgScaleDownFactor } from "@/lib/constants";
import { isFirstOrLast } from "@/lib/utils/array";
import { CarouselPositions, onScrollControllerCb, ScrollDirection, useScrollController } from "./Carousel.hooks";
import { useGSAP } from "@gsap/react";
import { Size, Vec2 } from "@/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useDebouncedOnResize } from "@/lib/hooks/useDebouncedResize";
import { getResponsiveImageSize } from "@/lib/utils/size";
import { recalculateCarouselPositions } from "./Carousel.utils";

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
  const isFirstTime = useRef(true);
  const [carouselPositions, setCarouselPositions] = useState<CarouselPositions>({
    positions: [],
    origin: { x: 0, y: 0 },
  });
  const { positions, origin } = carouselPositions;

  const { contextSafe } = useGSAP();

  const setupIndices = contextSafe(() => {
    const centerIndex = Math.floor(images.length / 2);

    gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el, idx) => {
      let initialIdx = (idx - centerIndex + images.length - 1) % images.length;
      el.setAttribute("data-idx", initialIdx.toString());
      const img = el.querySelector("img");

      // Position the element based on this initial index
      const initialPosition = positions[initialIdx];
      createSliderSetter(el, initialIdx, imageSize, initialPosition, origin);
      setupParallax(img!);
    });
  });

  useEffect(() => {
    if (isFirstTime.current && positions.length > 0) {
      setupIndices();
      isFirstTime.current = false;
    }
  }, [positions]);

  // Main carousel slide logic / animation
  const updateCarousel = contextSafe<onScrollControllerCb>((_, direction) =>
    animateSlider({
      carouselPositions,
      imageSize,
      direction,
      onChange,
      canChange,
      setCanChange,
    })
  );
  //////////////////

  const scrollState = useScrollController(images, updateCarousel);

  // Fix layout on window resize
  const onResizeFix = contextSafe(() => {
    if (carouselPositions.positions.length < 5) return;
    gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el) => {
      const idx = Number(el.getAttribute("data-idx"));
      const pos = positions[idx];
      createSliderSetter(el, idx, imageSize, pos, origin);
    });
  });

  useEffect(onResizeFix, [imageSize, carouselPositions]);
  useDebouncedOnResize(
    () => {
      const newImageSize = getResponsiveImageSize();
      const newPositions = recalculateCarouselPositions(images, newImageSize);
      setCarouselPositions(newPositions);
      setImageSize(newImageSize);
    },
    { initialRun: true }
  );

  return { scrollState, imageSize, updateCarousel };
}

///////////
//
// Helpers / anims
//
type AnimateSliderProps = {
  canChange: boolean;
  setCanChange: React.Dispatch<React.SetStateAction<boolean>>;
  carouselPositions: CarouselPositions;
  imageSize: Size;
  onChange: Props["onChange"];
  direction: ScrollDirection;
};

// main carousel animation (diagonal slide)
function animateSlider(props: AnimateSliderProps) {
  const { canChange, setCanChange, carouselPositions, imageSize, onChange, direction } = props;
  const { positions, origin } = carouselPositions;
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
    const parallax = createParallaxAnimation(imgEl, direction);

    updateImageDataCursor(imgEl, newPosition, origin, isCenter)

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
        },
        "<"
      )
        .to(
          maskRectangle as SVGRectElement,
          {
            ...getNewMaskRecDimensions(newPosition, imageSize, scaledImageSize, isCenter),
            duration: theme.animations.carousel.slideDuration,
            ease: theme.animations.carousel.slideEase,
          },
          "<"
        )
        .add(parallax.paused(false), "<");
    }

    el.setAttribute("data-idx", newIdx.toString());
    if (isCenter) {
      const imgId = el.getAttribute("data-img-id");
      onChange(imgId || "", direction);
    }
  });
}

// Sets both image and mask at he correct location
function createSliderSetter(el: HTMLElement, idx: number, imageSize: Size, pos: Vec2, origin: Vec2) {
  const isCenter = pos.x === origin.x;
  const size = imageSize.width > 0 ? imageSize : getResponsiveImageSize();
  const scaledImageSize = getScaledImageSize(size, isCenter);
  const maskRectangle = document.querySelector(`#carousel__title .carousel__svg-mask-rect:nth-of-type(${idx + 1})`);
  const img = el.querySelector("img")!;
  updateImageDataCursor(img, pos, origin, isCenter)
  return gsap
    .timeline()
    .set(el, {
      left: pos.x,
      top: pos.y,
      height: scaledImageSize.height,
      width: scaledImageSize.width,
    })
    .set(maskRectangle as SVGRectElement, getNewMaskRecDimensions(pos, size, scaledImageSize, isCenter));
}

function setupParallax(el: HTMLElement) {
  const offset = theme.animations.carousel.imageSizeOffset;
  const dividedOffset = offset / 3;
  gsap.set(el, {
    width: 100 + offset + "%",
    height: 100 + offset + "%",
    left: -dividedOffset + "%",
    top: -dividedOffset + "%",
  });
}

function createParallaxAnimation(el: HTMLElement, direction: ScrollDirection) {
  const offset = theme.animations.carousel.imageSizeOffset;
  const dividedOffset = offset / 3;
  const xMove = direction === "down" ? dividedOffset : -dividedOffset;
  const yMove = direction === "down" ? -dividedOffset : dividedOffset;
  const baseDuration = theme.animations.carousel.slideDuration;

  return gsap
    .timeline({ paused: true })
    .to(el, {
      transform: `translate(${xMove}%, ${yMove}%)`,
      duration: baseDuration / 1.8,
      ease: "power3.inOut",
    })
    .to(el, {
      transform: `translate(0, 0)`,
      duration: baseDuration / 2,
      ease: "power3.out",
    });
}

function updateImageDataCursor(img: HTMLImageElement, pos: Vec2, origin: Vec2, isCenter: boolean) {
  if (isCenter) {
    img.removeAttribute("data-cursor-hover");
    img.removeAttribute("data-cursor-text");
  } else {
    img.setAttribute("data-cursor-hover", "true");
    img.setAttribute("data-cursor-text", pos.x > origin.x ? "NEXT" : "PREV");
  }
}

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
