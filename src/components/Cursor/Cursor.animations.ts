import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CursorState } from "./Cursor";
import { MutableRefObject, useRef, useState } from "react";
import { theme } from "@/app/config/theme";

/*
 * Animates the progress of the animation bar based on current idx
 */
const CIRC = 2 * Math.PI * 20; // TODO: maybe make radius customizable (?)
export function useCursorProgressAnimation(
  state: CursorState,
  progressRef: React.RefObject<SVGCircleElement>,
  lastProgress: MutableRefObject<number>
) {
  useGSAP(() => {
    const progress = ((state.current + 1) / state.total) * 100;
    const offset = CIRC * ((100 - progress) / 100);

    const animateProgress = () => {
      gsap
        .timeline()
        .to(progressRef.current, {
          strokeDashoffset: offset,
          duration: theme.animations.cursor.progressDuration,
          ease: theme.animations.cursor.progressEase,
        })
        .set(progressRef.current, { attr: { transform: "rotate(0)" } });
    };

    const isWrappingForward = lastProgress.current >= 100 && state.direction === "down";
    const isWrappingBackward = lastProgress.current <= 100 / state.total && state.direction === "up";

    if (isWrappingForward) {
      gsap.timeline().to(progressRef.current, {
        attr: { transform: "rotate(360)" },
        duration: theme.animations.cursor.progressDuration,
        ease: theme.animations.cursor.progressEase,
      });
      animateProgress();
    } else if (isWrappingBackward) {
      gsap
        .timeline()
        .to(progressRef.current, {
          attr: { transform: `rotate(-360)` },
          duration: theme.animations.cursor.progressDuration,
          ease: theme.animations.cursor.progressEase,
        })
        .set(progressRef.current, { attr: { transform: `rotate(0)` } });
      animateProgress();
    } else {
      animateProgress();
    }
    lastProgress.current = progress;
  }, [state]);

  useGSAP(() => {
    if (progressRef.current) {
      gsap.set(progressRef.current, {
        strokeDashoffset: CIRC,
        strokeDasharray: `${CIRC} ${CIRC}`,
      });
    }
  }, []);
}

/*
 * Animates the wrapper in a springy way
 */
export function useElasticCursorAnimation(
  elRef: MutableRefObject<HTMLElement | null>,
  innerRef: MutableRefObject<HTMLElement | null>,
  textRef: MutableRefObject<HTMLElement | null>
) {
  const truePos = useRef({ x: 1, y: 1 });
  const animRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
  const [hoveringElement, setIsHoveringElement] = useState<HTMLElement | null>(null);

  useGSAP(() => {
    if(truePos.current.x <= 1 && truePos.current.y <= 1) {
      return
    }
    animRef.current?.kill();
    if (hoveringElement) {
      const text = hoveringElement.getAttribute("data-cursor-text") || "";
      gsap.set(textRef.current, { text });
      animRef.current = gsap
        .timeline()
        .to(elRef.current, {
          opacity: 0,
          scale: 2,
          duration: 1.5,
          ease: theme.animations.cursor.progressEase,
        })
        .to(textRef.current, {
          autoAlpha: 1,
          duration: 1,
          ease: theme.animations.cursor.progressEase,
        });
    } else {
      gsap.set(textRef.current, { text: "" });
      animRef.current = gsap.to(elRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: theme.animations.cursor.progressEase,
      });
    }
  }, [hoveringElement]);

  useGSAP(() => {
    if (!elRef.current || !innerRef.current) return;

    gsap.set(elRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(innerRef.current, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(elRef.current, "x", {
      duration: theme.animations.cursor.dampenDuration,
      ease: theme.animations.cursor.dampenEase,
    });
    const yTo = gsap.quickTo(elRef.current, "y", {
      duration: theme.animations.cursor.dampenDuration,
      ease: theme.animations.cursor.dampenEase,
    });

    const xToInner = gsap.quickTo(innerRef.current, "x", {
      duration: 0.3,
      ease: theme.animations.cursor.dampenEase,
    });
    const yToInner = gsap.quickTo(innerRef.current, "y", {
      duration: 0.3,
      ease: theme.animations.cursor.dampenEase,
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!elRef.current || !innerRef.current) return;
      xTo(e.clientX);
      yTo(e.clientY);
      xToInner(e.clientX);
      yToInner(e.clientY);
      truePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      if (!target) return;
      gsap.to([elRef.current, innerRef.current], {
        autoAlpha: 1,
        duration: 0.3,
      });
      if (target.getAttribute("data-cursor-hover")) {
        setIsHoveringElement(target);
      } else {
        setIsHoveringElement(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return truePos;
}
