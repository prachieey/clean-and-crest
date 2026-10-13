"use client";

import React, { useRef, useEffect } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  perspective?: number;
  className?: string;
}

export function TiltCard({
  children,
  maxTilt = 4.5,
  perspective = 900,
  className = "",
  style,
  ...rest
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    // Progressive enhancement: Only enable on fine pointers (desktop) without reduced motion
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) {
      return;
    }

    let rafId: number | null = null;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetGlareOpacity = 0;
    let currentGlareOpacity = 0;
    let glareX = 50;
    let glareY = 50;

    const onPointerMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle tilt toward pointer (strictly max ~4.5 degrees)
      targetRotX = -relY * (maxTilt * 2);
      targetRotY = relX * (maxTilt * 2);
      targetGlareOpacity = 0.16;

      glareX = (relX + 0.5) * 100;
      glareY = (relY + 0.5) * 100;

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const render = () => {
      // Smooth interpolation for silky return and entry
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;
      currentGlareOpacity += (targetGlareOpacity - currentGlareOpacity) * 0.12;

      card.style.transform = `perspective(${perspective}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

      if (glare) {
        glare.style.opacity = currentGlareOpacity.toFixed(3);
        glare.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.4) 0%, rgba(22, 105, 201, 0.05) 40%, transparent 70%)`;
      }

      if (
        Math.abs(targetRotX - currentRotX) > 0.01 ||
        Math.abs(targetRotY - currentRotY) > 0.01 ||
        Math.abs(targetGlareOpacity - currentGlareOpacity) > 0.01
      ) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const onPointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetGlareOpacity = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    card.addEventListener("pointermove", onPointerMove, { passive: true });
    card.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = "";
      if (glare) glare.style.opacity = "0";
    };
  }, [maxTilt, perspective]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...rest}
    >
      {children}
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 10,
          mixBlendMode: "overlay",
          transition: "opacity 0.2s ease",
        }}
      />
    </div>
  );
}
