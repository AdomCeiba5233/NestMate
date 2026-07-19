export type RoommateMemberStatus = 'matched' | 'friend';

export interface RoommateCandidate {
  id: string;
  name: string;
  matchPercent: number;
  program: string;
  level: string;
  traits: string[];
  avatarUri?: string;
}

export interface RoommateGroupMember {
  id: string;
  name: string;
  status: RoommateMemberStatus;
  matchPercent?: number;
  friendCode?: string;
  avatarUri?: string;
}

export type AllocationStatus = 'pending' | 'assigned';

export interface AllocationResult {
  status: AllocationStatus;
  roomNumber?: string;
  floor?: string;
  academicYear?: string;
}
