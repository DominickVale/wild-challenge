"use client";
import styled from "styled-components";

export const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 2.5rem;
  height: 2.5rem;
  pointer-events: none;
  transform-origin: center;
  z-index: 100;
`;

export const CursorInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 0px 0px 1px rgba(255, 255, 255, 0.1);
`;

export const CursorInner = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
`;

export const CursorProgress = styled.svg`
  transform: rotate(-90deg);
  transform-origin: center;
`;
