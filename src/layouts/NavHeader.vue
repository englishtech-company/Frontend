<template>
  <div class="nav-header">
    <RouterLink to="/" class="brand-logo">
      <img
        :src="logoSrc"
        :class="showIcon ? 'logo-icon' : 'logo-full'"
        alt="EnglishTech"
        :width="showIcon ? 48 : 280"
        :height="showIcon ? 48 : 70"
      />
    </RouterLink>
    <div class="nav-control">
      <div
        :class="`hamburger ${naveHeader ? 'is-active' : ''}`"
        @click="naveHeader = !naveHeader"
      >
        <span class="line"></span><span class="line"></span><span class="line"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "nav_",
  components: { RouterLink },
  setup() {
    const store = useStore();
    const { naveHeader } = storeToRefs(store);
    const isMobile = ref(false);
    const isDark = ref(false);

    const updateMobile = () => {
      isMobile.value = window.innerWidth <= 767;
    };

    const updateTheme = () => {
      isDark.value =
        document.body.getAttribute("data-theme-version") === "dark";
    };

    let observer: MutationObserver | null = null;

    onMounted(() => {
      updateMobile();
      updateTheme();
      window.addEventListener("resize", updateMobile);

      observer = new MutationObserver(updateTheme);
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-theme-version"],
      });
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateMobile);
      observer?.disconnect();
    });

    const showIcon = computed(() => naveHeader.value || isMobile.value);

    // Light (fundo vinho): logo/ícone branco
    // Dark (fundo lilás): logo/ícone dark
    const logoSrc = computed(() => {
      if (showIcon.value) {
        return isDark.value
          ? "/utils/iconedark.png"
          : "/utils/iconewhite.png";
      }

      return isDark.value
        ? "/utils/logodark.png"
        : "/utils/logowhite.png";
    });

    return { naveHeader, showIcon, logoSrc };
  },
});
</script>

<style scoped>
.brand-logo {
  gap: 0;
  padding-inline: 0.5rem;
}

.logo-full {
  display: block;
  width: auto;
  max-width: 14.5rem;
  height: auto;
  max-height: 3.4rem;
  object-fit: contain;
}

.logo-icon {
  display: block;
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
}
</style>
