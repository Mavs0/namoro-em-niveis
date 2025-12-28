"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Lock, Gamepad2 } from "lucide-react";

export type LevelStatus = "completed" | "in-progress" | "locked" | "boss";

interface LevelCardProps {
  level: number;
  title: string;
  description: string;
  status: LevelStatus;
  date?: string;
}

export default function LevelCard({
  level,
  title,
  description,
  status,
  date,
}: LevelCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-xp-yellow" />;
      case "in-progress":
        return (
          <AlertCircle className="w-6 h-6 text-retro-blue animate-pulse" />
        );
      case "boss":
        return <Gamepad2 className="w-6 h-6 text-pixel-pink animate-bounce" />;
      case "locked":
        return <Lock className="w-6 h-6 text-white/30" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "✔️ Concluído";
      case "in-progress":
        return "⚠️ Em Progresso";
      case "boss":
        return "👾 Boss Fight";
      case "locked":
        return "🔒 Bloqueado";
    }
  };

  return (
    <Card
      className={`transition-all duration-300 ${
        status === "locked"
          ? "opacity-50"
          : "hover:scale-105 hover:border-retro-blue/50"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-retro-blue">
            NÍVEL {level}: {title}
          </CardTitle>
          {getStatusIcon()}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs pixel-font text-pixel-pink">
            {getStatusText()}
          </span>
          {date && (
            <span className="text-xs text-white/50 font-sans">• {date}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed text-white/90 whitespace-pre-line">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
