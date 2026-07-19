export type NotificationType = 'allocation' | 'match' | 'group' | 'message' | 'announcement';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  relativeTime: string;
  read: boolean;
}
