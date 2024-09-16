"use client";
import styled from "styled-components";

export const ProgressBar = styled.div`
  display: flex;
  gap: 0.5rem;
`;

type ProgressBarDotProps = {
  $isActive?: boolean;
};

export const ProgressBarDot = styled.div<ProgressBarDotProps>`
  width: 5px;
  height: 8px;
  height: 0.5rem;
  width: 0.313rem;
  border: 1px solid white;
  border-radius: 2px;
  background-color: ${(p) => (p.$isActive ? "white" : "transparent")};
  border-radius: 0.125rem;
`;
