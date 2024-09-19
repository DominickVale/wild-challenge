"use client";

import {
  createContext,
  type Dispatch,
  MutableRefObject,
  type SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { CursorInner, CursorInnerWrapper, CursorProgress, CursorWrapper } from "./Cursor.styles";
import { Vec2 } from "@/types";
import { useCursorProgressAnimation, useElasticCursorAnimation } from "./Cursor.animations";

export type CursorState = {
  current: number;
  total: number;
  direction: "up" | "down";
};

/* CONTEXT */
type CursorContextType = {
  cursorRef: React.RefObject<HTMLDivElement>;
  setCursorState: Dispatch<SetStateAction<CursorState>> | null;
  position: MutableRefObject<Vec2>;
};

const CursorContext = createContext<CursorContextType>({
  cursorRef: { current: null },
  setCursorState: null,
  position: { current: { x: 0, y: 0 } },
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
  const progressRef = useRef<SVGCircleElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastProgress = useRef<number>(0);
  const [state, setState] = useState<CursorState>({
    current: 0,
    total: 0,
    direction: "down",
  });

  const pos = useElasticCursorAnimation(wrapperRef);

  useCursorProgressAnimation(state, progressRef, lastProgress);

  return (
    <CursorContext.Provider value={{ cursorRef: wrapperRef, position: pos, setCursorState: setState }}>
      <CursorWrapper ref={wrapperRef}>
        <CursorInnerWrapper>
          <CursorProgress width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
              ref={progressRef}
              cx="21"
              cy="21"
              r="20"
              stroke="white"
              strokeLinecap="round"
              style={{ transformOrigin: "center" }}
            />
          </CursorProgress>
          <CursorInner />
        </CursorInnerWrapper>
      </CursorWrapper>
      {children}
    </CursorContext.Provider>
  );
};
