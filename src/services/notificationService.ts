import { NotificationItem } from '../types/notification';

const NETWORK_DELAY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS));
}

let notifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'allocation',
    title: 'Room allocated — Room 204, Floor 2 🎉',
    description: 'Hostel A assigned your group',
    relativeTime: '30m',
    read: false,
  },
  {
    id: 'n2',
    type: 'match',
    title: 'You matched with Ama Mensah',
    description: '96% compatible · 4-in-a-room, Hostel A',
    relativeTime: '3h',
    read: false,
  },
  {
    id: 'n3',
    type: 'group',
    title: 'Efua joined your group',
    description: '3 of 3 — ready to submit',
    relativeTime: '1d',
    read: true,
  },
  {
    id: 'n4',
    type: 'message',
    title: 'Ama sent you a message',
    description: 'Hey! Excited to be roommates 🎉',
    relativeTime: '2d',
    read: true,
  },
  {
    id: 'n5',
    type: 'announcement',
    title: 'Hostel A announcement',
    description: 'Allocation starts this Friday',
    relativeTime: '3d',
    read: true,
  },
];

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay([...notifications]);
}

export async function markAllNotificationsRead(): Promise<void> {
  notifications = notifications.map((item) => ({ ...item, read: true }));
  await delay(undefined);
}
