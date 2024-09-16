"use client";
import styled from "styled-components";

export const HeroSection = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CTASection = styled.section`
  position: absolute;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  position: absolute;
  right: 9.688rem;
  bottom: 5.813rem;

  & > p:nth-child(2) {
    align-self: flex-end;
  }
`;

export const Header = styled.header`
  position: fixed;
  top: ${(p) => p.theme.padding};
  left: ${(p) => p.theme.padding};
  z-index: 1;
`;
