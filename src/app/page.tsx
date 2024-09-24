import { Carousel } from "@/components/Carousel";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { NavLogo } from "@/components/NavLogo";

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
