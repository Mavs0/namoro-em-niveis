"use client";

import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";

interface HudProps {
  hearts: number;
  maxHearts: number;
  xp: number;
  maxXp: number;
}

export default function Hud({ hearts, maxHearts, xp, maxXp }: HudProps) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-auto">
      <div className="bg-background/90 backdrop-blur-md border border-retro-blue/30 rounded-lg p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Corações */}
          <div className="flex items-center gap-2">
            <span className="pixel-font text-xs text-pixel-pink">VIDA:</span>
            <div className="flex gap-1">
              {Array.from({ length: maxHearts }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < hearts
                      ? "fill-pixel-pink text-pixel-pink"
                      : "text-white/20"
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </div>

          {/* Barra de XP */}
          <div className="flex-1 md:flex-initial md:w-64">
            <div className="flex items-center gap-2 mb-1">
              <span className="pixel-font text-xs text-xp-yellow">XP:</span>
              <span className="text-xs text-white/70 font-sans">
                {xp}/{maxXp}
              </span>
            </div>
            <Progress value={xp} max={maxXp} />
          </div>
        </div>
      </div>
    </div>
  );
}

