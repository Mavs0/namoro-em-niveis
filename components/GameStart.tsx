"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface GameStartProps {
  onStart: () => void;
}

export default function GameStart({ onStart }: GameStartProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  // Gerar corações flutuantes
  useEffect(() => {
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Corações flutuantes ao fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-float-heart opacity-20"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <Heart className="w-4 h-4 text-pixel-pink fill-pixel-pink" />
          </div>
        ))}
      </div>

      {/* Efeito de brilho animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-retro-blue/10 via-pixel-pink/5 to-xp-yellow/10 animate-pulse-slow pointer-events-none" />

      <div className="text-center space-y-8 relative z-10">
        {/* Título principal com animação */}
        <div className="animate-fade-in-up">
          <h1 className="pixel-font text-4xl md:text-6xl lg:text-7xl text-retro-blue mb-4 relative inline-block">
            <span className="relative z-10 drop-shadow-[0_0_10px_rgba(77,106,255,0.5)] animate-glow-title">
              NAMORO EM NÍVEIS
            </span>
            {/* Efeito de brilho atrás do título */}
            <span className="absolute inset-0 pixel-font text-4xl md:text-6xl lg:text-7xl text-retro-blue/30 blur-xl animate-pulse-slow">
              NAMORO EM NÍVEIS
            </span>
          </h1>
        </div>

        {/* Mini declaração */}
        <div className="animate-fade-in-up-delay-1">
          <p className="romantic-font-light text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed italic">
            "Este jogo é sobre nós — sobre cada conversa, cada riso, cada
            desafio superado juntos."
          </p>
        </div>

        {/* Subtítulo com animação delay */}
        <div className="animate-fade-in-up-delay-2">
          <p className="romantic-font text-xl md:text-2xl lg:text-3xl text-white/95 max-w-2xl mx-auto font-medium leading-relaxed">
            Uma jornada de amor transformada em aventura
          </p>
        </div>

        {/* Texto secundário com animação delay */}
        <div className="animate-fade-in-up-delay-3">
          <p className="romantic-font text-lg md:text-xl lg:text-2xl text-pixel-pink max-w-xl mx-auto font-medium leading-relaxed animate-pulse-slow">
            Cada momento juntos é um novo nível desbloqueado
          </p>
        </div>

        {/* Botão START com animação */}
        <div className="pt-8 animate-fade-in-up-delay-4">
          <Button
            size="lg"
            className="pixel-font text-lg md:text-xl px-10 py-7 transform transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onStart}
          >
            {/* Efeito de brilho no hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-retro-blue/0 via-white/20 to-retro-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            {/* Texto do botão */}
            <span className="relative z-10 flex items-center gap-2">
              <span className={isHovered ? "animate-bounce" : ""}>▶</span>
              <span>START</span>
            </span>

            {/* Sombra brilhante */}
            <span className="absolute inset-0 blur-xl bg-retro-blue/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </Button>
        </div>

        {/* Decoração: linhas pixeladas */}
        <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-blue/50 to-transparent animate-pulse-slow" />
        <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pixel-pink/50 to-transparent animate-pulse-slow" />
      </div>
    </div>
  );
}
