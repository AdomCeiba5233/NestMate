import { HousingStatus } from '../types/user';

const MOCK_NETWORK_DELAY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_NETWORK_DELAY_MS));
}

export async function fetchHousingStatus(): Promise<HousingStatus> {
  return delay({ hasRoom: false });
}
