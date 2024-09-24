"use client";
import { Carousel } from "@/components/Carousel";
import { Container } from "@/components/Container";
import { NavLogo } from "@/components/NavLogo";
import { Header } from "./page.styles";

export default function Home() {
  return (
    <Container>
      <Header>
        <nav>
          <NavLogo data-cursor-hover />
        </nav>
      </Header>
      <Carousel />
    </Container>
  );
}
