"use client";
import styled from "styled-components";

export const CarouselTitleWrapper = styled.svg`
  opacity: 0;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
  z-index: 10;
`;

export const SrOnlyH1 = styled.h1`
  font-size: ${(p) => p.theme.fontSize.huge};
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  transform-origin: center;
  z-index: 100;
`;
