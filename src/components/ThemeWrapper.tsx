"use client";

import { ThemeProvider } from "styled-components";
import { theme } from "../config/theme";
import StyledComponentsRegistry from "../app/registry";

type Props = {
  children: React.ReactNode;
};

export function ThemeWrapper({ children }: Props) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledComponentsRegistry>
  );
}
