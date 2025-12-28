"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Heart } from "lucide-react";

export default function Boss() {
  const [defeated, setDefeated] = useState(false);
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [clicks, setClicks] = useState(0);
  const [isHit, setIsHit] = useState(false);
  const [phase, setPhase] = useState(1);
  const [attackWarning, setAttackWarning] = useState(false);
  const [incomingAttack, setIncomingAttack] = useState<{
    id: number;
    type: "projectile" | "wave";
    x: number;
    y: number;
  } | null>(null);
  const [canAttack, setCanAttack] = useState(true);
  const [combo, setCombo] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Sistema de ataques do boss
  useEffect(() => {
    if (defeated || bossHealth <= 0) return;

    const attackInterval = setInterval(() => {
      if (Math.random() < 0.4) {
        // 40% de chance de atacar
        setAttackWarning(true);

        setTimeout(() => {
          const attackType = Math.random() < 0.5 ? "projectile" : "wave";
          setIncomingAttack({
            id: Date.now(),
            type: attackType,
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 10,
          });
          setAttackWarning(false);
        }, 1000);
      }
    }, 3000 - phase * 500); // Ataques ficam mais frequentes

    return () => clearInterval(attackInterval);
  }, [bossHealth, phase, defeated]);

  // Mover ataques em direção ao jogador
  useEffect(() => {
    if (!incomingAttack) return;

    const moveInterval = setInterval(() => {
      setIncomingAttack((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          y: prev.y + 2, // Move para baixo
        };
      });
    }, 50);

    // Remover ataque se sair da tela ou após tempo reduzido
    const attackDuration = 2500 - phase * 500; // Mais rápido nas fases finais
    const timeout = setTimeout(() => {
      if (incomingAttack && incomingAttack.y > 100) {
        // Ataque acertou! Perder mais vida nas fases finais
        const damage = 15 + phase * 5; // 15, 20, 25
        setPlayerHealth((prev) => Math.max(0, prev - damage));
        setIsHit(true);
        setTimeout(() => setIsHit(false), 500);
      }
      setIncomingAttack(null);
    }, attackDuration);

    return () => {
      clearInterval(moveInterval);
      clearTimeout(timeout);
    };
  }, [incomingAttack]);

  // Mudar de fase baseado na vida do boss
  useEffect(() => {
    if (bossHealth <= 0) {
      setDefeated(true);
    } else if (bossHealth <= 25 && phase < 3) {
      setPhase(3);
    } else if (bossHealth <= 50 && phase < 2) {
      setPhase(2);
    }
  }, [bossHealth, phase]);

  // Sistema de combo
  const handleBossClick = () => {
    if (!canAttack || defeated) return;

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;

    // Sistema de combo: cliques rápidos aumentam dano
    if (timeSinceLastClick < 500) {
      setCombo((prev) => prev + 1);
    } else {
      setCombo(1);
    }

    setLastClickTime(now);
    setIsHit(true);
    setClicks((prev) => prev + 1);

    // Dano baseado no combo (reduzido para aumentar dificuldade)
    const baseDamage = 3; // Reduzido de 5 para 3
    const comboDamage = Math.min(combo * 1.5, 8); // Máximo 8 de bônus (era 10)
    const totalDamage = Math.floor(baseDamage + comboDamage);

    setBossHealth((prev) => {
      const newHealth = Math.max(0, prev - totalDamage);
      return newHealth;
    });

    // Cooldown de ataque
    setCanAttack(false);
    setTimeout(() => {
      setCanAttack(true);
      setIsHit(false);
    }, 200);
  };

  const handleBlockAttack = () => {
    if (!incomingAttack) return;

    setIncomingAttack(null);
    setCombo((prev) => prev + 1); // Bônus por bloquear
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 1:
        return "Fase 1: Ataques esporádicos";
      case 2:
        return "Fase 2: Intensificando!";
      case 3:
        return "Fase 3: ÚLTIMA RESISTÊNCIA!";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-pixel-pink text-center">
          👾 BOSS FIGHT: COMUNICAÇÃO
        </CardTitle>
        <p className="text-center text-sm text-white/70 mt-2">
          {getPhaseMessage()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status da Batalha */}
        <div className="space-y-4">
          {/* Vida do Boss */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="pixel-font text-xs text-pixel-pink">
                BOSS: {bossHealth}%
              </span>
              <span className="text-xs text-white/70">
                Combo: {combo}x | Cliques: {clicks}
              </span>
            </div>
            <Progress value={bossHealth} max={100} />
          </div>

          {/* Vida do Jogador */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="pixel-font text-xs text-retro-blue">
                SUA VIDA: {playerHealth}%
              </span>
              {playerHealth < 30 && (
                <span className="text-xs text-pixel-pink animate-pulse">
                  ⚠️ CRÍTICO!
                </span>
              )}
            </div>
            <Progress
              value={playerHealth}
              max={100}
              className="[&>div]:bg-retro-blue"
            />
          </div>
        </div>

        {/* Área de Batalha */}
        <div className="relative h-96 bg-background/50 rounded-lg border-2 border-retro-blue/30 overflow-hidden">
          {/* Aviso de Ataque */}
          {attackWarning && (
            <div className="absolute inset-0 flex items-center justify-center bg-pixel-pink/20 animate-pulse z-10">
              <p className="pixel-font text-2xl text-pixel-pink">
                ⚠️ ATAQUE INCOMING! ⚠️
              </p>
            </div>
          )}

          {/* Ataques Incoming */}
          {incomingAttack && (
            <div className="absolute inset-0">
              {incomingAttack.type === "projectile" ? (
                <button
                  onClick={handleBlockAttack}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pixel-pink rounded-full border-4 border-white animate-pulse hover:scale-125 transition-transform z-20"
                  style={{
                    left: `${incomingAttack.x}%`,
                    top: `${incomingAttack.y}%`,
                  }}
                >
                  <span className="text-white font-bold text-lg">💥</span>
                </button>
              ) : (
                <button
                  onClick={handleBlockAttack}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-24 h-8 bg-xp-yellow rounded-lg border-2 border-white animate-pulse hover:scale-110 transition-transform z-20"
                  style={{
                    left: `${incomingAttack.x}%`,
                    top: `${incomingAttack.y}%`,
                  }}
                >
                  <span className="text-white font-bold">🌊</span>
                </button>
              )}
            </div>
          )}

          {/* Boss */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleBossClick}
              disabled={!canAttack || defeated}
              className={`relative pixel-art cursor-pointer transition-all duration-200 ${
                isHit ? "scale-90" : "scale-100"
              } ${
                defeated
                  ? "opacity-50"
                  : canAttack
                  ? "hover:scale-110 animate-bounce-slow"
                  : "opacity-70"
              } ${phase === 3 ? "animate-pulse" : ""}`}
            >
              {/* Boss pixel art usando CSS */}
              <div className="w-32 h-32 bg-xp-yellow pixel-art relative border-4 border-white">
                {/* Cabeça do Boss */}
                <div className="w-full h-full relative">
                  {/* Olhos - mudam de cor na fase 3 */}
                  <div
                    className={`absolute top-6 left-6 w-6 h-6 rounded-full ${
                      phase === 3
                        ? "bg-pixel-pink animate-pulse"
                        : "bg-background"
                    }`}
                  />
                  <div
                    className={`absolute top-6 right-6 w-6 h-6 rounded-full ${
                      phase === 3
                        ? "bg-pixel-pink animate-pulse"
                        : "bg-background"
                    }`}
                  />
                  {/* Boca */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-background" />
                  {/* Indicador de fase */}
                  {phase >= 2 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Zap className="w-6 h-6 text-pixel-pink animate-bounce" />
                    </div>
                  )}
                </div>
                {/* Efeito de dano */}
                {isHit && (
                  <div className="absolute inset-0 bg-pixel-pink/50 animate-pulse" />
                )}
              </div>
              {!defeated && canAttack && (
                <p className="text-xs text-white/50 mt-2 text-center pixel-font">
                  CLIQUE PARA ATACAR!
                </p>
              )}
            </button>
          </div>

          {/* Efeito de dano no jogador */}
          {isHit && playerHealth < 100 && (
            <div className="absolute inset-0 bg-pixel-pink/30 animate-pulse pointer-events-none" />
          )}

          {/* Instruções */}
          {!defeated && !incomingAttack && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-xs text-white/70 pixel-font">
                {canAttack
                  ? "Clique no boss para atacar! Use combo para mais dano!"
                  : "Aguarde..."}
              </p>
            </div>
          )}
        </div>

        {/* Instruções de Batalha */}
        <div className="bg-background/50 rounded-lg p-4 border border-retro-blue/30">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-xp-yellow" />
              <span className="text-white/80">
                Clique rápido = Combo = Mais dano
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-retro-blue" />
              <span className="text-white/80">
                Clique nos ataques para bloquear
              </span>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {defeated && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <p className="pixel-font text-retro-blue text-lg">
              BOSS DERROTADO!
            </p>
            <p className="text-white/80 font-sans leading-relaxed">
              Você derrotou o boss em {clicks} golpes! A comunicação é um
              desafio constante, mas quando enfrentamos juntos, cada conversa
              difícil se torna uma vitória compartilhada. Não há problema que
              não possamos resolver quando nos ouvimos verdadeiramente.
            </p>
            <p className="pixel-font text-xs text-xp-yellow mt-4">
              Combo máximo: {combo}x | Vida restante: {playerHealth}%
            </p>
          </div>
        )}

        {playerHealth <= 0 && !defeated && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="text-6xl mb-4">💔</div>
            <p className="pixel-font text-pixel-pink text-lg">
              VOCÊ FOI DERROTADO!
            </p>
            <p className="text-white/80 font-sans leading-relaxed">
              Não desista! Tente novamente. A comunicação requer prática e
              paciência.
            </p>
            <Button
              onClick={() => {
                setBossHealth(100);
                setPlayerHealth(100);
                setClicks(0);
                setCombo(0);
                setPhase(1);
                setDefeated(false);
                setIncomingAttack(null);
                setAttackWarning(false);
              }}
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        <style jsx>{`
          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
