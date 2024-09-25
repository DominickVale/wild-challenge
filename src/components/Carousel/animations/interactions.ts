import gsap from "gsap";
import { images } from "@/lib/constants";
import { ScrollControllerCallbacks } from "../Carousel.hooks";

export function onSliderClick(
  e: React.MouseEvent<HTMLDivElement>,
  updateCarousel: ScrollControllerCallbacks["onScroll"]
) {
  const idx = Number(e.currentTarget.getAttribute("data-idx")) || 0;
  const middleIdx = Math.floor(images.length / 2);
  gsap
    .timeline()
    .to(e.currentTarget, {
      scale: 0.98,
      duration: 0.05,
      ease: "power4.out",
    })
    .to(e.currentTarget, {
      scale: 1,
      duration: 0.15,
      ease: "power4.in",
    });
  if (idx < middleIdx) {
    updateCarousel("up", false);
  } else if (idx > middleIdx) {
    updateCarousel("down", false);
  }
}

export function onSliderHover(target: HTMLElement, isHovering: boolean, enabled: boolean) {
  // avoid center image
  if (!enabled || Number(target.getAttribute("data-idx")) === Math.floor(images.length / 2)) {
    return;
  }
  gsap
    .timeline()
    .to(target, {
      scale: isHovering ? 1.05 : 1,
      duration: 0.8,
      ease: "power4.out",
    })
    .to(
      target,
      {
        duration: 0.15,
        outline: isHovering ? "1px solid white" : "1px solid black",
        ease: "power4.inOut",
      },
      "<"
    );
}
