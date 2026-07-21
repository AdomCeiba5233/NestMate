import { Conversation } from '../types/chat';

const MOCK_NETWORK_DELAY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_NETWORK_DELAY_MS));
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'ama-kusi',
    name: 'Ama Kusi',
    lastMessage: 'Have you seen the room at Eva…',
    timestamp: '2m',
    unreadCount: 2,
  },
  {
    id: 'efua-osei',
    name: 'Efua Osei',
    lastMessage: "Cool, let's split the deposit then",
    timestamp: '1h',
    unreadCount: 0,
  },
  {
    id: 'nana-adjei',
    name: 'Nana Adjei',
    lastMessage: 'sounds good, see you Thursday',
    timestamp: 'Tue',
    unreadCount: 0,
    isOwnLastMessage: true,
  },
];

export async function fetchConversations(): Promise<Conversation[]> {
  return delay([...MOCK_CONVERSATIONS]);
}
