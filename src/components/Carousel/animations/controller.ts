import { theme } from "@/config/theme";
import { images, imgScaleDownFactor } from "@/lib/constants";
import { useDebouncedOnResize } from "@/lib/hooks/useDebouncedResize";
import { isFirstOrLast } from "@/lib/utils/array";
import { Size, Vec2 } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CarouselPositions, ScrollControllerCallbacks, ScrollDirection, useScrollController } from "../Carousel.hooks";
import {
  getResponsiveImageSize,
  getDraggedPos,
  getNewMaskRecDimensions,
  getScaledImageSize,
  recalculateCarouselPositions,
  updateImageDataCursor,
} from "./utils";

type Props = {
  canChange: boolean;
  setCanChange: Dispatch<SetStateAction<boolean>>;
  onChange(imgId: string, direction: ScrollDirection): void;
};

/////////
//
// Main carousel animation logic (diagonal slide)
//
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

  // Setup ordered slides
  useGSAP(() => {
    setupOrderedSlides(isFirstTime, positions, origin, imageSize);
  }, [positions]);

  // Main carousel slide logic / animation
  const onCarouselScroll = contextSafe<ScrollControllerCallbacks["onScroll"]>((direction, wasDragging) =>
    animateSlider({
      wasDragging,
      carouselPositions,
      imageSize,
      direction,
      onChange,
      canChange,
      setCanChange,
    })
  );

  const onCarouselDrag = contextSafe<ScrollControllerCallbacks["onDrag"]>((delta) =>
    dragSlider({ delta, carouselPositions, imageSize })
  );

  const onCarouselDragEnd = contextSafe<ScrollControllerCallbacks["onDragEnd"]>((_, direction) => {
    onCarouselScroll(direction, true);
  });

  const scrollState = useScrollController(canChange, {
    onScroll: onCarouselScroll,
    onDrag: onCarouselDrag,
    onDragEnd: onCarouselDragEnd,
  });

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

  return { scrollState, imageSize, updateCarousel: onCarouselScroll };
}

//
//
//
//
///////////

type AnimateSliderProps = {
  wasDragging: boolean;
  canChange: boolean;
  setCanChange: React.Dispatch<React.SetStateAction<boolean>>;
  carouselPositions: CarouselPositions;
  imageSize: Size;
  onChange: Props["onChange"];
  direction: ScrollDirection;
};

// main carousel animation (diagonal slide)
function animateSlider(props: AnimateSliderProps) {
  const { wasDragging, canChange, setCanChange, carouselPositions, imageSize, onChange, direction } = props;
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
    let parallax = null;
    if (!wasDragging) parallax = createParallaxAnimation(imgEl, direction);

    //todo disambiguate from dir
    updateImageDataCursor(imgEl, newPosition, origin, isCenter);

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
          outline: "1px solid black",
          duration: theme.animations.carousel.slideDuration,
          ease: wasDragging ? "power2.out" : theme.animations.carousel.slideEase,
        },
        "<"
      ).to(
        maskRectangle as SVGRectElement,
        {
          ...getNewMaskRecDimensions(newPosition, imageSize, scaledImageSize, isCenter),
          duration: theme.animations.carousel.slideDuration,
          ease: wasDragging ? "power4.out" : theme.animations.carousel.slideEase,
        },
        "<"
      );
      if (!wasDragging) {
        tl.add(parallax!.paused(false), "<");
      }
    }

    el.setAttribute("data-idx", newIdx.toString());
    if (isCenter) {
      const imgId = el.getAttribute("data-img-id");
      onChange(imgId || "", direction);
    }
  });
}

type DragSliderProps = {
  delta: number;
  carouselPositions: CarouselPositions;
  imageSize: Size;
};

function dragSlider(props: DragSliderProps) {
  const { carouselPositions, imageSize, delta } = props;
  const { positions, origin } = carouselPositions;

  gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el, idx) => {
    const dir = delta > 0 ? "up" : "down";
    const oldIdx = Number(el.getAttribute("data-idx"));
    let newIdx = oldIdx || 0;

    if (dir === "down") {
      newIdx = (newIdx - 1 + images.length) % images.length;
    } else {
      newIdx = (newIdx + 1) % images.length;
    }

    const newPosition = positions[newIdx];
    const maskRectangle = document.querySelector(`#carousel__title .carousel__svg-mask-rect:nth-of-type(${idx + 1})`);

    const currPos = positions[oldIdx];
    const bbox = el.getBoundingClientRect();
    const dragPos = getDraggedPos(bbox, currPos, newPosition, delta!, origin, imageSize);

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
      gsap
        .timeline()
        .set(
          el,
          {
            left: dragPos.x,
            top: dragPos.y,
            height: dragPos.newSize.height,
            width: dragPos.newSize.width,
            outline: "1px solid black",
          },
          "<"
        )
        .set(
          maskRectangle as SVGRectElement,
          {
            attr: {
              x: dragPos.x - dragPos.newSize.width / 2,
              y: dragPos.y - dragPos.newSize.height / 2,
            },
            width: dragPos.newSize.width,
            height: dragPos.newSize.height,
            autoAlpha: 1,
          },
          "<"
        );
      return;
    }
  });
}

function setupOrderedSlides(
  isFirstTime: React.MutableRefObject<boolean>,
  positions: Vec2[],
  origin: Vec2,
  imageSize: Size
) {
  if (isFirstTime.current && positions.length > 0) {
    const centerIndex = Math.floor(images.length / 2);

    gsap.utils.toArray<HTMLElement>("#slider-images__wrapper > *").forEach((el, idx) => {
      gsap.to(el, {
        opacity: 1,
        duration: theme.animations.intro.letterDuration,
        ease: "power4.inOut",
      });

      let initialIdx = (idx - centerIndex + images.length - 1) % images.length;
      el.setAttribute("data-idx", initialIdx.toString());
      const img = el.querySelector("img");

      // Position the element based on this initial index
      const initialPosition = positions[initialIdx];
      createSliderSetter(el, initialIdx, imageSize, initialPosition, origin);
      setupParallax(img!);
    });
    isFirstTime.current = false;
  }
}

// Sets both image and mask at he correct location
function createSliderSetter(el: HTMLElement, idx: number, imageSize: Size, pos: Vec2, origin: Vec2) {
  const isCenter = pos.x === origin.x;
  const size = imageSize.width > 0 ? imageSize : getResponsiveImageSize();
  const scaledImageSize = getScaledImageSize(size, isCenter);
  const maskRectangle = document.querySelector(`#carousel__title .carousel__svg-mask-rect:nth-of-type(${idx + 1})`);
  const img = el.querySelector("img")!;
  updateImageDataCursor(img, pos, origin, isCenter);
  return gsap
    .timeline()
    .to(el, {
      left: pos.x,
      top: pos.y,
      height: scaledImageSize.height,
      width: scaledImageSize.width,
      duration: 1.5,
      ease: "power4.out",
    })
    .set(maskRectangle as SVGRectElement, getNewMaskRecDimensions(pos, size, scaledImageSize, isCenter));
}

function setupParallax(el: HTMLElement) {
  const offset = theme.animations.carousel.imageSizeOffset;
  const dividedOffset = offset / 3;
  gsap.to(el, {
    width: 100 + offset + "%",
    height: 100 + offset + "%",
    left: -dividedOffset + "%",
    top: -dividedOffset + "%",
    duration: 0.35,
    ease: "power3.out",
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
