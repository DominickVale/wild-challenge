import { imgRatio } from "../constants";

const padding = 16 * 2;
const designImgSize = {
  width: 512,
  height: 680,
};
const designViewportSize = {
  width: 1600 - padding,
  height: 900 - padding,
};

export function getResponsiveImageSize() {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const vwFactor = designViewportSize.width / designImgSize.width;
  const vhFactor = designViewportSize.height / designImgSize.height;

  const availableWidth = vw - padding;
  const availableHeight = vh - padding;

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
