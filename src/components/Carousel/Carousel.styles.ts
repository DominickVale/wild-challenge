"use client";
import Image from "next/image";
import styled from "styled-components";
import { HeroType } from "../Typography";

export const TitleSection = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
`;

export const CTASection = styled.section`
  position: absolute;
  opacity: 0;

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
  @media screen and (max-width: 768px) {
    position: fixed;
    bottom: 3rem;
    right: unset;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const BGImagesWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const BGImages = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: black;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(100px);
    -webkit-backdrop-filter: blur(100px);
    transform: translate3d(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

export const BlurredImage = styled(Image)`
  object-fit: cover;
`;

export const SliderImage = styled.div`
  position: fixed;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  transform-origin: center;
  width: 512px;
  height: 680px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 10px;
  outline: 1px solid black;

  & > img {
    position: fixed;
    transform-origin: center;
    left: 0;
    top: 0;
  }
`;

export const SliderImagesWrapper = styled.div`
  position: relative;
  justify-items: center;
  align-items: center;

  width: max-content;
  height: 100%;
  display: flex;
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export const CarouselTitleText = styled(HeroType)`
  z-index: 10;
  color: transparent;
  -webkit-text-stroke: 2px ${(p) => p.theme.colors.typeLight};
`;

export const CarouselTitleWrapper = styled.svg`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
  z-index: 10;
  @media screen and (max-width: 768px) {
    & > tspan {
      y: 40%;
    }
  }
`;
