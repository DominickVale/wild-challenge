import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CursorState } from "./Cursor";
import { MutableRefObject, useRef } from "react";
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
export function useElasticCursorAnimation(elRef: MutableRefObject<HTMLElement | null>) {
  const truePos = useRef({ x: 1, y: 1 });
  useGSAP(() => {
    if (!elRef.current) return;

    gsap.set(elRef.current, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(elRef.current, "x", {
      duration: theme.animations.cursor.dampenDuration,
      ease: theme.animations.cursor.dampenEase,
    });
    const yTo = gsap.quickTo(elRef.current, "y", {
      duration: theme.animations.cursor.dampenDuration,
      ease: theme.animations.cursor.dampenEase,
    });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      truePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return truePos;
}
