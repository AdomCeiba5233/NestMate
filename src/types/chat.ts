export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOwnLastMessage?: boolean;
  avatarUri?: string;
}
