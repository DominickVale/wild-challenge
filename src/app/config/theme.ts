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
    huge: "13.75rem",
  },
  animations: {
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
