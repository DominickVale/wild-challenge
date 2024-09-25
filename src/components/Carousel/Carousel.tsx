"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useState } from "react";
import { images } from "@/lib/constants";
import { useCursor } from "../Cursor";
import { Flex } from "../Flex";
import { useCarousel } from "./animations/controller";
import {
  BGImages,
  BGImagesWrapper,
  BlurredImage,
  Container,
  SliderImage,
  SliderImagesWrapper,
  TitleSection,
} from "./Carousel.styles";
import { CarouselCTA } from "./CarouselCTA";
import { CarouselProgress } from "./CarouselProgress";
import { CarouselTitle } from "./CarouselTitle";
import { onSliderClick, onSliderHover } from "./animations/interactions";
import { changeCarouselBgImage } from "./animations/background";

gsap.registerPlugin(useGSAP);

type CarouselProps = {
  enabled: boolean;
};
export const Carousel = ({ enabled }: CarouselProps) => {
  const cursor = useCursor();
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const [canChange, setCanChange] = useState(true);
  const [text, setText] = useState<string | null>(null);

  const { scrollState, imageSize, updateCarousel } = useCarousel({
    enabled,
    canChange,
    setCanChange,
    onChange: (imgId, direction) => {
      const imgIdx = findImageIdxById(imgId);
      if (cursor?.current && imgIdx >= 0) {
        setActiveImageIdx(imgIdx);
        cursor.current.setState({
          current: imgIdx,
          total: images.length,
          direction: direction,
        });
      }
    },
  });

  useGSAP(() => {
    changeCarouselBgImage(activeImageIdx);
  }, [activeImageIdx]);

  useEffect(() => {
    if (enabled) {
      setText(images[activeImageIdx].title);
    }
  }, [enabled, activeImageIdx]);

  const { contextSafe } = useGSAP();

  const onSliderImageClick = contextSafe(onSliderClick);
  const onSliderImageHover = contextSafe(onSliderHover);

  const getSrBtnHandler = (isNext?: boolean) => () => {
    updateCarousel(isNext ? "down" : "up", false);
  };

  return (
    <Container id="carousel">
      <Flex className="sr-only">
        <button onClick={getSrBtnHandler(true)}>next</button>
        <button onClick={getSrBtnHandler()}>previous</button>
      </Flex>
      <BGImagesWrapper>
        <BGImages id="slider-bg__wrapper">
          {images.map(({ id, url }) => (
            <BlurredImage key={id} src={url} data-img-id={id} fill alt="" />
          ))}
        </BGImages>
        <SliderImagesWrapper id="slider-images__wrapper">
          {images.map(({ id, url, alt }, idx) => (
            <SliderImage
              key={id}
              data-idx={idx}
              data-img-id={id}
              $isCenter={idx === 0}
              onClick={(e) => onSliderImageClick(e, updateCarousel)}
              onMouseEnter={(e) => onSliderImageHover(e.currentTarget as HTMLElement, true, enabled)}
              onMouseLeave={(e) => onSliderImageHover(e.currentTarget as HTMLElement, false, enabled)}
            >
              <Image
                src={url}
                fill
                style={{ objectFit: "cover" }}
                alt={alt}
                quality={100}
                sizes="(max-width: 768px) 50vw, (max-width: 1600px) 32vw, 35vw"
              />
            </SliderImage>
          ))}
        </SliderImagesWrapper>
      </BGImagesWrapper>
      {enabled && (
        <TitleSection>
          <CarouselTitle text={text} imageSize={imageSize} />
          <CarouselProgress
            state={{ current: activeImageIdx, total: images.length, direction: scrollState.direction }}
          />
          <CarouselCTA currentIdx={activeImageIdx} />
        </TitleSection>
      )}
    </Container>
  );
};

const findImageIdxById = (id: string) => images.findIndex((v) => v.id === id);
