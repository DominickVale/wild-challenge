"use client";
import Image, { type ImageProps } from "next/image";
import styled from "styled-components";
import { HeroType } from "../Typography";

export const TitleSection = styled.main`
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

export const BGImagesWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
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
  height: 330px;
  width: 248px;

  & > img {
    border-radius: 10px;
    outline: 1px solid black;
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
  color: transparent;
  -webkit-text-stroke: 2px ${(p) => p.theme.colors.typeLight};
`;
