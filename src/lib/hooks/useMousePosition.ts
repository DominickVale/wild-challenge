"use client";

import { useState, useEffect } from "react";

type MousePosition = {
  x: number | null;
  y: number | null;
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: null, y: null });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
