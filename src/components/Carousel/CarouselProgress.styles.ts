"use client";
import styled from "styled-components";
import { P } from "../Typography";

export const ProgressContainer = styled.div`
  opacity: 0;
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

export const ProgressCounterText = styled(P)`
  display: flex;
  align-items: center;
  line-height: 1;
  height: ${(p) => p.theme.fontSize.default};

  span {
    position: relative;
    width: ${(p) => p.theme.fontSize.default};
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    & > span {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
`;
