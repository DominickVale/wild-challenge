"use client";
import styled, { css } from "styled-components";

export const HeroType = styled.h1`
  line-height: 80%;
  text-align: center;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: ${(p) => p.theme.fontSize.huge};

  color: ${(p) => p.theme.typeLight};
`;

export const pMixin = css`
  font-family: Arial, Helvetica, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: ${(p) => p.theme.fontSize.small};
  letter-spacing: 0.08em;
  text-transform: uppercase;

  color: ${(p) => p.theme.typeLight};
`;

export const P = styled.p`
  ${pMixin};
`;
