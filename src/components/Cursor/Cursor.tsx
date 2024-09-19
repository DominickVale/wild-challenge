"use client";

import { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { useMouse } from "ahooks";
import { CursorWrapper, CursorInner, CursorInnerWrapper, CursorProgress } from "./Cursor.styles";

/* CONTEXT */
type CursorContextType = {
  cursorRef: React.RefObject<HTMLDivElement>;
  setCursorState: Dispatch<SetStateAction<{ current: number; total: number }>> | null;
  position: { x: number; y: number };
};

const CursorContext = createContext<CursorContextType>({
  cursorRef: { current: null },
  setCursorState: null,
  position: { x: 0, y: 0 },
});

export const useCursor = () => {
  const context = useContext(CursorContext);
  return context;
};

/////////////

type Props = {
  children: React.ReactNode;
};
export const CursorProvider = ({ children }: Props) => {
  const { clientX, clientY } = useMouse();
  const progressRef = useRef<SVGCircleElement>(null);
  const [state, setState] = useState({
    current: 0,
    total: 0,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = ((state.current + 1) / state.total) * 100;
    const circ = 2 * Math.PI * 20; // 20 = radius
    const offset = circ * ((100 - progress) / 100);

    progressRef.current!.style.strokeDashoffset = `${offset}`;
    progressRef.current!.style.strokeDasharray = `${circ}`;
  }, [state]);

  return (
    <CursorContext.Provider
      value={{ cursorRef: wrapperRef, position: { x: clientX, y: clientY }, setCursorState: setState }}
    >
      <CursorWrapper $x={clientX} $y={clientY} ref={wrapperRef}>
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
      {children}
    </CursorContext.Provider>
  );
};
