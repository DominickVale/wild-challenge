import { imgRatio, imgScaleDownFactor } from "@/lib/constants";
import { Size, Vec2 } from "@/types";
import { CarouselPositions } from "../Carousel.hooks";
import gsap from 'gsap'

const DESIGN_PADDING = 16 * 2;
const DESIGN_IMG_SIZE = {
  width: 512,
  height: 680,
};
const DESIGN_VIEWPORT_SIZE = {
  width: 1600 - DESIGN_PADDING,
  height: 900 - DESIGN_PADDING,
};

export function getResponsiveImageSize() {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const vwFactor = DESIGN_VIEWPORT_SIZE.width / DESIGN_IMG_SIZE.width;
  const vhFactor = DESIGN_VIEWPORT_SIZE.height / DESIGN_IMG_SIZE.height;

  const availableWidth = vw - DESIGN_PADDING;
  const availableHeight = vh - DESIGN_PADDING;

  const widthBasedOnVW = availableWidth / vwFactor;
  const widthBasedOnVH = availableHeight / vhFactor / imgRatio;

  const newWidth = Math.min(widthBasedOnVW, widthBasedOnVH);
  const newHeight = newWidth * imgRatio;

  if (document.documentElement.clientWidth < 768) {
    const scale = availableHeight / availableWidth;
    return {
      width: newWidth * scale,
      height: newHeight * scale,
    };
  }

  return {
    width: newWidth,
    height: newHeight,
  };
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

  return { positions, origin };
}

export function updateImageDataCursor(img: HTMLImageElement, pos: Vec2, origin: Vec2, isCenter: boolean) {
  if (isCenter) {
    img.removeAttribute("data-cursor-hover");
    img.removeAttribute("data-cursor-text");
  } else {
    img.setAttribute("data-cursor-hover", "true");
    img.setAttribute("data-cursor-text", pos.x > origin.x ? "NEXT" : "PREV");
  }
}

export function getScaledImageSize(imageSize: Size, isCenter: boolean) {
  return {
    width: isCenter ? imageSize.width : imageSize.width / imgScaleDownFactor,
    height: isCenter ? imageSize.height : imageSize.height / imgScaleDownFactor,
  };
}

export function getNewMaskRecDimensions(pos: Vec2, imageSize: Size, scaledImageSize: Size, isCenter: boolean) {
  return {
    attr: {
      x: pos.x - scaledImageSize.width / 2,
      y: pos.y - scaledImageSize.height / 2,
    },
    autoAlpha: isCenter ? 1 : 0,
    ...getScaledImageSize(imageSize, isCenter),
  };
}

const CURVE = 3.5;
export function getDraggedPos(
  bbox: DOMRect,
  initialPos: Vec2,
  targetPos: Vec2,
  dragDelta: number,
  origin: Vec2,
  imageSize: Size
) {
  const maxDragDistance = document.documentElement.clientWidth / 2;

  const progress = Math.max(Math.min(Math.abs(dragDelta) / maxDragDistance, 1), 0);

  const x = initialPos.x + (targetPos.x - initialPos.x) * progress;
  const y = initialPos.y + (targetPos.y - initialPos.y) * progress;

  const scaledDownSize = {
    width: imageSize.width / imgScaleDownFactor,
    height: imageSize.height / imgScaleDownFactor,
  };

  const distanceFromCenter = Math.sqrt(Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2));

  const maxDistance = Math.sqrt(
    Math.pow(document.documentElement.clientWidth / 2, 2) + Math.pow(document.documentElement.clientHeight / 2, 2)
  );

  const scaleFactor = Math.pow(1 - Math.min(distanceFromCenter / maxDistance, 1), CURVE);

  const targetWidth = scaledDownSize.width + (imageSize.width - scaledDownSize.width) * scaleFactor;
  const targetHeight = scaledDownSize.height + (imageSize.height - scaledDownSize.height) * scaleFactor;

  const width = gsap.utils.interpolate(bbox.width, targetWidth, progress);
  const height = gsap.utils.interpolate(bbox.height, targetHeight, progress);

  return { x, y, newSize: { width, height } };
}
