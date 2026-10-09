"use client";

import { useEffect } from "react";

/**
 * ScrollRevealInit
 * 
 * Progressive enhancement Intersection Observer controller.
 * If JavaScript is disabled or fails, elements are 100% visible by default.
 * When active, adds 'js-reveal' to <html>, observes [data-reveal] elements,
 * animates them once (fade-in + 16px rise over 400ms), and unobserves immediately.
 * Respects prefers-reduced-motion by bypassing animations.
 */
export function ScrollRevealInit() {
  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // 2. Check IntersectionObserver support
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const docEl = document.documentElement;
    docEl.classList.add("js-reveal");

    // 3. Observer setup (triggers once when element enters viewport)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    // Observe all data-reveal elements
    const elementsToReveal = document.querySelectorAll(
      "[data-reveal], [data-reveal-stagger]"
    );
    elementsToReveal.forEach((el) => observer.observe(el));

    // Dynamic mutation observer for client-rendered routes/steps
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal], [data-reveal-stagger]")) {
              observer.observe(node);
            }
            node
              .querySelectorAll?.("[data-reveal], [data-reveal-stagger]")
              .forEach((child) => observer.observe(child));
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      docEl.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
