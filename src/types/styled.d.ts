import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    padding: string;
    colors: {
      typeLight: string;
      typeDark: string;
    };
    fontSize: {
      default: string;
      small: string;
      huge: string;
    };
  }
}
