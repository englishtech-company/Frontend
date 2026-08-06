<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: number;
    ariaLabel?: string;
  }>(),
  {
    size: 100,
    ariaLabel: "Avatar do usuário",
  }
);
</script>

<template>
  <div
    class="profile-avatar"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="ariaLabel"
  >
    <i
      class="la la-user profile-avatar__icon"
      :style="{ fontSize: `${size * 0.42}px` }"
      aria-hidden="true"
    ></i>
  </div>
</template>

<style scoped>
.profile-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid rgba(255, 255, 255, 0.85);
  color: var(--primary);
}

.profile-avatar__icon {
  line-height: 1;
}
</style>
