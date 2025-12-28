"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GameStartProps {
  onStart: () => void;
}

export default function GameStart({ onStart }: GameStartProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-8 animate-fade-in">
        <h1 className="pixel-font text-4xl md:text-6xl text-retro-blue mb-4">
          NAMORO EM NÍVEIS
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-sans max-w-2xl mx-auto">
          Uma jornada de amor transformada em aventura
        </p>
        <p className="text-lg md:text-xl text-pixel-pink font-sans max-w-xl mx-auto">
          Cada momento juntos é um novo nível desbloqueado
        </p>
        <div className="pt-8">
          <Button
            size="lg"
            className="pixel-font text-lg px-8 py-6 transform transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(77,106,255,0.5)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onStart}
          >
            {isHovered ? "▶ START" : "▶ START"}
          </Button>
        </div>
      </div>
    </div>
  );
}

