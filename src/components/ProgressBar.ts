"use client";
import styled from "styled-components";

type ProgressBarDotProps = {
  $isActive?: boolean;
};

export const ProgressBarDot = styled.div<ProgressBarDotProps>`
  height: 0.5rem;
  width: 0.313rem;
  border: 1px solid white;
  border-radius: 0.125rem;
  background-color: ${(p) => (p.$isActive ? "white" : "transparent")};
  transition: background-color 0.3s ease-in-out;
  transition-delay: 0.7s;
`;
