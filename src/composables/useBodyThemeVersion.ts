import { onMounted, onUnmounted, ref } from "vue";

export function useBodyThemeVersion() {
  const isDark = ref(false);

  function sync() {
    isDark.value = document.body.getAttribute("data-theme-version") === "dark";
  }

  let observer: MutationObserver | null = null;

  onMounted(() => {
    sync();
    observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme-version"],
    });
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { isDark };
}
