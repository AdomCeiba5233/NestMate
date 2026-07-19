import { AllocationResult, RoommateCandidate, RoommateGroupMember } from '../types/roommate';
import { CURRENT_ACADEMIC_YEAR } from './hostelService';

const MOCK_NETWORK_DELAY_MS = 500;
const ALLOCATION_PROCESSING_MS = 4000;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_NETWORK_DELAY_MS));
}

function keyFor(hostelId: string, roomTypeId: string): string {
  return `${hostelId}:${roomTypeId}`;
}

interface GroupState {
  members: RoommateGroupMember[];
  candidateQueue: RoommateCandidate[];
}

const GENERIC_CANDIDATE_POOL: RoommateCandidate[] = [
  {
    id: 'cand-nana',
    name: 'Nana Yeboah',
    matchPercent: 88,
    program: 'Business Admin',
    level: 'Level 200',
    traits: ['Night Owl', 'Social', 'Pet Friendly'],
  },
  {
    id: 'cand-kojo',
    name: 'Kojo Antwi',
    matchPercent: 79,
    program: 'Mechanical Eng.',
    level: 'Level 300',
    traits: ['Quiet', 'Tidy'],
  },
  {
    id: 'cand-akosua',
    name: 'Akosua Boateng',
    matchPercent: 90,
    program: 'Nursing',
    level: 'Level 100',
    traits: ['Very Clean', 'Early Bird', 'Non-smoker'],
  },
  {
    id: 'cand-yaw',
    name: 'Yaw Darko',
    matchPercent: 82,
    program: 'Economics',
    level: 'Level 400',
    traits: ['Social', 'Guests OK'],
  },
];

function seedState(hostelId: string, roomTypeId: string): GroupState {
  if (hostelId === 'hostel-a' && roomTypeId === '4-in-a-room') {
    return {
      members: [
        { id: 'abena-gyasi', name: 'Abena Gyasi', status: 'matched', matchPercent: 93 },
        { id: 'efua-sarpong', name: 'Efua Sarpong', status: 'friend', friendCode: 'KB92' },
      ],
      candidateQueue: [
        {
          id: 'ama-mensah',
          name: 'Ama Mensah',
          matchPercent: 96,
          program: 'Computer Science',
          level: 'Level 300',
          traits: ['Very Clean', 'Early Bird', 'Non-smoker'],
        },
        ...GENERIC_CANDIDATE_POOL,
      ],
    };
  }

  return { members: [], candidateQueue: [...GENERIC_CANDIDATE_POOL] };
}

const groupStates = new Map<string, GroupState>();
const allocationRequestedAt = new Map<string, number>();

function getState(hostelId: string, roomTypeId: string): GroupState {
  const key = keyFor(hostelId, roomTypeId);
  if (!groupStates.has(key)) {
    groupStates.set(key, seedState(hostelId, roomTypeId));
  }
  return groupStates.get(key)!;
}

export async function fetchNextCandidate(
  hostelId: string,
  roomTypeId: string,
): Promise<RoommateCandidate | null> {
  const state = getState(hostelId, roomTypeId);
  return delay(state.candidateQueue[0] ?? null);
}

export async function respondToCandidate(
  hostelId: string,
  roomTypeId: string,
  candidateId: string,
  liked: boolean,
): Promise<{ success: boolean }> {
  const state = getState(hostelId, roomTypeId);
  const candidate = state.candidateQueue.find((item) => item.id === candidateId);
  state.candidateQueue = state.candidateQueue.filter((item) => item.id !== candidateId);

  if (liked && candidate) {
    state.members = [
      ...state.members,
      {
        id: candidate.id,
        name: candidate.name,
        status: 'matched',
        matchPercent: candidate.matchPercent,
      },
    ];
  }

  return delay({ success: true });
}

export async function fetchRoommateGroupMembers(
  hostelId: string,
  roomTypeId: string,
): Promise<RoommateGroupMember[]> {
  return delay([...getState(hostelId, roomTypeId).members]);
}

export async function submitGroupForAllocation(
  hostelId: string,
  roomTypeId: string,
): Promise<{ success: boolean }> {
  allocationRequestedAt.set(keyFor(hostelId, roomTypeId), Date.now());
  return delay({ success: true });
}

export async function fetchAllocationStatus(
  hostelId: string,
  roomTypeId: string,
): Promise<AllocationResult> {
  const requestedAt = allocationRequestedAt.get(keyFor(hostelId, roomTypeId));

  if (requestedAt && Date.now() - requestedAt >= ALLOCATION_PROCESSING_MS) {
    return delay({
      status: 'assigned',
      roomNumber: '204',
      floor: 'Floor 2',
      academicYear: CURRENT_ACADEMIC_YEAR,
    });
  }

  return delay({ status: 'pending' });
}
