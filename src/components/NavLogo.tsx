"use client";

import Link from "next/link";
import styled from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { theme } from "@/config/theme";

const StyledNavLogo = styled(Link)`
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: white;
  position: fixed;
  left: 50svw;
  top: 50svh;
  transform: translate(-50%, -50%);
  transform-origin: center;
  font-size: ${(p) => p.theme.fontSize.big};
  z-index: 1000;
  word-wrap: nowrap;
  word-break: keep-all;
  white-space: nowrap;
  & > * {
    display: inline-block;
    position: relative;
    opacity: 0;
  }
  & > :first-child {
    transform: translateX(-15vw);
  }
  & > :nth-child(2) {
    transform: translateY(-15vh);
  }
  & > :nth-child(3) {
    transform: scale(0);
  }
`;

export function NavLogo() {
  const { letterDuration } = theme.animations.intro;
  useGSAP(() => {
    gsap
      .timeline()
      .to("#nav__logo >:first-child", {
        translateX: 0,
        opacity: 1,
        duration: letterDuration,
        ease: "power4.inOut",
      })
      .to("#nav__logo >:nth-child(2)", {
        translateY: 0,
        opacity: 1,
        duration: letterDuration,
        ease: "power4.inOut",
      })
      .to("#nav__logo >:nth-child(3)", {
        scale: 1,
        opacity: 1,
        duration: letterDuration,
        ease: "power4.inOut",
      })
      .to("#nav__logo", {
        delay: letterDuration * 2,
        left: theme.padding,
        top: theme.padding,
        transform: "none",
        duration: 1,
        ease: "power4.inOut",
        fontSize: theme.fontSize.default,
      });
  }, []);

  return (
    <StyledNavLogo id="nav__logo" href="/">
      <span>X</span>
      <span>Y</span>
      <span>Z</span> PHOTOGRAPHY
    </StyledNavLogo>
  );
}
