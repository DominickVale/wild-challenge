import { Size, Vec2 } from "@/types";
import { useEffect, useState } from "react";

type Returns = {
  positions: Vec2[];
  origin: Vec2;
};

export function useCarouselPositions(pageDimensions: Size | undefined, arr: unknown[], imageSize: Size): Returns {
  const [positions, setPositions] = useState<Vec2[]>([]);
  const [origin, setOrigin] = useState<Vec2>({ x: 0, y: 0 });
  useEffect(() => {
    if (!pageDimensions) {
      return;
    }
    const origin = {
      x: pageDimensions.width / 2,
      y: pageDimensions.height / 2,
    };

    const pattern = {
      x: origin.x - imageSize.width / 2 - 16,
      y: origin.y - imageSize.height / 2 - 16,
    };

    const positions = arr.map((_, idx) => {
      const offset = idx - Math.floor(arr.length / 2);
      return {
        x: origin.x + offset * pattern.x,
        y: origin.y - offset * pattern.y,
      };
    });
    setPositions(positions);
    setOrigin(origin);
  }, [pageDimensions]);
  return { positions, origin };
}
