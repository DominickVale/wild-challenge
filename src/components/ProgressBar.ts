"use client";
import styled from "styled-components";

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
  transition: background-color 0.3s ease-in-out;
`;
