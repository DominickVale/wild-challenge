import { theme } from "@/app/config/theme";
import "styled-components";

declare module "styled-components" {
  export type DefaultTheme = typeof theme;
}
