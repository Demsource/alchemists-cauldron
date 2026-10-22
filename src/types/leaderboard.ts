export interface ILeaderboardEntry {
  name: string;
  score: number;
  timestamp: number; // Date.now() when the result was saved
}
