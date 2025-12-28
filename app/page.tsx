"use client";

import { useState, useEffect } from "react";
import GameStart from "@/components/GameStart";
import Hud from "@/components/Hud";
import LevelCard from "@/components/LevelCard";
import PixiHeart from "@/components/PixiHeart";
import Boss from "@/components/Boss";
import MiniGame from "@/components/MiniGame";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Gamepad2 } from "lucide-react";
import {
  getLevelProgress,
  completeGame,
  getRequiredGamesForLevel,
  isLevelUnlocked,
  getHearts,
  updateHearts,
  getXP,
  updateXP,
  type GameType,
} from "@/lib/gameStorage";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showBoss, setShowBoss] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<
    "heart-click" | "memory" | "reaction" | "sequence" | "puzzle" | null
  >(null);

  // Estado do jogo (agora dinâmico!)
  const [hearts, setHearts] = useState(getHearts());
  const maxHearts = 5;
  const [xp, setXp] = useState(getXP());
  const maxXp = 100;
  const [levelProgress, setLevelProgress] = useState(getLevelProgress());

  // Atualizar progresso quando componente monta
  useEffect(() => {
    setLevelProgress(getLevelProgress());
    setHearts(getHearts());
    setXp(getXP());
  }, []);

  const getLevelStatus = (
    level: number
  ): "completed" | "in-progress" | "boss" | "locked" => {
    if (level === 5) return "locked"; // Sempre bloqueado

    const unlocked = isLevelUnlocked(level);
    const progress = levelProgress.find((p) => p.level === level);
    const requiredGames = getRequiredGamesForLevel(level);

    if (!unlocked) return "locked";

    if (level === 4) return "boss";

    if (progress && requiredGames.length > 0) {
      const allCompleted = requiredGames.every((game) =>
        progress.completedGames.includes(game)
      );
      return allCompleted ? "completed" : "in-progress";
    }

    return "in-progress";
  };

  const levels = [
    {
      level: 1,
      title: "CONHECER",
      description:
        "Conhecer você foi acontecendo aos poucos, sem pressa, quase sem perceber. Aprendi seus gostos, seus silêncios e o jeito cuidadoso com que você ama. Em sete meses, percebi que não era só sobre gostar — era sobre me sentir em casa em alguém. Desde o começo, algo em mim soube que você não seria passageiro.",
      status: getLevelStatus(1),
    },
    {
      level: 2,
      title: "CONFIAR",
      description:
        "Confiar foi um aprendizado diário. Nem sempre fácil, nem sempre automático, mas sempre escolhido. Mesmo quando minhas inseguranças falavam mais alto, eu continuei aqui, tentando acreditar no que a gente construiu. Confiar em você também me ensinou que amar exige coragem.",
      status: getLevelStatus(2),
    },
    {
      level: 3,
      title: "CRESCER JUNTOS",
      description:
        "Crescer juntos tem sido entender que o amor não é só leveza. Às vezes é ajuste, conversa difícil e reconhecer erros. Eu sei que já falhei, que já me confundi e que às vezes fiz parecer que eu não sentia o que sinto. Mas crescer com você é escolher melhorar, não desistir e aprender com cada passo.",
      status: getLevelStatus(3),
    },
    {
      level: 4,
      title: "COMUNICAÇÃO",
      description:
        "Esse nível quase derrubou a gente. Uma conversa difícil, sentimentos atravessados e o medo de perder falaram mais alto. Me desculpa por todas as vezes em que te fiz duvidar do meu amor ou pensar que eu estava aqui sem querer estar. Eu quero aprender a falar melhor, ser mais segura, mais clara e mais justa com você. Porque eu gosto de você — de verdade — e não quero mais deixar dúvidas onde existe sentimento.",
      status: getLevelStatus(4),
    },
    {
      level: 5,
      title: "FUTURO",
      description:
        "O futuro ainda não está liberado, e tudo bem. Ele não se constrói com promessas grandes, mas com escolhas pequenas todos os dias. O que eu sei agora é que quero continuar jogando com você, com mais cuidado, mais diálogo e menos medo. Não prometo perfeição, prometo intenção, presença e vontade sincera de continuar.",
      status: "locked" as const,
    },
  ];

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleBossClick = () => {
    setShowBoss(true);
  };

  const handleSaveProgress = () => {
    setShowFinal(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleMiniGameComplete = (
    xpGained: number,
    gameType: GameType,
    success: boolean = true
  ) => {
    // Converter pontuação do jogo em XP (normalizar para valores entre 5-25 XP por jogo)
    let xpToAdd = 0;
    if (success && xpGained > 0) {
      // Normalizar XP baseado no tipo de jogo
      switch (gameType) {
        case "heart-click":
          // XP baseado em quantos corações coletou (máx 25 XP)
          xpToAdd = Math.min(25, Math.floor(xpGained / 4));
          break;
        case "memory":
          // XP fixo por completar memória (20 XP)
          xpToAdd = 20;
          break;
        case "sequence":
          // XP baseado em quantas rodadas completou (máx 25 XP)
          xpToAdd = Math.min(25, Math.floor(xpGained / 4));
          break;
        case "puzzle":
          // XP fixo por resolver puzzle (25 XP)
          xpToAdd = 25;
          break;
        case "reaction":
          // XP baseado na pontuação (máx 20 XP)
          xpToAdd = Math.min(20, Math.floor(xpGained / 5));
          break;
        default:
          xpToAdd = 10;
      }

      // Garantir mínimo de 5 XP por jogo completado
      if (xpToAdd < 5) xpToAdd = 5;
    }

    // Atualizar XP e persistir
    if (xpToAdd > 0) {
      const newXP = updateXP(xpToAdd);
      setXp(newXP);
    }

    // Atualizar vidas baseado no sucesso
    if (success) {
      // Ganhar vida ao completar com sucesso (se não estiver no máximo)
      if (hearts < maxHearts && xpGained > 0) {
        const newHearts = updateHearts(1);
        setHearts(newHearts);
      }
    } else {
      // Perder vida ao falhar
      const newHearts = updateHearts(-1);
      setHearts(newHearts);
    }

    // Encontrar qual nível contém este jogo
    let completedLevel = 0;
    if (["heart-click", "sequence"].includes(gameType)) completedLevel = 1;
    else if (["memory", "puzzle"].includes(gameType)) completedLevel = 2;
    else if (gameType === "reaction") completedLevel = 3;

    if (completedLevel > 0 && success) {
      const levelCompleted = completeGame(completedLevel, gameType);
      const newProgress = getLevelProgress();
      setLevelProgress(newProgress);

      if (levelCompleted) {
        // Nível completo! Mostrar mensagem ou animação
        if (completedLevel === 3) {
          // Nível 3 completo, desbloquear boss (nível 4)
          console.log("Nível 3 completo! Boss Fight desbloqueado!");
        } else if (completedLevel < 3) {
          console.log(
            `Nível ${completedLevel} completo! Nível ${
              completedLevel + 1
            } desbloqueado!`
          );
        }
      }
    }

    setTimeout(() => {
      setActiveMiniGame(null);
    }, 2000);
  };

  const getMiniGameForLevel = (
    level: number
  ):
    | ("heart-click" | "memory" | "reaction" | "sequence" | "puzzle")[]
    | null => {
    switch (level) {
      case 1:
        return ["heart-click", "sequence"];
      case 2:
        return ["memory", "puzzle"];
      case 3:
        return ["reaction"];
      default:
        return null;
    }
  };

  if (!gameStarted) {
    return <GameStart onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Hud hearts={hearts} maxHearts={maxHearts} xp={xp} maxXp={maxXp} />

      <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto space-y-12">
        {/* Seção de Corações Animados */}
        <section className="w-full h-64 md:h-96 rounded-lg overflow-hidden border border-retro-blue/30 bg-background/50">
          <PixiHeart width={800} height={400} />
        </section>

        {/* Níveis */}
        <section className="space-y-6">
          <h2 className="pixel-font text-3xl text-center text-retro-blue mb-8">
            NÍVEIS
          </h2>
          {levels.map((level) => {
            const miniGameType = getMiniGameForLevel(level.level);
            const unlocked = level.status !== "locked";
            const progress = levelProgress.find((p) => p.level === level.level);
            const requiredGames = getRequiredGamesForLevel(level.level);

            // Mostrar nível se estiver desbloqueado, ou se for o próximo bloqueado após um desbloqueado
            const shouldShow =
              unlocked ||
              level.level === 5 ||
              (level.level > 1 && isLevelUnlocked(level.level - 1));

            if (!shouldShow) return null;

            return (
              <div key={level.level} className="space-y-3">
                <div
                  onClick={
                    level.status === "boss" && unlocked
                      ? handleBossClick
                      : undefined
                  }
                  className={
                    level.status === "boss" && unlocked ? "cursor-pointer" : ""
                  }
                >
                  <LevelCard {...level} />
                </div>
                {miniGameType && unlocked && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap justify-center gap-2">
                      {miniGameType.map((gameType) => {
                        const isCompleted =
                          progress?.completedGames.includes(gameType) || false;
                        return (
                          <Button
                            key={gameType}
                            variant={isCompleted ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveMiniGame(gameType)}
                            className="pixel-font text-xs"
                          >
                            <Gamepad2 className="mr-2 w-4 h-4" />
                            {gameType === "heart-click" && "💕 CORAÇÕES"}
                            {gameType === "memory" && "🧠 MEMÓRIA"}
                            {gameType === "reaction" && "⚡ REAÇÃO"}
                            {gameType === "sequence" && "🎯 SEQUÊNCIA"}
                            {gameType === "puzzle" && "🧩 PUZZLE"}
                            {isCompleted && " ✓"}
                          </Button>
                        );
                      })}
                    </div>
                    {requiredGames.length > 0 && (
                      <p className="text-xs text-white/50 text-center">
                        {progress?.completedGames.length || 0}/
                        {requiredGames.length} jogos completados
                      </p>
                    )}
                  </div>
                )}
                {!unlocked && level.level < 5 && (
                  <p className="text-xs text-white/50 text-center italic">
                    Complete os jogos do nível anterior para desbloquear
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* Mini-Jogos em Dialog */}
        <Dialog
          open={activeMiniGame !== null}
          onOpenChange={(open) => {
            if (!open) {
              setActiveMiniGame(null);
            }
          }}
          closeOnOutsideClick={false}
        >
          {activeMiniGame && (
            <MiniGame
              type={activeMiniGame}
              onComplete={(xpGained, success = true) =>
                handleMiniGameComplete(xpGained, activeMiniGame, success)
              }
              onClose={() => setActiveMiniGame(null)}
            />
          )}
        </Dialog>

        {/* Boss Fight */}
        {showBoss && (
          <section className="space-y-6 animate-fade-in">
            <Boss />
          </section>
        )}

        {/* Botão Salvar Progresso */}
        {!showFinal && (
          <section className="flex justify-center pt-8">
            <Button
              size="lg"
              variant="secondary"
              className="pixel-font text-lg px-8 py-6 transform transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,122,162,0.5)]"
              onClick={handleSaveProgress}
            >
              <Save className="mr-2 w-5 h-5" />
              💾 SALVAR PROGRESSO
            </Button>
          </section>
        )}

        {/* Tela Final */}
        {showFinal && (
          <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-fade-in py-16">
            <div className="space-y-6 max-w-2xl">
              <h2 className="pixel-font text-4xl md:text-5xl text-pixel-pink">
                PROGRESSO SALVO
              </h2>
              <div className="space-y-4 text-lg md:text-xl text-white/90 font-sans leading-relaxed">
                <p>
                  Este jogo não tem save point porque nosso relacionamento não
                  precisa de um.
                </p>
                <p>
                  Cada dia juntos é um novo checkpoint. Cada momento especial é
                  um achievement desbloqueado. Cada desafio superado é XP ganho.
                </p>
                <p className="text-pixel-pink font-semibold">
                  O progresso está salvo no coração, não em um servidor.
                </p>
                <p>
                  E o melhor de tudo? Este jogo não tem game over. Enquanto
                  estivermos juntos, sempre haverá um novo nível para explorar,
                  uma nova quest para completar, uma nova história para viver.
                </p>
              </div>
              <div className="pt-8">
                <p className="pixel-font text-retro-blue text-2xl">
                  COM VOCÊ, SEMPRE.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
