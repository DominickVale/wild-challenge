"use client";
import styled, { createGlobalStyle } from "styled-components";
import { IS_PROD } from "@/lib/constants";

export const GlobalStyles = createGlobalStyle`
* {
 cursor: ${IS_PROD ? "none" : "auto"};
}
`;
