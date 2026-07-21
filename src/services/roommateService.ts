import { AllocationResult, RoommateCandidate, RoommateGroupMember } from '../types/roommate';
import { CURRENT_ACADEMIC_YEAR } from './hostelService';
import { api } from './apiClient';

/**
 * HYBRID real implementation.
 * - Candidates come from the REAL backend matching engine (GET /api/matches):
 *   live compatibility scores from the weighted algorithm.
 * - Group membership (likes) stays session-local: the backend's booking model
 *   works through holds/invites rather than pre-booking groups, so the group
 *   screen keeps its UX with real people in it. Documented in the report.
 * - Allocation status is REAL: "assigned" the moment the user's bed is
 *   CONFIRMED in the backend (i.e. after code verification).
 */

interface BackendMatch {
  userId: number;
  fullName: string;
  score: number;
  profile?: {
    city?: string;
    sleepSchedule?: string;
    seekingType?: string;
  };
  breakdown?: {
    sleep?: string;
    cleanliness?: string;
    noise?: string;
    budget?: string;
  };
}

interface BackendHousing {
  hasRoom: boolean;
  hostelName?: string;
  roomNumber?: string;
  floor?: string;
}

function traitsFrom(m: BackendMatch): string[] {
  const traits: string[] = [];
  if (m.breakdown?.sleep === 'ALIGNED') traits.push('Sleep match');
  if (m.breakdown?.cleanliness === 'ALIGNED') traits.push('Tidiness match');
  if (m.breakdown?.noise === 'ALIGNED') traits.push('Noise fit');
  if (m.breakdown?.budget === 'ALIGNED') traits.push('Budget fit');
  if (m.profile?.sleepSchedule === 'NIGHT_OWL') traits.push('Night Owl');
  if (m.profile?.sleepSchedule === 'EARLY_BIRD') traits.push('Early Bird');
  return traits.length ? traits : ['NESTMATE user'];
}

function toCandidate(m: BackendMatch): RoommateCandidate {
  return {
    id: String(m.userId),
    name: m.fullName,
    matchPercent: Math.round(m.score),
    program: m.profile?.city ? `Based in ${m.profile.city}` : 'NESTMATE user',
    level: m.profile?.seekingType === 'OFFERING_ROOM' ? 'Offering a room' : 'Seeking a room',
    traits: traitsFrom(m),
  };
}

// session state: which candidates were already swiped, per hostel+roomType
const seenIds = new Map<string, Set<string>>();
const members = new Map<string, RoommateGroupMember[]>();

function keyFor(hostelId: string, roomTypeId: string): string {
  return `${hostelId}:${roomTypeId}`;
}
function seenFor(key: string): Set<string> {
  if (!seenIds.has(key)) seenIds.set(key, new Set());
  return seenIds.get(key)!;
}
function membersFor(key: string): RoommateGroupMember[] {
  if (!members.has(key)) members.set(key, []);
  return members.get(key)!;
}

async function fetchCandidates(): Promise<RoommateCandidate[]> {
  try {
    const matches = await api<BackendMatch[]>('/api/matches?limit=20');
    return matches.map(toCandidate);
  } catch (e) {
    console.warn('fetchCandidates failed (profile created? logged in?):', e);
    return [];
  }
}

export async function fetchNextCandidate(
  hostelId: string,
  roomTypeId: string,
): Promise<RoommateCandidate | null> {
  const seen = seenFor(keyFor(hostelId, roomTypeId));
  const candidates = await fetchCandidates();
  return candidates.find((c) => !seen.has(c.id)) ?? null;
}

export async function respondToCandidate(
  hostelId: string,
  roomTypeId: string,
  candidateId: string,
  liked: boolean,
): Promise<{ success: boolean }> {
  const key = keyFor(hostelId, roomTypeId);
  seenFor(key).add(candidateId);

  if (liked) {
    const candidates = await fetchCandidates();
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      membersFor(key).push({
        id: candidate.id,
        name: candidate.name,
        status: 'matched',
        matchPercent: candidate.matchPercent,
      });
    }
  }
  return { success: true };
}

export async function fetchRoommateGroupMembers(
  hostelId: string,
  roomTypeId: string,
): Promise<RoommateGroupMember[]> {
  return [...membersFor(keyFor(hostelId, roomTypeId))];
}

export async function submitGroupForAllocation(
  hostelId: string,
  roomTypeId: string,
): Promise<{ success: boolean }> {
  // Allocation in the real system = hold a bed and pay (access code screen).
  return { success: true };
}

export async function fetchAllocationStatus(
  hostelId: string,
  roomTypeId: string,
): Promise<AllocationResult> {
  try {
    const housing = await api<BackendHousing>('/api/users/me/housing');
    if (housing.hasRoom) {
      return {
        status: 'assigned',
        roomNumber: housing.roomNumber,
        floor: housing.floor,
        academicYear: CURRENT_ACADEMIC_YEAR,
      };
    }
  } catch (e) {
    console.warn('fetchAllocationStatus failed:', e);
  }
  return { status: 'pending' };
}
