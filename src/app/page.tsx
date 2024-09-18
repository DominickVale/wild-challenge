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
          <NavLogo href="/">XYZ PHOTOGRAPHY</NavLogo>
        </nav>
      </Header>
      <Carousel />
    </Container>
  );
}
