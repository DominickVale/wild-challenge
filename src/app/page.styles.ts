"use client";
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
* {
 cursor: ${process.env.NEXT_PUBLIC_PRODUCTION === "true" ? "none" : "auto"};
}
`;

export const Header = styled.header`
  position: fixed;
  top: ${(p) => p.theme.padding};
  left: ${(p) => p.theme.padding};
  z-index: 1;
`;
