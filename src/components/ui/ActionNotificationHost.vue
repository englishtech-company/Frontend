<script lang="ts" setup>
import {
  type ActionNotificationType,
  useActionNotifications,
} from "@/lib/actionNotification";

const { notifications, remove } = useActionNotifications();

const iconByType: Record<ActionNotificationType, string> = {
  success: "fa-check-circle",
  error: "fa-times-circle",
  warning: "fa-exclamation-circle",
  info: "fa-info-circle",
};
</script>

<template>
  <Teleport to="body">
    <div
      class="action-notification-host"
      aria-live="polite"
      aria-label="Notificações de ação"
    >
      <TransitionGroup name="action-notification">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="action-notification"
          :class="`action-notification--${item.type}`"
          role="alert"
        >
          <i
            class="fa action-notification__icon"
            :class="iconByType[item.type]"
            aria-hidden="true"
          ></i>

          <p class="action-notification__message">
            {{ item.message }}
          </p>

          <button
            type="button"
            class="action-notification__close"
            aria-label="Fechar notificação"
            @click="remove(item.id)"
          >
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.action-notification-host {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(360px, calc(100vw - 2rem));
  pointer-events: none;
}

.action-notification {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  color: #fff;
}

.action-notification__icon {
  flex-shrink: 0;
  font-size: 1rem;
  line-height: 1.35;
}

.action-notification__message {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.35;
}

.action-notification__close {
  flex-shrink: 0;
  border: 0;
  background: transparent;
  color: inherit;
  opacity: 0.85;
  padding: 0;
  line-height: 1;
  cursor: pointer;
}

.action-notification__close:hover {
  opacity: 1;
}

.action-notification--success {
  background: var(--primary, #600024);
  border-color: rgba(255, 255, 255, 0.12);
}

.action-notification--error {
  background: #dc3545;
  border-color: rgba(255, 255, 255, 0.12);
}

.action-notification--warning {
  background: #f59e0b;
  border-color: rgba(255, 255, 255, 0.12);
  color: #111827;
}

.action-notification--warning .action-notification__close {
  color: #111827;
}

.action-notification--info {
  background: #0ea5e9;
  border-color: rgba(255, 255, 255, 0.12);
}

.action-notification-enter-active,
.action-notification-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.action-notification-enter-from,
.action-notification-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}

.action-notification-move {
  transition: transform 0.2s ease;
}

@media (max-width: 575.98px) {
  .action-notification-host {
    top: 0.75rem;
    right: 0.75rem;
    width: calc(100vw - 1.5rem);
  }
}
</style>
