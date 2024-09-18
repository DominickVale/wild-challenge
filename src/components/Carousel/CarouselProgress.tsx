"use client";

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Flex } from "../Flex";
import { ProgressBar, ProgressBarDot } from "../ProgressBar";
import { P } from "../Typography";

export const CarouselProgress = ({ maxWidth = 100 }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const carouselRef = useRef(null);

  useEffect(() => {
    const svgTextElement = document.querySelector("#carousel__svg-text");

    if (svgTextElement) {
      const tspans = svgTextElement.querySelectorAll("tspan");

      if (tspans.length > 0) {
        const lastTspan = tspans[tspans.length - 1];
        const boundingBox = lastTspan.getBoundingClientRect();

        setPosition({
          top: boundingBox.bottom + 20, // 20px below the last tspan
          left: boundingBox.left,
        });
      }
    }
  }, []);

  return (
    <ProgressContainer ref={carouselRef} style={{ top: position.top, left: 0 }}>
      <Flex direction="row" gap="1.5rem">
        <P>1 of 5</P>
        <ProgressBar>
          <ProgressBarDot $isActive />
          <ProgressBarDot />
          <ProgressBarDot />
          <ProgressBarDot />
          <ProgressBarDot />
        </ProgressBar>
      </Flex>
    </ProgressContainer>
  );
};

const ProgressContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
