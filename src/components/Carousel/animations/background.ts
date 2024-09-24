import gsap from "gsap";
import { theme } from "@/config/theme";

export function changeCarouselBgImage(activeImageIdx: number) {
  if (activeImageIdx >= 0) {
    gsap
      .timeline()
      .to("#slider-bg__wrapper > *", {
        opacity: 0,
        duration: theme.animations.carousel.backgroundDuration,
        ease: "power4.inOut",
      })
      .to(
        `#slider-bg__wrapper > *:nth-child(${activeImageIdx + 1})`,
        {
          opacity: 1,
          duration: theme.animations.carousel.backgroundDuration,
          ease: "power4.inOut",
        },
        "<"
      );
  }
}
