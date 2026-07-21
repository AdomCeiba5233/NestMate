import { MatchProfile } from '../types/match';

const MOCK_NETWORK_DELAY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_NETWORK_DELAY_MS));
}

const MOCK_MATCHES: MatchProfile[] = [
  {
    id: 'ama-kusi',
    name: 'Ama Kusi',
    level: 'Level 300',
    program: 'Computer Science',
    matchPercent: 92,
    tags: ['Early bird', 'Very clean', 'Quiet', 'Non-smoker'],
  },
  {
    id: 'efua-osei',
    name: 'Efua Osei',
    level: 'Level 200',
    program: 'Business Admin',
    matchPercent: 87,
    tags: ['Night owl', 'Social', 'Organized'],
  },
  {
    id: 'nana-adjei',
    name: 'Nana Adjei',
    level: 'Level 300',
    program: 'Engineering',
    matchPercent: 81,
    tags: ['Flexible sleep', 'Tidy', 'Pet friendly'],
  },
];

export async function fetchMatches(): Promise<MatchProfile[]> {
  return delay([...MOCK_MATCHES]);
}
