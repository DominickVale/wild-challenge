"use client";
import styled from "styled-components";
import { P } from "../Typography";

export const ProgressContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProgressCounterText = styled(P)`
  line-height: ${(p) => p.theme.fontSize.smallest};

  span {
    display: inline-block;
    position: relative;
    width: ${(p) => p.theme.fontSize.small};
    height: ${(p) => p.theme.fontSize.smallest};
    margin: 0;
    padding: 0;
    line-height: 100%;

    & > span {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`;
