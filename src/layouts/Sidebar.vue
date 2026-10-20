<!-- @format -->
<!--
  Sidebar.vue  (Phase 3 — schema-driven)

  Driven entirely by useFilteredMenu() which reads navigation.schema.ts.
  No hardcoded links remain here.

  Accordion expansion:
    - `expandedKey` tracks which group dropdown is open.
    - A watcher on `openGroupKey` (from useFilteredMenu) syncs it with the
      current route so that:
        • Navigating to /configuracoes opens the "administracao" group
        • Following /auditoria (redirect) also opens it
        • Landing on /enrollments/create expands "matriculas"
    - Clicking a group header manually toggles its accordion, allowing
      the user to collapse/re-open independently.
-->
<template>
  <div class="dlabnav" @mouseenter="iconHover = true" @mouseleave="iconHover = false">
    <div class="dlabnav-scroll">
      <ul class="metismenu" id="menu" role="menubar">
        <li class="nav-label first">Menu Principal</li>

        <template v-for="entry in menuEntries" :key="entry.kind === 'group' ? entry.key : entry.to">
          <!-- ── Group (dropdown) ────────────────────────────────────── -->
          <li
            v-if="entry.kind === 'group'"
            :class="['sidebar-group', { 'mm-active': expandedKey === entry.key }]"
            role="none"
          >
            <a
              :id="`sidebar-group-${entry.key}`"
              class="has-arrow sidebar-group__trigger"
              href="javascript:void(0);"
              role="button"
              :aria-expanded="expandedKey === entry.key"
              :aria-controls="`sidebar-children-${entry.key}`"
              @click.prevent="toggleGroup(entry.key)"
            >
              <i :class="entry.icon" aria-hidden="true"></i>
              {{ " " }}
              <span class="nav-text">{{ entry.label }}</span>
            </a>

            <ul
              :id="`sidebar-children-${entry.key}`"
              class="mm-collapse"
              :class="{ 'mm-show': expandedKey === entry.key }"
              role="menu"
              :aria-labelledby="`sidebar-group-${entry.key}`"
            >
              <li
                v-for="child in entry.children"
                :key="child.to"
                role="none"
              >
                <RouterLink
                  :to="child.to"
                  role="menuitem"
                  :aria-current="isChildActive(child.to) ? 'page' : undefined"
                  :class="{ active: isChildActive(child.to) }"
                >
                  {{ child.label }}
                </RouterLink>
              </li>
            </ul>
          </li>

          <!-- ── Direct item ────────────────────────────────────────── -->
          <li v-else role="none">
            <RouterLink
              :to="entry.to"
              aria-expanded="false"
              role="menuitem"
              :aria-current="isItemActive(entry.to) ? 'page' : undefined"
              :class="{
                active: isItemActive(entry.to),
              }"
            >
              <i :class="entry.icon" aria-hidden="true"></i>
              <span class="nav-text">{{ entry.label }}</span>
            </RouterLink>
          </li>
        </template>
      </ul>
    </div>

    <div class="copyright sidebar-copyright">
      <p>EnglishTech &copy; {{ currentYear }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/Store";
import { useFilteredMenu } from "@/layouts/useFilteredMenu";

// ── Store ──────────────────────────────────────────────────────────────────
const { iconHover } = storeToRefs(useStore());

// ── Menu ───────────────────────────────────────────────────────────────────
const { menuEntries, openGroupKey } = useFilteredMenu();

// ── Route ──────────────────────────────────────────────────────────────────
const route = useRoute();

// ── Accordion state ────────────────────────────────────────────────────────
/**
 * expandedKey: which group dropdown is currently open.
 * null = all collapsed.
 */
const expandedKey = ref<string | null>(null);

/**
 * Route watcher — syncs accordion with route.matched.
 * Runs immediately on mount and on every navigation.
 * Only auto-expands; never auto-collapses a manually opened group.
 */
watch(
  openGroupKey,
  (key) => {
    if (key !== null) {
      expandedKey.value = key;
    }
  },
  { immediate: true }
);

function toggleGroup(key: string) {
  expandedKey.value = expandedKey.value === key ? null : key;
}

// ── Active state helpers ───────────────────────────────────────────────────
function isItemActive(to: string): boolean {
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(to + "/");
}

function isChildActive(to: string): boolean {
  if (!to) return false;
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(to + "/");
}

// ── Misc ───────────────────────────────────────────────────────────────────
const currentYear = computed(() => new Date().getFullYear());
</script>

<style>
/* ── Layout ────────────────────────────────────────────────────────────────── */
.dlabnav {
  display: flex;
  flex-direction: column;
}

.dlabnav .dlabnav-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.dlabnav .sidebar-copyright {
  flex-shrink: 0;
  margin-top: auto;
  margin-bottom: 0;
  padding: 1rem 1rem 1.25rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: var(--sidebar-bg);
}

.dlabnav .sidebar-copyright p {
  margin: 0;
}

/* ── Accordion ─────────────────────────────────────────────────────────────── */
.mm-collapse {
  display: none;
  overflow: hidden;
  transition: height 0.25s ease;
}

.mm-collapse.mm-show {
  display: block;
}

.mm-show {
  transition: all 0.3s linear;
}

/* ── Active link ───────────────────────────────────────────────────────────── */
.metismenu .active {
  color: var(--primary) !important;
}

/* ── Group trigger ─────────────────────────────────────────────────────────── */
.sidebar-group__trigger {
  cursor: pointer;
}

.sidebar-group.mm-active > .sidebar-group__trigger {
  color: var(--primary);
}
</style>
