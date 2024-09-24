export const IS_DEV = process.env.NODE_ENV === "development";
export const IS_PROD = process.env.NODE_ENV === "production";

export const images = [
  {
    id: "image01",
    url: "/images/image01.jpg",
    alt: "A black and white image of the upper back of a muscular person.",
    title: "everyday flowers",
    author: "johanna hobel",
    date: "jun 2019",
    client: "wild",
  },
  {
    id: "image02",
    url: "/images/image02.jpg",
    alt: "A stylistic picture of a woman looking slightly down at the camera.",
    title: "the wilder night",
    author: "johanna hobel",
    date: "dec 2019",
    client: "wild",
  },
  {
    id: "image03",
    url: "/images/image03.jpg",
    alt: "A picture of an Alpaca.",
    title: "smooth memories",
    author: "johanna hobel",
    date: "feb 2020",
    client: "chanel",
  },
  {
    id: "image04",
    url: "/images/image04.jpg",
    alt: "An abstract picture featuring warm colors on the right and cold colors on the left.",
    title: "the future universe",
    author: "johanna hobel",
    client: "on",
    date: "apr 2020",
  },
  {
    id: "image05",
    url: "/images/image05.jpg",
    alt: "A black and white picture of the silhouette of a pregnant woman behind veils.",
    title: "she was born urban",
    author: "johanna hobel",
    client: "si",
    date: "dec 2021",
  },
];

export const imgScaleDownFactor = 2.05;
export const imgRatio = 680 / 512;
