import { imgScaleDownFactor } from "@/lib/constants";
import { getResponsiveImageSize } from "@/lib/utils/size";
import { Size } from "@/types";
import { CarouselPositions } from "./Carousel.hooks";

export function getCarouselPositions(imageSize: Size, arr: unknown[]): CarouselPositions {
  const size = imageSize.width > 0 ? imageSize : getResponsiveImageSize();
  const origin = {
    x: document.documentElement.clientWidth / 2,
    y: document.documentElement.clientHeight / 2,
  };

  const pattern = {
    x: origin.x - size.width / imgScaleDownFactor / 2 - 16,
    y: origin.y - size.height / imgScaleDownFactor / 2 - 16,
  };

  const positions = arr.map((_, idx) => {
    const offset = idx - Math.floor(arr.length / 2);
    return {
      x: origin.x + offset * pattern.x,
      y: origin.y - offset * pattern.y,
    };
  });
  console.log("new positions: ", positions);
  return { positions, origin };
}


export function recalculateCarouselPositions(arr: unknown[], imageSize: Size): CarouselPositions {
  const size = imageSize.width > 0 ? imageSize : getResponsiveImageSize();
  const origin = {
    x: document.documentElement.clientWidth / 2,
    y: document.documentElement.clientHeight / 2,
  };

  const pattern = {
    x: origin.x - size.width / imgScaleDownFactor / 2 - 16,
    y: origin.y - size.height / imgScaleDownFactor / 2 - 16,
  };

  const positions = arr.map((_, idx) => {
    const offset = idx - Math.floor(arr.length / 2);
    return {
      x: origin.x + offset * pattern.x,
      y: origin.y - offset * pattern.y,
    };
  });

  return { positions, origin}
}
