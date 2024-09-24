"use client";

import styled from "styled-components";

export const Header = styled.header`
  position: fixed;
  top: ${(p) => p.theme.padding};
  left: ${(p) => p.theme.padding};
  z-index: 1;
`;
