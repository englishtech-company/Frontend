import { api } from "@/lib/api";

export type InboxNotification = {
  id: string;
  kind: string;
  title: string;
  message: string;
  lead_id?: number | null;
  lead_name?: string | null;
  link_tag?: string | null;
  read_at?: string | null;
  created_at?: string | null;
};

export type NotificationInbox = {
  unread_count: number;
  notifications: InboxNotification[];
};

type NotificationInboxResponse = NotificationInbox & {
  action: string;
  status: number;
  msg: string;
};

export async function listNotifications(): Promise<NotificationInbox> {
  const response = await api<NotificationInboxResponse>("/notifications");

  return {
    unread_count: response.unread_count ?? 0,
    notifications: response.notifications ?? [],
  };
}

export async function markNotificationRead(id: string): Promise<void> {
  await api(`/notifications/${id}/read`, {
    method: "POST",
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await api("/notifications/read-all", {
    method: "POST",
  });
}
