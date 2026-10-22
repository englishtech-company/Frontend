<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { formatLinkTagLabel } from "@/lib/linkTag";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type InboxNotification,
} from "@/lib/notifications";

const POLL_MS = 30000;

const router = useRouter();
const notifications = ref<InboxNotification[]>([]);
const unreadCount = ref(0);
const loading = ref(false);
const markingAll = ref(false);
let pollTimer: ReturnType<typeof setInterval> | null = null;

const hasUnread = computed(() => unreadCount.value > 0);

function formatRelativeTime(iso?: string | null): string {
  if (!iso) {
    return "";
  }

  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));

  if (minutes < 1) {
    return "Agora";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} h`;
  }

  return `${Math.floor(hours / 24)} d`;
}

function leadDisplayName(notification: InboxNotification): string {
  const name = notification.lead_name?.trim();

  if (name) {
    return name;
  }

  const fromMessage = notification.message.split(":").pop()?.trim();

  return fromMessage || "Novo interessado";
}

function leadOriginLabel(notification: InboxNotification): string | null {
  const label = formatLinkTagLabel(notification.link_tag);

  return label || null;
}

function leadSubtitle(): string {
  return "Cadastro pelo formulário público";
}

function closeDropdown() {
  const root = document.querySelector(".notification-bell-dropdown");

  if (!root) {
    return;
  }

  root.classList.remove("show");
  root
    .querySelector(".dropdown-menu")
    ?.classList.remove("show");
  const toggle = root.querySelector<HTMLElement>('[data-bs-toggle="dropdown"]');

  toggle?.setAttribute("aria-expanded", "false");
}

async function loadInbox() {
  loading.value = true;

  try {
    const inbox = await listNotifications();
    notifications.value = inbox.notifications;
    unreadCount.value = inbox.unread_count;
  } catch {
    // O sino não deve quebrar o restante do header se a API falhar.
  } finally {
    loading.value = false;
  }
}

async function openNotification(notification: InboxNotification) {
  if (!notification.read_at) {
    try {
      await markNotificationRead(notification.id);
      notification.read_at = new Date().toISOString();
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch {
      // Segue para o interessado mesmo se a leitura falhar.
    }
  }

  closeDropdown();

  if (notification.lead_id) {
    await router.push(`/leads/${notification.lead_id}`);
    return;
  }

  await router.push("/leads");
}

async function markAllRead() {
  if (!hasUnread.value || markingAll.value) {
    return;
  }

  markingAll.value = true;

  try {
    await markAllNotificationsRead();
    unreadCount.value = 0;
    notifications.value = notifications.value.map((item) => ({
      ...item,
      read_at: item.read_at ?? new Date().toISOString(),
    }));
  } finally {
    markingAll.value = false;
  }
}

onMounted(() => {
  loadInbox();
  pollTimer = window.setInterval(loadInbox, POLL_MS);
});

onBeforeUnmount(() => {
  if (pollTimer) {
    window.clearInterval(pollTimer);
  }
});
</script>

<template>
  <li class="nav-item dropdown notification_dropdown notification-bell-dropdown">
    <a
      class="nav-link bell ai-icon"
      href="javascript:void(0);"
      role="button"
      data-bs-toggle="dropdown"
      aria-label="Notificações"
      title="Notificações"
      @click="loadInbox"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-bell"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span
        v-if="hasUnread"
        class="notification-bell__badge"
        aria-hidden="true"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </a>

    <div class="dropdown-menu dropdown-menu-end notification-bell__panel">
      <header class="notification-bell__panel-header">
        <div>
          <p class="notification-bell__panel-kicker">EnglishTech</p>
          <h6 class="notification-bell__panel-title">Notificações</h6>
        </div>
        <span
          v-if="hasUnread"
          class="notification-bell__count-pill"
        >
          {{ unreadCount }} nova{{ unreadCount === 1 ? "" : "s" }}
        </span>
      </header>

      <div class="notification-bell__list-wrap">
        <div
          v-if="loading && notifications.length === 0"
          class="notification-bell__empty"
        >
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          <span>Carregando...</span>
        </div>

        <div
          v-else-if="notifications.length === 0"
          class="notification-bell__empty"
        >
          <i class="la la-bell notification-bell__empty-icon" aria-hidden="true"></i>
          <span>Nenhuma notificação por aqui</span>
        </div>

        <ul
          v-else
          class="notification-bell__list list-unstyled mb-0"
        >
          <li
            v-for="notification in notifications"
            :key="notification.id"
          >
            <button
              type="button"
              class="notification-bell__card"
              :class="{
                'notification-bell__card--unread': !notification.read_at,
              }"
              @click="openNotification(notification)"
            >
              <span
                class="notification-bell__card-icon"
                aria-hidden="true"
              >
                <i class="la la-user-plus"></i>
              </span>

              <span class="notification-bell__card-body">
                <span class="notification-bell__card-top">
                  <span class="notification-bell__card-title">
                    {{ leadDisplayName(notification) }}
                  </span>
                  <span class="notification-bell__card-time">
                    {{ formatRelativeTime(notification.created_at) }}
                  </span>
                </span>

                <span class="notification-bell__card-subtitle">
                  {{ leadSubtitle() }}
                </span>

                <span
                  v-if="leadOriginLabel(notification)"
                  class="notification-bell__card-tag"
                >
                  {{ leadOriginLabel(notification) }}
                </span>

                <span class="notification-bell__card-action">
                  Ver interessado
                  <i class="la la-arrow-right" aria-hidden="true"></i>
                </span>
              </span>
            </button>
          </li>
        </ul>
      </div>

      <footer
        v-if="hasUnread"
        class="notification-bell__panel-footer"
      >
        <button
          type="button"
          class="notification-bell__mark-all"
          :disabled="markingAll"
          @click="markAllRead"
        >
          {{ markingAll ? "Marcando..." : "Marcar todas como lidas" }}
        </button>
      </footer>
    </div>
  </li>
</template>

<style scoped>
.notification-bell__badge {
  position: absolute;
  top: 0.15rem;
  right: 0;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: var(--primary, #600024);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.1rem;
  text-align: center;
}

.notification-bell__panel {
  width: min(22rem, calc(100vw - 1.5rem));
  padding: 0;
  margin-top: 0.65rem;
  border: 1px solid #ece8ea;
  border-radius: 0.85rem;
  overflow: hidden;
  box-shadow: 0 1rem 2.5rem rgba(96, 0, 36, 0.14);
}

.notification-bell__panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1rem 0.85rem;
  background: linear-gradient(
    135deg,
    rgba(96, 0, 36, 0.08) 0%,
    rgba(96, 0, 36, 0.02) 100%
  );
  border-bottom: 1px solid #f0e8ec;
}

.notification-bell__panel-kicker {
  margin: 0 0 0.15rem;
  color: var(--primary, #600024);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.notification-bell__panel-title {
  margin: 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 700;
}

.notification-bell__count-pill {
  flex-shrink: 0;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: var(--primary, #600024);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
}

.notification-bell__list-wrap {
  max-height: 22rem;
  overflow-y: auto;
}

.notification-bell__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
}

.notification-bell__empty-icon {
  font-size: 1.5rem;
  color: #c4a8b4;
}

.notification-bell__list {
  padding: 0.5rem;
}

.notification-bell__card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 0.45rem;
  padding: 0.75rem;
  border: 1px solid transparent;
  border-radius: 0.7rem;
  background: #fff;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.notification-bell__card:last-child {
  margin-bottom: 0;
}

.notification-bell__card:hover {
  background: #fdf8fa;
  border-color: #ecdce4;
}

.notification-bell__card--unread {
  background: #fff9fb;
  border-color: #f3dce6;
  box-shadow: inset 3px 0 0 var(--primary, #600024);
}

.notification-bell__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.65rem;
  background: color-mix(in srgb, var(--primary, #600024) 12%, #fff);
  color: var(--primary, #600024);
  font-size: 1.15rem;
}

.notification-bell__card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
}

.notification-bell__card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
}

.notification-bell__card-title {
  color: #111827;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.3;
  word-break: break-word;
}

.notification-bell__card--unread .notification-bell__card-title {
  color: var(--primary, #600024);
}

.notification-bell__card-time {
  flex-shrink: 0;
  color: #9ca3af;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.notification-bell__card-subtitle {
  color: #6b7280;
  font-size: 0.8rem;
  line-height: 1.35;
}

.notification-bell__card-tag {
  display: inline-flex;
  margin-top: 0.1rem;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: #f3e8ee;
  color: var(--primary, #600024);
  font-size: 0.72rem;
  font-weight: 600;
}

.notification-bell__card-action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.15rem;
  color: var(--primary, #600024);
  font-size: 0.78rem;
  font-weight: 600;
}

.notification-bell__panel-footer {
  padding: 0.65rem 0.75rem 0.75rem;
  border-top: 1px solid #f0e8ec;
  background: #fafafa;
}

.notification-bell__mark-all {
  width: 100%;
  padding: 0.45rem 0.75rem;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--primary, #600024);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.notification-bell__mark-all:hover:not(:disabled) {
  background: #f8eef2;
}

.notification-bell__mark-all:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
