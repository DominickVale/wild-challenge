"use client";
import styled, { createGlobalStyle } from "styled-components";
import { IS_PROD } from "@/lib/constants";

export const GlobalStyles = createGlobalStyle`
* {
 cursor: ${IS_PROD ? "none" : "auto"};
cursor: none;
}
`;

export const Header = styled.header`
  position: fixed;
  top: ${(p) => p.theme.padding};
  left: ${(p) => p.theme.padding};
  z-index: 1;
`;
