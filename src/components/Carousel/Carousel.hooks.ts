import { Vec2 } from "@/types";
import { useDebounceFn } from "ahooks";
import { useEffect, useRef, useState } from "react";

export type CarouselPositions = {
  positions: Vec2[];
  origin: Vec2;
};

/*
 * Scroll Controller
 * */

export type ScrollDirection = "up" | "down";

export type ScrollControllerState = {
  direction: ScrollDirection;
};

export type ScrollControllerCallbacks = {
  onScroll: (direction: ScrollDirection, wasDragging: boolean) => void;
  onDrag: (delta: number) => void;
  onDragEnd: (totalDelta: number, direction: ScrollDirection) => void;
};

export function useScrollController(canChange: boolean, cbs: ScrollControllerCallbacks): ScrollControllerState {
  const { onScroll, onDrag, onDragEnd } = cbs;
  const [state, setState] = useState<{
    lastTouchY: number;
    lastTouchX: number;
    lastDirection: ScrollDirection;
  }>({
    lastTouchY: 0,
    lastTouchX: 0,
    lastDirection: "down",
  });
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const deltaX = useRef(0);
  const animationRef = useRef<number | null>(null);

  const debounceHandleScroll = useDebounceFn(
    (e: WheelEvent) => {
      let direction: "up" | "down" = "up";
      let newIdx: number;

      direction = e.deltaY > 0 ? "down" : "up";
      onScroll(direction, false);
      setState((prevState) => ({ ...prevState, currIdx: newIdx, lastDirection: direction }));
    },
    { wait: 50, leading: true, trailing: false }
  );

  function onPointerEnd() {
    cancelAnimationFrame(animationRef.current!);
    isDragging.current = false;
    const movedBy = deltaX.current;
    deltaX.current = 0;
    dragStartX.current = 0;
    if (Math.abs(movedBy) > 1) {
      onDragEnd(movedBy, movedBy > 0 ? "up" : "down");
    }
  }

  function onPointerMove(e: TouchEvent) {
    if (isDragging.current) {
      const currentPosition = e.touches[0].pageX;
      deltaX.current = currentPosition - dragStartX.current;
    }
  }

  function onPointerDown(e: TouchEvent) {
    if (!canChange) return;
    isDragging.current = true;
    dragStartX.current = e.touches[0].pageX;
    animationRef.current = requestAnimationFrame(animation);
  }

  function animation() {
    if (deltaX.current !== 0) onDrag(deltaX.current);
    if (isDragging.current) requestAnimationFrame(animation);
  }

  useEffect(() => {
    window.addEventListener("wheel", debounceHandleScroll.run);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("touchmove", onPointerMove);
    document.addEventListener("touchend", onPointerEnd);

    return () => {
      window.removeEventListener("wheel", debounceHandleScroll.run);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerEnd);
    };
  }, [debounceHandleScroll]);

  return { direction: state.lastDirection };
}
