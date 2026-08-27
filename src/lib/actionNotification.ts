import { ref } from "vue";

export type ActionNotificationType = "success" | "error" | "warning" | "info";

export type ActionNotificationItem = {
  id: number;
  type: ActionNotificationType;
  message: string;
};

const AUTO_CLOSE_MS = 5000;

const notifications = ref<ActionNotificationItem[]>([]);
const timers = new Map<number, ReturnType<typeof setTimeout>>();
let nextId = 1;

function remove(id: number) {
  const timer = timers.get(id);

  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }

  notifications.value = notifications.value.filter((item) => item.id !== id);
}

function show(message: string, type: ActionNotificationType = "success") {
  const trimmed = message.trim();

  if (!trimmed) {
    return;
  }

  const id = nextId++;
  notifications.value.push({ id, type, message: trimmed });

  const timer = setTimeout(() => remove(id), AUTO_CLOSE_MS);
  timers.set(id, timer);
}

export const notify = {
  success: (message: string) => show(message, "success"),
  error: (message: string) => show(message, "error"),
  warning: (message: string) => show(message, "warning"),
  info: (message: string) => show(message, "info"),
};

export function notifySaved(entityLabel: string, isEdit = false) {
  notify.success(
    isEdit
      ? `${entityLabel} atualizado com sucesso!`
      : `${entityLabel} criado com sucesso!`
  );
}

export function notifyRemoved(entityLabel: string) {
  notify.success(`${entityLabel} removido com sucesso!`);
}

export function useActionNotifications() {
  return {
    notifications,
    notify,
    remove,
  };
}
