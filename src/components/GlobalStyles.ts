"use client";
import { createGlobalStyle } from "styled-components";
import { IS_PROD } from "@/lib/constants";

export const GlobalStyles = createGlobalStyle`
* {
 cursor: ${IS_PROD ? "none" : "auto"};
}
`;
