import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

const lightImageSrc = "/img/wordmark-light.png";
const imageSrc = "/img/wordmark.png";

export default function Wordmark() {
  const { colorMode } = useColorMode();

  return (
    <img
      src={colorMode === "dark" ? lightImageSrc : imageSrc}
      alt="moonlight"
    />
  );
}
