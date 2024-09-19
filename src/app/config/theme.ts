const theme = {
  padding: "1rem",
  colors: {
    typeLight: "white",
    typeDark: "#202020",
  },
  fontSize: {
    default: "1rem",
    small: "0.625rem",
    huge: "13.75rem",
  },
  animations: {
    carousel: {
      slideDuration: 1,
      slideEase: "power3.inOut",
      backgroundDuration: 2,
    },
    cursor: {
      progressDuration: 1.5,
      progressEase: "elastic.out(0.2,0.1)",
      dampenDuration: 0.5,
      dampenEase: "elastic.out(0.2,0.15)",
    },
  },
};

export { theme };
