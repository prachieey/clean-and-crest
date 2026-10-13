"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface BubbleData {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  driftSpeed: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  phase: number;
}

interface SparkleData {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  rotSpeed: number;
  phase: number;
}

export function HeroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });

    // Rule 3: Cap devicePixelRatio at 1.5
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background

    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.tabIndex = -1;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    // 2. Soft Studio Lighting (Ambient + Directional)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(4, 6, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x28c5e0, 0.6);
    rimLight.position.set(-4, -3, 3);
    scene.add(rimLight);

    // 3. Shared Low-Poly Sphere Geometries & Materials
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);

    // 3 Curated Translucent Materials: Aqua Cyan, Royal Blue, Soft Navy
    const matAqua = new THREE.MeshPhysicalMaterial({
      color: 0x28c5e0,
      transmission: 0.94,
      opacity: 0.85,
      transparent: true,
      roughness: 0.08,
      ior: 1.33,
      thickness: 0.6,
      specularIntensity: 1.0,
      metalness: 0.04,
    });

    const matBlue = new THREE.MeshPhysicalMaterial({
      color: 0x1669c9,
      transmission: 0.90,
      opacity: 0.85,
      transparent: true,
      roughness: 0.10,
      ior: 1.33,
      thickness: 0.8,
      specularIntensity: 1.0,
      metalness: 0.04,
    });

    const matNavy = new THREE.MeshPhysicalMaterial({
      color: 0x0d253f,
      transmission: 0.86,
      opacity: 0.85,
      transparent: true,
      roughness: 0.12,
      ior: 1.33,
      thickness: 1.0,
      specularIntensity: 1.0,
      metalness: 0.06,
    });

    const materials = [matAqua, matBlue, matNavy];

    // Root Group for gentle pointer shift (clamped under 0.3 units)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 4. Create 9 Glossy Translucent Bubbles framing the photo perimeter (leaving center clear)
    const bubbleConfigs = [
      // Top right cluster
      { x: 2.1, y: 1.4, z: 0.2, scale: 0.44, matIdx: 0, speed: 0.22 },
      { x: 2.5, y: 0.8, z: -0.3, scale: 0.35, matIdx: 1, speed: 0.20 },
      { x: 1.8, y: 2.2, z: 0.4, scale: 0.28, matIdx: 2, speed: 0.28 },
      { x: 2.7, y: 2.0, z: -0.2, scale: 0.22, matIdx: 0, speed: 0.25 },

      // Bottom left cluster
      { x: -2.2, y: -1.5, z: 0.3, scale: 0.40, matIdx: 1, speed: 0.22 },
      { x: -2.6, y: -0.9, z: -0.3, scale: 0.30, matIdx: 0, speed: 0.18 },
      { x: -1.9, y: -2.1, z: 0.4, scale: 0.24, matIdx: 2, speed: 0.26 },

      // Perimeter depth accents (upper-left and lower-right edges)
      { x: 2.3, y: -1.2, z: 0.3, scale: 0.32, matIdx: 0, speed: 0.20 },
      { x: -2.4, y: 1.6, z: -0.4, scale: 0.28, matIdx: 1, speed: 0.24 },
    ];

    const bubbles: BubbleData[] = bubbleConfigs.map((cfg, i) => {
      const mesh = new THREE.Mesh(sphereGeo, materials[cfg.matIdx]);
      mesh.scale.setScalar(cfg.scale);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      rootGroup.add(mesh);

      return {
        mesh,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        driftSpeed: cfg.speed,
        rotSpeedX: (i % 2 === 0 ? 0.3 : -0.25) * 0.5,
        rotSpeedY: (i % 3 === 0 ? 0.4 : -0.35) * 0.5,
        rotSpeedZ: 0.2 * 0.5,
        wobbleSpeed: 0.8 + i * 0.15,
        wobbleAmount: 0.08 + (i % 3) * 0.03,
        phase: i * 0.75,
      };
    });

    // 5. Create 3 Subtle Delicate Sparkles (subtle glints at perimeter, no dark spikes)
    const sparkleGeo = new THREE.OctahedronGeometry(0.12, 0);

    const matSparkle = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x28c5e0,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });

    const sparkleConfigs = [
      { x: 2.2, y: 2.1, z: 0.6, scale: 0.5 },
      { x: -2.1, y: -1.8, z: 0.5, scale: 0.4 },
      { x: 2.6, y: -1.4, z: 0.4, scale: 0.35 },
    ];

    const sparkles: SparkleData[] = sparkleConfigs.map((cfg, i) => {
      const mesh = new THREE.Mesh(sparkleGeo, matSparkle);
      mesh.scale.setScalar(cfg.scale);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      rootGroup.add(mesh);

      return {
        mesh,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        rotSpeed: 0.8 + i * 0.3,
        phase: i * 1.2,
      };
    });

    // 6. Pointer Parallax (Target Shift strictly under 0.3 units)
    let targetShiftX = 0;
    let targetShiftY = 0;
    let currentShiftX = 0;
    let currentShiftY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      // Clamped strictly under 0.3 units
      targetShiftX = Math.max(-1, Math.min(1, normX)) * 0.24;
      targetShiftY = Math.max(-1, Math.min(1, normY)) * -0.24;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // 7. Pausing Mechanisms (IntersectionObserver + visibilitychange)
    let isPaused = false;
    let isVisibleOnScreen = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting;
        isPaused = !isVisibleOnScreen || document.hidden;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onVisibilityChange = () => {
      isPaused = !isVisibleOnScreen || document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // 8. Resize Handler
    const onResize = () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    // 9. Animation Loop
    let rafId: number | null = null;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (isPaused) return;

      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth pointer shift lerp
      currentShiftX += (targetShiftX - currentShiftX) * 0.06;
      currentShiftY += (targetShiftY - currentShiftY) * 0.06;
      rootGroup.position.x = currentShiftX;
      rootGroup.position.y = currentShiftY;

      // Animate Bubbles: Calm upward drift + subtle wobble & rotation
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        // Vertical cycle from -2.8 to +2.8
        const yOffset = ((elapsed * b.driftSpeed + b.phase) % 5.6) - 2.8;
        b.mesh.position.y = b.baseY + yOffset;

        // Subtle lateral wobble
        b.mesh.position.x =
          b.baseX + Math.sin(elapsed * b.wobbleSpeed + b.phase) * b.wobbleAmount;

        // Gentle 3-axis rotation
        b.mesh.rotation.x += b.rotSpeedX * delta;
        b.mesh.rotation.y += b.rotSpeedY * delta;
        b.mesh.rotation.z += b.rotSpeedZ * delta;
      }

      // Animate Sparkles: Pulse scale & rotate
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        s.mesh.rotation.y += s.rotSpeed * delta;
        s.mesh.rotation.z += (s.rotSpeed * 0.5) * delta;
        const pulse = 1 + Math.sin(elapsed * 2.5 + s.phase) * 0.15;
        s.mesh.scale.set(
          sparkleConfigs[i].scale * 0.8 * pulse,
          sparkleConfigs[i].scale * 2.2 * pulse,
          sparkleConfigs[i].scale * 0.8 * pulse
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Complete Resource Disposal on Unmount
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();

      // Dispose geometries
      sphereGeo.dispose();
      sparkleGeo.dispose();

      // Dispose materials
      matAqua.dispose();
      matBlue.dispose();
      matNavy.dispose();
      matSparkle.dispose();

      // Dispose renderer & force WebGL context loss
      renderer.dispose();
      try {
        renderer.forceContextLoss();
      } catch {}

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
    />
  );
}
