"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useMotionTemplate, useTransform } from "framer-motion";

interface InteractiveBackgroundProps {
  subtle?: boolean;
}

export function InteractiveBackground({ subtle = false }: InteractiveBackgroundProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs ultra-suaves a 60fps
  const springX = useSpring(mouseX, { stiffness: subtle ? 110 : 120, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: subtle ? 110 : 120, damping: 25 });

  // Grid oposta para profundidade de fundo em paralaxe
  const gridTransformX = useTransform(springX, (x) => {
    if (typeof window === "undefined") return 0;
    return (x - window.innerWidth / 2) * (subtle ? -0.015 : -0.02);
  });

  const gridTransformY = useTransform(springY, (y) => {
    if (typeof window === "undefined") return 0;
    return (y - window.innerHeight / 2) * (subtle ? -0.015 : -0.02);
  });

  // Holofote de elevação (Apenas no login, desativado completamente no modo subtle)
  const spotlightBg = useMotionTemplate`radial-gradient(550px circle at ${springX}px ${springY}px, rgba(255, 77, 0, 0.15), transparent 75%)`;
  const reliefShadowBg = useMotionTemplate`radial-gradient(400px circle at ${springX}px ${springY}px, rgba(0, 0, 0, 0.5), transparent 85%)`;

  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mouseX, mouseY]);

  if (!mounted) {
    return <div className="absolute inset-0 pointer-events-none bg-[#131211] z-0" />;
  }

  // Espaçamento e dimensão dos quadradinhos da grade
  const spacing = subtle ? 40 : 44;
  const cols = Math.ceil(dimensions.width / spacing) + 1;
  const rows = Math.ceil(dimensions.height / spacing) + 1;
  const tiles = [];

  const elevationRadius = subtle ? 220 : 240;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * spacing;
      const cy = r * spacing;

      const dist = Math.hypot(cx - mousePos.x, cy - mousePos.y);
      let lift = 0;
      if (dist < elevationRadius) {
        // Curva de elevação tátil
        lift = Math.pow(1 - dist / elevationRadius, 2);
      }

      // Deslocamento dos quadradinhos que sobem sob o ponteiro
      const baseTileSize = subtle ? 2.5 : 3.0;
      const tileSize = baseTileSize + lift * (subtle ? 3.5 : 4.0);
      const offsetY = -lift * (subtle ? 8 : 7); // Sobe verticalmente até -8px no modo sutil
      const opacity = subtle ? (lift > 0.05 ? 0.2 + lift * 0.75 : 0.18) : 0.35 + lift * 0.55;
      const isElevated = lift > 0.12;

      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={cx - tileSize / 2}
          y={cy + offsetY - tileSize / 2}
          width={tileSize}
          height={tileSize}
          rx={tileSize > 4 ? 1.5 : 0.8}
          fill={isElevated ? "#ff4d00" : subtle ? "#3a3532" : "#443f3b"}
          opacity={opacity}
          className="transition-all duration-150 ease-out"
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#131211]">
      {/* 1. Grade Distante com Parallax 3D */}
      <motion.div
        className={`absolute -inset-10 bg-[radial-gradient(#332e2b_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none ${
          subtle ? "opacity-20" : "opacity-40"
        }`}
        style={{
          x: gridTransformX,
          y: gridTransformY,
        }}
      />

      {/* 2. Malha SVG de Quadradinhos que Sobem e Ganham Destaque sob o Mouse */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {tiles}
      </svg>

      {/* 3. Iluminação & Sombras de Holofote (APENAS na Tela de Login / !subtle) */}
      {!subtle && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
            style={{ background: reliefShadowBg }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: spotlightBg }}
          />
        </>
      )}

      {/* 4. Vinheta Ambiencial para Profundidade */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          subtle
            ? "bg-[radial-gradient(circle_at_center,transparent_60%,rgba(19,18,17,0.95)_100%)]"
            : "bg-[radial-gradient(circle_at_center,transparent_35%,rgba(19,18,17,0.85)_100%)]"
        }`}
      />

      {/* 5. Marcações Técnicas (Ocultas no modo subtle) */}
      {!subtle && (
        <>
          <div className="absolute top-6 left-6 text-[#443f3b] font-mono text-[10px] tracking-wider font-medium select-none">
            + SPECFLOW_RELIEF_GRID
          </div>
          <div className="absolute top-6 right-6 text-[#443f3b] font-mono text-[10px] tracking-wider font-medium select-none">
            + TOPOGRAPHIC_ELEVATION_60FPS
          </div>
          <div className="absolute bottom-6 left-6 text-[#443f3b] font-mono text-[10px] tracking-wider font-medium select-none">
            + HEIGHT_MAP_DISPLACEMENT
          </div>
          <div className="absolute bottom-6 right-6 text-[#ff4d00]/70 font-mono text-[10px] tracking-wider font-semibold select-none">
            + ZOD_STUDIO_V1
          </div>
        </>
      )}
    </div>
  );
}
