"use client";
import { Carousel } from "@/components/Carousel";
import { Container } from "@/components/Container";
import { NavLogo } from "@/components/NavLogo";
import { CTA, HeroType, P } from "@/components/Typography";
import { Flex } from "../components/Flex";
import { ProgressBar, ProgressBarDot } from "../components/ProgressBar";
import { useScrollController } from "./page.hooks";
import { CTASection, Header, HeroSection } from "./page.styles";

const images = [
  { id: 0, url: "/images/image01.jpg", alt: "Background picture" },
  { id: 1, url: "/images/image02.jpg", alt: "Background picture" },
  { id: 2, url: "/images/image03.jpg", alt: "Background picture" },
  { id: 3, url: "/images/image04.jpg", alt: "Background picture" },
  { id: 4, url: "/images/image05.jpg", alt: "Background picture" },
];

const imageSize = {
  height: 330,
  width: 248,
};

export default function Home() {
  const scrollState = useScrollController(images);
  return (
    <Container>
      <Carousel images={images} imageSize={imageSize} scrollState={scrollState} />
      <Header>
        <nav>
          <NavLogo href="/">XYZ PHOTOGRAPHY</NavLogo>
        </nav>
      </Header>
      <HeroSection>
        <HeroType>
          EVERYDAY
          <br />
          FLOWERS
        </HeroType>
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
        <CTASection>
          <P>
            JOHANNA HOBEL
            <br />
            FOR WILD
          </P>
          <P>DEC 2019</P>
          <CTA href="/">HAVE A LOOK</CTA>
        </CTASection>
      </HeroSection>
    </Container>
  );
}
