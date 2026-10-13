import React from "react";
import Image from "next/image";

interface WaveDividerProps {
  className?: string;
  flip?: boolean;
}

export function WaveDivider({ className = "", flip = false }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        overflow: "hidden",
        lineHeight: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: 0.6,
        transform: flip ? "rotate(180deg)" : undefined,
      }}
      className={className}
    >
      <Image
        src="/images/3d-wave-divider.webp"
        alt=""
        width={1200}
        height={48}
        loading="lazy"
        style={{
          width: "100%",
          maxWidth: "1200px",
          height: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 2px 4px rgba(13, 37, 63, 0.04))",
        }}
      />
    </div>
  );
}
