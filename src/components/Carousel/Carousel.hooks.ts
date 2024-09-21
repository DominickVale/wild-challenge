import { Vec2 } from "@/types";
import { useDebounceFn } from "ahooks";
import { useEffect, useState } from "react";

export type CarouselPositions = {
  positions: Vec2[];
  origin: Vec2;
};

/*
 * Scroll Controller
 * */

export type ScrollControllerState = {
  activeIdx: number;
  direction: "up" | "down";
};

export type ScrollDirection = "up" | "down";
export type onScrollControllerCb = (newIdx: number, direction: ScrollDirection) => void;

export function useScrollController(items: unknown[], onScroll: onScrollControllerCb): ScrollControllerState {
  const [state, setState] = useState<{ lastTouchY: number; currIdx: number; lastDirection: ScrollDirection }>({
    lastTouchY: 0,
    currIdx: 0,
    lastDirection: "down",
  });

  const debounceHandleScroll = useDebounceFn(
    (e: WheelEvent | TouchEvent) => {
      let direction: "up" | "down" = "up";
      let newIdx: number;

      if (e instanceof WheelEvent) {
        direction = e.deltaY > 0 ? "down" : "up";
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        const currentTouchY = e.touches[0].clientY;
        direction = currentTouchY > state.lastTouchY ? "down" : "up";
        setState((prevState) => ({ ...prevState, lastTouchY: currentTouchY }));
      }

      newIdx = state.currIdx;

      if (direction === "down") {
        newIdx = (state.currIdx + 1) % items.length;
      } else {
        newIdx = state.currIdx - 1;
        if (newIdx < 0) {
          newIdx = items.length - 1;
        }
      }

      onScroll(newIdx, direction);
      setState((prevState) => ({ ...prevState, currIdx: newIdx, lastDirection: direction }));
    },
    { wait: 50, leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("wheel", debounceHandleScroll.run);
    window.addEventListener("touchmove", debounceHandleScroll.run);

    return () => {
      window.removeEventListener("wheel", debounceHandleScroll.run);
      window.removeEventListener("touchmove", debounceHandleScroll.run);
    };
  }, [debounceHandleScroll]);

  return { activeIdx: state.currIdx, direction: state.lastDirection };
}
