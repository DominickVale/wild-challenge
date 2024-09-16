"use client";

import styled from "styled-components";

interface FlexProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: string;
  backgroundColor?: string;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(p) => p.direction || "row"};
  justify-content: ${(p) => p.justify || "flex-start"};
  align-items: ${(p) => p.align || "stretch"};
  flex-wrap: ${(p) => p.wrap || "nowrap"};
  gap: ${(p) => p.gap || "0"};
  background-color: ${(p) => p.backgroundColor || "transparent"};
`;
