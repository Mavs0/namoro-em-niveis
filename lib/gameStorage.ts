// Sistema de armazenamento local para leaderboard e progresso

export type GameType =
  | "heart-click"
  | "memory"
  | "word-match"
  | "reaction"
  | "puzzle";

export interface LeaderboardEntry {
  gameType: GameType;
  score: number;
  date: string;
}

const STORAGE_KEY = "namoro-em-niveis-leaderboard";

export function saveScore(gameType: GameType, score: number) {
  const entries = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    gameType,
    score,
    date: new Date().toISOString(),
  };

  // Verificar se já existe uma pontuação melhor
  const existingIndex = entries.findIndex((e) => e.gameType === gameType);

  if (existingIndex === -1 || entries[existingIndex].score < score) {
    // Nova entrada ou pontuação melhor
    if (existingIndex !== -1) {
      entries[existingIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    // Salvar no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true; // Nova melhor pontuação
  }

  return false; // Não bateu o recorde
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getBestScore(gameType: GameType): number {
  const entries = getLeaderboard();
  const entry = entries.find((e) => e.gameType === gameType);
  return entry?.score || 0;
}

// Sistema de progresso de níveis
const PROGRESS_KEY = "namoro-em-niveis-progress";

export interface LevelProgress {
  level: number;
  completedGames: GameType[];
  unlocked: boolean;
}

export function getLevelProgress(): LevelProgress[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(PROGRESS_KEY);
  if (!stored) {
    // Inicializar: apenas nível 1 desbloqueado
    const initial: LevelProgress[] = [
      { level: 1, completedGames: [], unlocked: true },
      { level: 2, completedGames: [], unlocked: false },
      { level: 3, completedGames: [], unlocked: false },
      { level: 4, completedGames: [], unlocked: false },
    ];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function completeGame(level: number, gameType: GameType): boolean {
  const progress = getLevelProgress();
  const levelIndex = progress.findIndex((p) => p.level === level);

  if (levelIndex === -1) return false;

  const levelProgress = progress[levelIndex];

  // Adicionar jogo completado se ainda não estiver
  if (!levelProgress.completedGames.includes(gameType)) {
    levelProgress.completedGames.push(gameType);
  }

  // Verificar quais jogos são necessários para este nível
  const requiredGames = getRequiredGamesForLevel(level);
  const allGamesCompleted = requiredGames.every((game) =>
    levelProgress.completedGames.includes(game)
  );

  // Se todos os jogos foram completados, desbloquear próximo nível
  if (allGamesCompleted) {
    if (level < 3) {
      // Desbloquear próximo nível normal
      const nextLevelIndex = progress.findIndex((p) => p.level === level + 1);
      if (nextLevelIndex !== -1) {
        progress[nextLevelIndex].unlocked = true;
      }
    } else if (level === 3) {
      // Se completou nível 3, desbloquear nível 4 (boss)
      const bossLevelIndex = progress.findIndex((p) => p.level === 4);
      if (bossLevelIndex !== -1) {
        progress[bossLevelIndex].unlocked = true;
      }
    }
  }

  // Salvar o array completo de progresso, não apenas um nível
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return allGamesCompleted;
}

export function getRequiredGamesForLevel(level: number): GameType[] {
  switch (level) {
    case 1:
      return ["heart-click", "word-match"];
    case 2:
      return ["memory", "puzzle"];
    case 3:
      return ["reaction"];
    case 4:
      return []; // Boss não precisa de jogos
    default:
      return [];
  }
}

export function isLevelUnlocked(level: number): boolean {
  if (level === 1) return true; // Sempre desbloqueado
  if (level === 5) return false; // Sempre bloqueado

  const progress = getLevelProgress();
  const levelProgress = progress.find((p) => p.level === level);
  return levelProgress?.unlocked || false;
}

export function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(HEARTS_KEY);
  localStorage.removeItem(XP_KEY);
}

// Sistema de vidas
const HEARTS_KEY = "namoro-em-niveis-hearts";
const MAX_HEARTS = 5;
const INITIAL_HEARTS = 5;

export function getHearts(): number {
  if (typeof window === "undefined") return INITIAL_HEARTS;

  const stored = localStorage.getItem(HEARTS_KEY);
  if (!stored) {
    localStorage.setItem(HEARTS_KEY, INITIAL_HEARTS.toString());
    return INITIAL_HEARTS;
  }

  try {
    return parseInt(stored, 10);
  } catch {
    return INITIAL_HEARTS;
  }
}

export function updateHearts(change: number): number {
  const current = getHearts();
  const newHearts = Math.max(0, Math.min(MAX_HEARTS, current + change));
  localStorage.setItem(HEARTS_KEY, newHearts.toString());
  return newHearts;
}

export function setHearts(hearts: number): void {
  const clamped = Math.max(0, Math.min(MAX_HEARTS, hearts));
  localStorage.setItem(HEARTS_KEY, clamped.toString());
}

// Sistema de XP
const XP_KEY = "namoro-em-niveis-xp";
const MAX_XP = 100;

export function getXP(): number {
  if (typeof window === "undefined") return 0;

  const stored = localStorage.getItem(XP_KEY);
  if (!stored) {
    localStorage.setItem(XP_KEY, "0");
    return 0;
  }

  try {
    return parseInt(stored, 10);
  } catch {
    return 0;
  }
}

export function updateXP(change: number): number {
  const current = getXP();
  const newXP = Math.max(0, Math.min(MAX_XP, current + change));
  localStorage.setItem(XP_KEY, newXP.toString());
  return newXP;
}

export function setXP(xp: number): void {
  const clamped = Math.max(0, Math.min(MAX_XP, xp));
  localStorage.setItem(XP_KEY, clamped.toString());
}
