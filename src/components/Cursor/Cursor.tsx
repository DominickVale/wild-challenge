"use client";

import React, { forwardRef, useRef, useState, useImperativeHandle, createContext, useContext } from "react";
import { useCursorProgressAnimation, useElasticCursorAnimation } from "./Cursor.animations";
import { CursorInner, CursorInnerWrapper, CursorProgress, CursorWrapper } from "./Cursor.styles";
import { Vec2 } from "@/types";
import { P } from "../Typography";

export type CursorState = {
  current: number;
  total: number;
  direction: "up" | "down";
  pos: React.MutableRefObject<Vec2>;
};

type Props = {
  children?: React.ReactNode;
};

export type CursorRef = {
  getState: () => CursorState;
  setState: (newState: Partial<CursorState>) => void;
};

export const Cursor = forwardRef<CursorRef, Props>((_, ref) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerCursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lastProgress = useRef<number>(0);
  const pos = useElasticCursorAnimation(wrapperRef, innerCursorRef, textRef);
  const [state, setState] = useState<CursorState>({
    current: 0,
    total: 0,
    direction: "down",
    pos,
  });

  useCursorProgressAnimation(state, progressRef, lastProgress);

  useImperativeHandle(ref, () => ({
    getState: () => state,
    setState: (newState: Partial<CursorState>) => setState((prevState) => ({ ...prevState, ...newState })),
  }));

  return (
    <>
      <CursorInner ref={innerCursorRef}>
        <P ref={textRef}></P>
      </CursorInner>
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
        </CursorInnerWrapper>
      </CursorWrapper>
    </>
  );
});
Cursor.displayName = "Cursor";

/////////////
//
// Context
const CursorContext = createContext<React.RefObject<CursorRef> | null>(null);

export const CursorProvider = ({ children }: Props) => {
  const cursorRef = useRef<CursorRef>(null);

  return (
    <CursorContext.Provider value={cursorRef}>
      <Cursor ref={cursorRef} />
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
//
//
////////////
