"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Star, Trophy, Zap, Clock, Loader2 } from "lucide-react";
import { saveScore, getBestScore, type GameType } from "@/lib/gameStorage";
import Confetti from "./Confetti";

type MiniGameType =
  | "heart-click"
  | "memory"
  | "word-match"
  | "reaction"
  | "puzzle";

interface MiniGameProps {
  type: MiniGameType;
  onComplete: (xpGained: number, success?: boolean) => void;
  onClose: () => void;
}

type PowerUpType = "double-points" | "extra-time" | null;

export default function MiniGame({ type, onComplete, onClose }: MiniGameProps) {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // Reduzido de 30 para 20
  const [gameActive, setGameActive] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const [powerUp, setPowerUp] = useState<PowerUpType>(null);
  const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0);

  // Estados específicos dos jogos
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; y: number; clicked: boolean }>
  >([]);
  const [memoryCards, setMemoryCards] = useState<
    Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>
  >([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [wordPairs, setWordPairs] = useState<
    Array<{
      id: number;
      word: string;
      pairId: number;
      matched: boolean;
      selected: boolean;
    }>
  >([]);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [reactionTarget, setReactionTarget] = useState<{
    id: number;
    x: number;
    y: number;
    appeared: boolean;
  } | null>(null);
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(
    null
  );
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null);

  // Loading state e reset de estados
  useEffect(() => {
    setLoading(true);
    setScore(0);
    setGameActive(true);
    setShowConfetti(false);
    setNewRecord(false);
    setPowerUp(null);
    setPowerUpTimeLeft(0);
    setWordPairs([]);
    setSelectedWords([]);
    setReactionTarget(null);
    setReactionStartTime(null);

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [type]);

  // Carregar melhor pontuação
  useEffect(() => {
    setBestScore(getBestScore(type as GameType));
  }, [type]);

  // Power-up timer
  useEffect(() => {
    if (powerUp && powerUpTimeLeft > 0) {
      const timer = setInterval(() => {
        setPowerUpTimeLeft((prev) => {
          if (prev <= 1) {
            setPowerUp(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [powerUp, powerUpTimeLeft]);

  // Gerar power-up aleatório
  const generatePowerUp = () => {
    if (Math.random() < 0.3 && !powerUp) {
      // 30% de chance de gerar power-up
      const types: PowerUpType[] = ["double-points", "extra-time"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setPowerUp(randomType);
      setPowerUpTimeLeft(10); // 10 segundos de duração
    }
  };

  // Jogo: Clique nos Corações
  useEffect(() => {
    if (type === "heart-click" && gameActive && !loading) {
      // Corações desaparecem automaticamente após 2 segundos
      const heartTimeout = setInterval(() => {
        setHearts((prev) => {
          const now = Date.now();
          return prev.filter((heart) => now - heart.id < 2000 || heart.clicked);
        });
      }, 500);

      const interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft((prev) => prev - 1);
          // Gerar novo coração
          const newHeart = {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 10,
            clicked: false,
          };
          setHearts((prev) => [...prev, newHeart]);

          // Chance de gerar power-up
          if (timeLeft % 5 === 0) generatePowerUp();
        } else {
          setGameActive(false);
          const finalScore =
            powerUp === "double-points" ? score * 4 : score * 2;
          const isNewRecord = saveScore(type as GameType, finalScore);
          setNewRecord(isNewRecord);
          // Sucesso se conseguiu pelo menos alguns pontos (aumentado)
          const success = score > 10; // Era 5, agora 10
          if (success) setShowConfetti(true);
          onComplete(finalScore, success);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(heartTimeout);
      };
    }
  }, [type, gameActive, timeLeft, score, onComplete, loading, powerUp]);

  // Jogo: Memory Game
  useEffect(() => {
    if (type === "memory" && !loading) {
      // Mais emojis = mais difícil (8 pares em vez de 6)
      const emojis = ["💕", "💖", "💗", "💝", "💘", "💞", "💟", "💜"];
      const cards = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
          id: index,
          emoji,
          flipped: false,
          matched: false,
        }));
      setMemoryCards(cards);
    }
  }, [type, loading]);

  // Jogo: Match de Palavras
  useEffect(() => {
    if (type === "word-match" && !loading) {
      const pairs = [
        { word1: "Amor", word2: "Coração" },
        { word1: "Beijo", word2: "Carinho" },
        { word1: "Abraço", word2: "Aconchego" },
        { word1: "Riso", word2: "Alegria" },
        { word1: "Olhar", word2: "Conexão" },
        { word1: "Sonho", word2: "Futuro" },
      ];

      // Criar array com todas as palavras embaralhadas
      const allWords: Array<{
        id: number;
        word: string;
        pairId: number;
        matched: boolean;
        selected: boolean;
      }> = [];
      pairs.forEach((pair, pairIndex) => {
        allWords.push(
          {
            id: pairIndex * 2,
            word: pair.word1,
            pairId: pairIndex,
            matched: false,
            selected: false,
          },
          {
            id: pairIndex * 2 + 1,
            word: pair.word2,
            pairId: pairIndex,
            matched: false,
            selected: false,
          }
        );
      });

      // Embaralhar
      const shuffled = allWords.sort(() => Math.random() - 0.5);
      setWordPairs(shuffled);
    }
  }, [type, loading]);

  // Jogo: Reação
  useEffect(() => {
    if (type === "reaction" && !loading && gameActive && !reactionTarget) {
      // Delay mais curto e variável - mais difícil
      const delay = 500 + Math.random() * 1500; // Entre 0.5-2 segundos (era 1-3)
      const timer = setTimeout(() => {
        if (gameActive) {
          setReactionTarget({
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 10,
            appeared: false,
          });
          setReactionStartTime(Date.now());

          // Alvo desaparece após 1.5 segundos se não clicado
          setTimeout(() => {
            setReactionTarget((prev) => {
              if (prev && prev.id === Date.now()) {
                // Perder pontos por não clicar a tempo
                setScore((prev) => Math.max(0, prev - 10));
                return null;
              }
              return prev;
            });
          }, 1500);
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [type, loading, gameActive, reactionTarget]);

  // Jogo: Puzzle
  useEffect(() => {
    if (type === "puzzle" && !loading) {
      const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
      // Embaralhar mais (mais difícil de resolver)
      let shuffled = [...numbers];
      for (let i = 0; i < 20; i++) {
        shuffled = shuffled.sort(() => Math.random() - 0.5);
      }
      setPuzzlePieces(shuffled);
    }
  }, [type, loading]);

  const handleHeartClick = (id: number) => {
    setHearts((prev) =>
      prev.map((heart) =>
        heart.id === id && !heart.clicked ? { ...heart, clicked: true } : heart
      )
    );
    const points = powerUp === "double-points" ? 2 : 1;
    setScore(score + points);
  };

  const handleMemoryCardClick = (id: number) => {
    if (
      flippedCards.length === 2 ||
      memoryCards[id].flipped ||
      memoryCards[id].matched
    )
      return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    const updatedCards = memoryCards.map((card, index) =>
      index === id ? { ...card, flipped: true } : card
    );
    setMemoryCards(updatedCards);

    if (newFlipped.length === 2) {
      setTimeout(() => {
        const [first, second] = newFlipped;
        if (memoryCards[first].emoji === memoryCards[second].emoji) {
          // Match!
          setMemoryCards((prev) =>
            prev.map((card, index) =>
              newFlipped.includes(index)
                ? { ...card, matched: true, flipped: false }
                : card
            )
          );
          const points = powerUp === "double-points" ? 20 : 10;
          setScore(score + points);

          if (
            memoryCards.filter((c) => c.matched).length ===
            memoryCards.length - 2
          ) {
            setGameActive(false);
            const finalScore = score + points;
            const isNewRecord = saveScore(type as GameType, finalScore);
            setNewRecord(isNewRecord);
            setShowConfetti(true);
            onComplete(finalScore, true); // Sucesso ao completar todos os pares
          }
        } else {
          // No match - penalidade: perder pontos
          setMemoryCards((prev) =>
            prev.map((card, index) =>
              newFlipped.includes(index) ? { ...card, flipped: false } : card
            )
          );
          // Perder pontos por erro
          setScore((prev) => Math.max(0, prev - 5));
        }
        setFlippedCards([]);
      }, 800); // Reduzido de 1000 para 800ms - menos tempo para ver
    }
  };

  const handleWordClick = (id: number) => {
    if (!gameActive) return;

    // Verificar condições antes de prosseguir
    const word = wordPairs.find((w) => w.id === id);
    if (!word || word.matched || word.selected) return;
    if (selectedWords.length >= 2) return;

    const newSelected = [...selectedWords, id];

    // Marcar como selecionado
    setWordPairs((prev) =>
      prev.map((w) => (w.id === id ? { ...w, selected: true } : w))
    );

    setSelectedWords(newSelected);

    // Se agora temos 2 palavras selecionadas, verificar match
    if (newSelected.length === 2) {
      setTimeout(() => {
        setWordPairs((current) => {
          const first = current.find((w) => w.id === newSelected[0]);
          const second = current.find((w) => w.id === newSelected[1]);

          if (first && second && first.pairId === second.pairId) {
            // Match! Par encontrado
            const points = powerUp === "double-points" ? 20 : 10;
            const updated = current.map((word) =>
              newSelected.includes(word.id)
                ? { ...word, matched: true, selected: false }
                : { ...word, selected: false }
            );

            // Verificar se todos os pares foram encontrados
            const allMatched = updated.every((w) => w.matched);
            if (allMatched) {
              setTimeout(() => {
                setGameActive(false);
                setScore((prevScore) => {
                  const finalScore = prevScore + points;
                  const isNewRecord = saveScore(type as GameType, finalScore);
                  setNewRecord(isNewRecord);
                  setShowConfetti(true);
                  onComplete(finalScore, true);
                  return finalScore;
                });
              }, 300);
            } else {
              setScore((prev) => prev + points);
            }

            setSelectedWords([]);
            return updated;
          } else {
            // Não é match - desmarcar
            const updated = current.map((word) =>
              newSelected.includes(word.id)
                ? { ...word, selected: false }
                : word
            );
            setScore((prev) => Math.max(0, prev - 5));
            setSelectedWords([]);
            return updated;
          }
        });
      }, 800);
    }
  };

  const handleReactionClick = () => {
    if (!reactionTarget || !reactionStartTime) return;

    const reactionTime = Date.now() - reactionStartTime;
    const points =
      powerUp === "double-points"
        ? Math.max(1, Math.floor(1000 / reactionTime) * 2)
        : Math.max(1, Math.floor(1000 / reactionTime));

    setScore(score + points);
    setReactionTarget(null);
    setReactionStartTime(null);

    // Gerar próximo alvo após um delay
    setTimeout(() => {
      if (gameActive) {
        setReactionTarget({
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 10,
          appeared: false,
        });
        setReactionStartTime(Date.now());
      }
    }, 500);
  };

  const handlePuzzleClick = (index: number) => {
    if (selectedPuzzle === null) {
      setSelectedPuzzle(index);
    } else {
      // Trocar peças
      const newPieces = [...puzzlePieces];
      [newPieces[selectedPuzzle], newPieces[index]] = [
        newPieces[index],
        newPieces[selectedPuzzle],
      ];
      setPuzzlePieces(newPieces);
      setSelectedPuzzle(null);

      // Verificar se está resolvido
      const isSolved = newPieces.every((val, idx) => val === idx + 1);
      const points = powerUp === "double-points" ? 2 : 1;
      const newScore = score + points;
      setScore(newScore);

      if (isSolved) {
        setGameActive(false);
        const finalScore = newScore + 50; // Bônus por completar
        const isNewRecord = saveScore(type as GameType, finalScore);
        setNewRecord(isNewRecord);
        setShowConfetti(true);
        onComplete(finalScore, true); // Sucesso ao resolver puzzle
      }
    }
  };

  const activatePowerUp = (powerType: PowerUpType) => {
    if (powerType === "extra-time") {
      setTimeLeft((prev) => prev + 15);
    }
    setPowerUp(powerType);
    setPowerUpTimeLeft(10);
  };

  const renderGame = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-retro-blue animate-spin" />
        </div>
      );
    }

    switch (type) {
      case "heart-click":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="pixel-font text-retro-blue">
                PONTOS: {score} {bestScore > 0 && `| MELHOR: ${bestScore}`}
              </div>
              <div className="pixel-font text-pixel-pink">
                TEMPO: {timeLeft}s
              </div>
            </div>
            {powerUp && (
              <div className="bg-xp-yellow/20 border border-xp-yellow rounded p-2 text-center">
                <span className="pixel-font text-xs text-xp-yellow">
                  {powerUp === "double-points" && "⚡ PONTOS DUPLOS!"}
                  {powerUp === "extra-time" && "⏰ TEMPO EXTRA!"}
                  {powerUpTimeLeft > 0 && ` (${powerUpTimeLeft}s)`}
                </span>
              </div>
            )}
            <div className="relative h-96 bg-background/50 rounded-lg border border-retro-blue/30 overflow-hidden">
              {hearts.map((heart) => {
                if (heart.clicked) return null;
                const age = Date.now() - heart.id;
                const opacity = Math.max(0.3, 1 - age / 2000); // Desaparece em 2s
                return (
                  <button
                    key={heart.id}
                    onClick={() => handleHeartClick(heart.id)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125"
                    style={{
                      left: `${heart.x}%`,
                      top: `${heart.y}%`,
                      opacity: opacity,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Heart className="w-6 h-6 fill-pixel-pink text-pixel-pink animate-pulse" />
                  </button>
                );
              })}
              {!gameActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                  <div className="text-center space-y-4">
                    <Trophy className="w-16 h-16 text-xp-yellow mx-auto" />
                    <p className="pixel-font text-2xl text-retro-blue">
                      PONTUAÇÃO FINAL: {score}
                    </p>
                    {newRecord && (
                      <p className="pixel-font text-lg text-pixel-pink">
                        🎉 NOVO RECORDE! 🎉
                      </p>
                    )}
                    <p className="text-white/80">
                      Você coletou {score} corações! 💕
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-white/70 text-center">
              Clique nos corações que aparecem para ganhar pontos!
            </p>
          </div>
        );

      case "memory":
        return (
          <div className="space-y-4">
            <div className="pixel-font text-retro-blue text-center">
              PONTOS: {score} {bestScore > 0 && `| MELHOR: ${bestScore}`}
            </div>
            {powerUp && (
              <div className="bg-xp-yellow/20 border border-xp-yellow rounded p-2 text-center">
                <span className="pixel-font text-xs text-xp-yellow">
                  ⚡ PONTOS DUPLOS! ({powerUpTimeLeft}s)
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {memoryCards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleMemoryCardClick(index)}
                  disabled={
                    card.matched || (!card.flipped && flippedCards.length === 2)
                  }
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                    card.matched
                      ? "bg-xp-yellow/50 border-xp-yellow"
                      : card.flipped
                      ? "bg-retro-blue/50 border-retro-blue"
                      : "bg-background/50 border-retro-blue/30 hover:border-retro-blue"
                  }`}
                >
                  {card.flipped || card.matched ? card.emoji : "?"}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/50 text-center">
              ⚠️ Erros custam 5 pontos!
            </p>
            {memoryCards.every((c) => c.matched) && (
              <div className="text-center space-y-4 pt-4">
                <Trophy className="w-12 h-12 text-xp-yellow mx-auto" />
                <p className="pixel-font text-xl text-retro-blue">
                  PARABÉNS! VOCÊ COMPLETOU!
                </p>
                {newRecord && (
                  <p className="pixel-font text-lg text-pixel-pink">
                    🎉 NOVO RECORDE! 🎉
                  </p>
                )}
              </div>
            )}
            <p className="text-sm text-white/70 text-center">
              Encontre os pares de emojis iguais!
            </p>
          </div>
        );

      case "reaction":
        return (
          <div className="space-y-6">
            <div className="pixel-font text-retro-blue text-center">
              PONTOS: {score} {bestScore > 0 && `| MELHOR: ${bestScore}`}
            </div>
            {powerUp && (
              <div className="bg-xp-yellow/20 border border-xp-yellow rounded p-2 text-center">
                <span className="pixel-font text-xs text-xp-yellow">
                  ⚡ PONTOS DUPLOS! ({powerUpTimeLeft}s)
                </span>
              </div>
            )}
            <div className="relative h-96 bg-background/50 rounded-lg border border-retro-blue/30 overflow-hidden">
              {reactionTarget && (
                <button
                  onClick={handleReactionClick}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-pixel-pink rounded-full border-4 border-white animate-pulse hover:scale-110 transition-transform"
                  style={{
                    left: `${reactionTarget.x}%`,
                    top: `${reactionTarget.y}%`,
                  }}
                >
                  <span className="text-white font-bold">!</span>
                </button>
              )}
              {!gameActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                  <div className="text-center space-y-4">
                    <Trophy className="w-16 h-16 text-xp-yellow mx-auto" />
                    <p className="pixel-font text-2xl text-retro-blue">
                      PONTUAÇÃO FINAL: {score}
                    </p>
                    {newRecord && (
                      <p className="pixel-font text-lg text-pixel-pink">
                        🎉 NOVO RECORDE! 🎉
                      </p>
                    )}
                    <Button
                      onClick={() => {
                        setGameActive(true);
                        setScore(0);
                        setReactionTarget(null);
                        setReactionStartTime(null);
                      }}
                    >
                      Jogar Novamente
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-white/70 text-center">
              Clique no círculo rosa assim que aparecer! Quanto mais rápido,
              mais pontos!
            </p>
            <Button
              onClick={() => {
                setGameActive(false);
                const isNewRecord = saveScore(type as GameType, score);
                setNewRecord(isNewRecord);
                // Sucesso se conseguiu pelo menos alguns pontos (aumentado)
                const success = score > 20; // Era 10, agora 20
                if (success) setShowConfetti(true);
                onComplete(score, success);
              }}
              variant="outline"
              className="w-full"
            >
              Finalizar Jogo
            </Button>
            <p className="text-xs text-white/50 text-center">
              ⚠️ Alvos desaparecem em 1.5s! Mínimo 20 pontos para sucesso.
            </p>
          </div>
        );

      case "word-match":
        return (
          <div className="space-y-6">
            <div className="pixel-font text-retro-blue text-center">
              PONTOS: {score} {bestScore > 0 && `| MELHOR: ${bestScore}`}
            </div>
            {powerUp && (
              <div className="bg-xp-yellow/20 border border-xp-yellow rounded p-2 text-center">
                <span className="pixel-font text-xs text-xp-yellow">
                  ⚡ PONTOS DUPLOS! ({powerUpTimeLeft}s)
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {wordPairs.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleWordClick(word.id)}
                  disabled={!gameActive || word.matched || word.selected}
                  className={`p-4 rounded-lg border-2 transition-all font-sans text-sm md:text-base ${
                    word.matched
                      ? "bg-xp-yellow/50 border-xp-yellow text-white"
                      : word.selected
                      ? "bg-retro-blue/50 border-retro-blue text-white scale-105"
                      : "bg-background/50 border-retro-blue/30 hover:border-retro-blue text-white/80 hover:text-white"
                  }`}
                >
                  {word.word}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/50 text-center">
              ⚠️ Erros custam 5 pontos!
            </p>
            {wordPairs.every((w) => w.matched) && (
              <div className="text-center space-y-4 pt-4">
                <Trophy className="w-12 h-12 text-xp-yellow mx-auto" />
                <p className="pixel-font text-xl text-retro-blue">
                  TODOS OS PARES ENCONTRADOS!
                </p>
                {newRecord && (
                  <p className="pixel-font text-lg text-pixel-pink">
                    🎉 NOVO RECORDE! 🎉
                  </p>
                )}
              </div>
            )}
            <p className="text-sm text-white/70 text-center">
              Encontre os pares de palavras relacionadas ao amor!
            </p>
          </div>
        );

      case "puzzle":
        return (
          <div className="space-y-6">
            <div className="pixel-font text-retro-blue text-center">
              PONTOS: {score} {bestScore > 0 && `| MELHOR: ${bestScore}`}
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {puzzlePieces.map((piece, index) => (
                <button
                  key={index}
                  onClick={() => handlePuzzleClick(index)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                    selectedPuzzle === index
                      ? "bg-pixel-pink/50 border-pixel-pink scale-110"
                      : piece === index + 1
                      ? "bg-xp-yellow/50 border-xp-yellow"
                      : "bg-background/50 border-retro-blue/30 hover:border-retro-blue"
                  }`}
                >
                  {piece}
                </button>
              ))}
            </div>
            <p className="text-sm text-white/70 text-center">
              Clique em duas peças para trocá-las. Ordene de 1 a 9!
            </p>
            {!gameActive && (
              <div className="text-center space-y-4 pt-4">
                <Trophy className="w-12 h-12 text-xp-yellow mx-auto" />
                <p className="pixel-font text-xl text-retro-blue">
                  PUZZLE RESOLVIDO!
                </p>
                {newRecord && (
                  <p className="pixel-font text-lg text-pixel-pink">
                    🎉 NOVO RECORDE! 🎉
                  </p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Confetti
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <DialogContent onClose={onClose} showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className="text-pixel-pink text-center">
            {type === "heart-click" && "💕 CLIQUE NOS CORAÇÕES"}
            {type === "memory" && "🧠 JOGO DA MEMÓRIA"}
            {type === "reaction" && "⚡ JOGO DE REAÇÃO"}
            {type === "word-match" && "💝 MATCH DE PALAVRAS"}
            {type === "puzzle" && "🧩 PUZZLE NUMÉRICO"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">{renderGame()}</div>
      </DialogContent>
    </>
  );
}
