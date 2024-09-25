"use client";
import styled from "styled-components";
import { pMixin } from "../Typography";

export const CTASection = styled.section`
  position: absolute;
  opacity: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  position: absolute;
  right: 9.7%;
  bottom: 10.3%;

  #carousel__cta-details > p:nth-child(2) {
    align-self: flex-end;
  }
  @media screen and (max-width: 768px) {
    right: ${(p) => p.theme.padding};
    bottom: 6%;
  }
`;
export const CTA = styled.a`
  ${pMixin}
  font-weight: bold;
  background-color: ${(p) => p.theme.colors.typeLight};
  color: ${(p) => p.theme.colors.typeDark};
  border-radius: 1.5rem;
  padding: 0.563rem 1rem 0.625rem 1rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: ${(p) => p.theme.colors.typeDark};
    color: ${(p) => p.theme.colors.typeLight};
  }
`;
