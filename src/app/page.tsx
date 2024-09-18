"use client";
import { Carousel } from "@/components/Carousel";
import { Container } from "@/components/Container";
import { NavLogo } from "@/components/NavLogo";
import { Header } from "./page.styles";

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
  return (
    <Container>
      <Header>
        <nav>
          <NavLogo href="/">XYZ PHOTOGRAPHY</NavLogo>
        </nav>
      </Header>
      <Carousel images={images} imageSize={imageSize} />
    </Container>
  );
}
