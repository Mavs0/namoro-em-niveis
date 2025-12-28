"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface PixiHeartProps {
  width?: number;
  height?: number;
}

export default function PixiHeart({
  width = 800,
  height = 400,
}: PixiHeartProps) {
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    // Criar corações
    const newHearts = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setHearts(newHearts);

    // Criar partículas
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {/* Corações animados */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            animation: `float-heart ${3 + heart.delay}s ease-in-out infinite`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <Heart className="w-8 h-8 md:w-12 md:h-12 fill-pixel-pink text-pixel-pink opacity-80" />
        </div>
      ))}

      {/* Partículas */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-retro-blue rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float-particle ${
              4 + particle.delay
            }s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            boxShadow: "0 0 4px rgba(77, 106, 255, 0.8)",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float-heart {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translate(-50%, -50%) translateY(-20px) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px) scale(0.9);
            opacity: 0.8;
          }
          75% {
            transform: translate(-50%, -50%) translateY(-25px) scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-15px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(5px);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
