"use client";
import { useState } from "react";
import { Carousel } from "@/components/Carousel";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { NavLogo } from "@/components/NavLogo";

export default function Home() {
  const [isCarouselEnabled, setIsCarouselEnabled] = useState(false);
  return (
    <Container>
      <Header>
        <nav>
          <NavLogo onIntroEnd={() => setIsCarouselEnabled(true)} />
        </nav>
      </Header>
      <Carousel enabled={isCarouselEnabled} />
    </Container>
  );
}
