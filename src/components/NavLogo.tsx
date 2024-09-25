import Link from "next/link";
import styled from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { theme } from "@/config/theme";

const StyledNavLogo = styled(Link)`
  #nav__logo {
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

    & * {
      display: inline-block;
      position: relative;
      opacity: 0;
    }
    & > .letter:first-child {
      transform: translateX(-15vw);
    }
    & > .letter:nth-child(2) {
      transform: translateY(-15vh);
    }
    & > .letter:nth-child(3) {
      transform: scale(0);
    }
    & > :last-child {
      margin-left: 1ch;
      opacity: 0;
    }
  }
`;

type NavLogoProps = {
  onIntroEnd: () => void;
};
export function NavLogo({ onIntroEnd }: NavLogoProps) {
  const { letterDuration } = theme.animations.intro;
  useGSAP(() => {
    gsap
      .timeline()
      .to("#nav__logo .letter:first-child", {
        translateX: 0,
        opacity: 1,
        duration: letterDuration,
        ease: "power4.in",
      })
      .to("#nav__logo .letter:nth-child(2)", {
        translateY: 0,
        opacity: 1,
        duration: letterDuration,
        ease: "power4.in",
      })
      .to("#nav__logo .letter:nth-child(3)", {
        scale: 1,
        opacity: 1,
        duration: letterDuration,
        ease: "power4.in",
      })
      .to("#nav__logo span:last-child", {
        autoAlpha: 1,
        duration: letterDuration * 3,
        ease: "power4.inOut",
      })
      .to("#nav__logo span", {
        delay: letterDuration,
        autoAlpha: 0,
        duration: 1,
        ease: "power4.inOut",
        onComplete: onIntroEnd,
      })
      .set("#nav__logo", {
        left: theme.padding,
        top: theme.padding,
        transform: "none",
        ease: "power4.out",
        fontSize: theme.fontSize.default,
      })
      .to("#nav__logo span", {
        autoAlpha: 1,
        duration: 1,
        ease: "power4.in",
      });
  }, []);

  return (
    <StyledNavLogo href="/">
      <span className="sr-only">XYZ Photography</span>
      <span id="nav__logo" className="logo">
        <span className="letter" data-cursor-hover>
          X
        </span>
        <span className="letter" data-cursor-hover>
          Y
        </span>
        <span className="letter" data-cursor-hover>
          Z
        </span>
        <span data-cursor-hover>PHOTOGRAPHY</span>
      </span>
    </StyledNavLogo>
  );
}
