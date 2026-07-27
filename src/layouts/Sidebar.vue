<!-- @format -->

<template>
  <div class="dlabnav" @mouseenter="iconHover = true" @mouseleave="iconHover = false">
    <div class="dlabnav-scroll">
      <ul class="metismenu" id="menu">
        <li class="nav-label first">Menu Principal</li>
        <template v-for="({ title, icons, className, subMenuItems, to }, ind) in menuItems" :key="ind">
          <li v-if="className == 'sub-menu'" :class="addActive == title ? (!showMenu ? 'mm-active' : '') : ''">
            <RouterLink class="has-arrow" to="?" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${ind}`" aria-expanded="false" @click="addActive == title ? (showMenu = !showMenu) : null">
              <i :class="icons"></i>{{ " " }}
              <span class="nav-text">{{ title }}</span>
            </RouterLink>
            <ul :class="`collapse mm-show ${addActive == title ? 'mm-active show' : ''}`" :id="`collapseExample${ind}`">
              <template v-for="({ menu, subMenuDownItems, className, to }, index) in subMenuItems" :key="index">
                <li v-if="className == 'sub-menu-down'">
                  <RouterLink :class="`has-arrow collapsed`" to="?" data-bs-toggle="collapse" :data-bs-target="`#collapseExample2${index}`" aria-expanded="false">{{ menu }}</RouterLink>
                  <ul aria-expanded="false" :class="`collapse`" :id="`collapseExample2${index}`">
                    <li v-for="({ child, to }, ind) in subMenuDownItems" :key="ind">
                      <RouterLink :to="`${to}`" :class="{ active: $route.path === to }">{{ child }}</RouterLink>
                    </li>
                  </ul>
                </li>
                <li v-else>
                  <RouterLink
                    :to="`${to}`"
                    :class="{
                      active:
                        $route.path === to ||
                        (to && to !== '/' && $route.path.startsWith(String(to))),
                    }"
                  >
                    {{ menu }}
                  </RouterLink>
                </li>
              </template>
            </ul>
          </li>
          <li class="nav-label" v-else-if="className == 'menu-title'">{{ title }}</li>
          <li v-else>
            <RouterLink
              :to="`${to}`"
              aria-expanded="false"
              :class="{
                active:
                  $route.path === to ||
                  (to && to !== '/' && $route.path.startsWith(String(to))),
              }"
            >
              <i :class="icons"></i>
              <span class="nav-text">{{ title }}</span>
            </RouterLink>
          </li>
        </template>
      </ul>
    </div>
    <div class="copyright sidebar-copyright">
      <p>EnglishTech © {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { useFilteredMenu } from "@/layouts/useFilteredMenu";
import router from "@/router";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "sidebar_",
  setup() {
    const { iconHover } = storeToRefs(useStore());
    const { menuItems } = useFilteredMenu();
    const addActive = ref("Dashboard");
    const showMenu = ref(false);
    function isRouteActive(path?: string): boolean {
      if (!path) return false;
      const current = router.currentRoute.value.path;
      return current === path || (path !== "/" && current.startsWith(path));
    }

    function menuActive() {
      menuItems.value.map((el) => {
        if (isRouteActive(el.to)) {
          addActive.value = String(el.title);
        }
        el.subMenuItems?.map((ell) => {
          if (isRouteActive(ell.to)) {
            addActive.value = String(el.title);
          }
        });
      });
    }
    watchEffect(() => {
      menuActive();
    });
    return { showMenu, menuItems, addActive, iconHover };
  },
});
</script>

<style>
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

.mm-show {
  transition: all 0.3s linear;
}
.metismenu .active {
  color: var(--primary) !important;
}
</style>
