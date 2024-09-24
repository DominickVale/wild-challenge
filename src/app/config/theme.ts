const theme = {
  padding: "1rem",
  colors: {
    typeLight: "white",
    typeDark: "#202020",
  },
  fontSize: {
    smallest: "0.5rem",
    small: "0.625rem",
    default: "1rem",
    big: "clamp(1.2rem, min(13.35vh, 13.35vw), 40rem)",
    huge: "clamp(5.2rem, 13.35vw, 50rem)",
  },
  animations: {
    intro: {
      letterDuration: 0.25,
    },
    carousel: {
      slideDuration: 1.5,
      slideEndOffset: 1.5 / 3,
      slideEase: "power3.inOut",
      backgroundDuration: 2,
      imageSizeOffset: 8,
    },
    cursor: {
      progressDuration: 1.5,
      progressEase: "elastic.out(0.2,0.1)",
      dampenDuration: 0.6,
      dampenEase: "elastic.out(0.2,0.15)",
    },
  },
};

export { theme };
