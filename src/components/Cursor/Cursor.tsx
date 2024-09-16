"use client";

import { useEffect, useRef } from "react";
import useMousePosition from "@/lib/hooks/useMousePosition";
import { CursorWrapper, CursorInner, CursorInnerWrapper, CursorProgress } from "./Cursor.styles";

export const Cursor = () => {
  const { x, y } = useMousePosition();
  const progressRef = useRef<SVGCircleElement>(null);
  const progress = 50;

  useEffect(() => {
    const circ = 2 * Math.PI * 20; // 20 = radius
    const offset = circ * ((100 - progress) / 100);

    progressRef.current!.style.strokeDashoffset = `${offset}`;
    progressRef.current!.style.strokeDasharray = `${circ}`;
  }, [progress]);

  return (
    <CursorWrapper $x={x} $y={y}>
      <CursorInnerWrapper>
        <CursorProgress width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            ref={progressRef}
            cx="21"
            cy="21"
            r="20"
            stroke="white"
            strokeDasharray="125.663"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </CursorProgress>
        <CursorInner />
      </CursorInnerWrapper>
    </CursorWrapper>
  );
};
