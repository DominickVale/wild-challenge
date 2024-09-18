"use client";
import Image, { type ImageProps } from "next/image";
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

// export const SliderImagesWrapper = styled.div`
//   & > :nth-child(1) {
//     border: 2px solid red;
//   }
//   & > :nth-child(2) {
//     transform: translate(-50%, 50%) scale(2.05);
//     left: 50%;
//     bottom: 50%;
//   }
//   & > :nth-child(3) {
//     left: auto;
//     right: 16px;
//     top: 16px;
//   }
// `;
//
//
// export const SliderImage = styled.div`
//   position: fixed;
//   left: 50vw;
//   top: 50vh;
//   transform: translate(-50%, -50%);
//   transform-origin: 50% 50%;
//   height: 330px;
//   width: 248px;
//
//   img {
//     box-shadow: inset 0px 0px 0px 1px rgba(255, 255, 255, 0.1);
//     border-radius: 10px;
//   }
// `;
