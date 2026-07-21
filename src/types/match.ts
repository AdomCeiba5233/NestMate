export interface MatchProfile {
  id: string;
  name: string;
  level: string;
  program: string;
  matchPercent: number;
  tags: string[];
  avatarUri?: string;
}
