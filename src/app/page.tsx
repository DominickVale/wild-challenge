import { NavLogo } from "@/components/NavLogo";
import { Container } from "@/components/Container";
import { CTA, HeroType, P } from "@/components/Typography";
import { ProgressBar, ProgressBarDot } from "../components/ProgressBar";
import { Flex } from "../components/Flex";
import { CTASection, Header, HeroSection } from "./page.styles";

export default function Home() {
  return (
    <Container>
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
