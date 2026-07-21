<!-- @format -->

<template>
  <div class="dlabnav" @mouseenter="iconHover = true" @mouseleave="iconHover = false">
    <div class="dlabnav-scroll">
      <ul class="metismenu" id="menu">
        <li class="nav-label first">Main Menu</li>
        <template v-for="({ title, icons, className, subMenuItems, to }, ind) in MenuItems" :key="ind">
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
                  <RouterLink :to="`${to}`" :class="{ active: $route.path === to }">{{ menu }}</RouterLink>
                </li>
              </template>
            </ul>
          </li>
          <li class="nav-label" v-else-if="className == 'menu-title'">{{ title }}</li>
          <li v-else>
            <RouterLink :to="`${to}`" aria-expanded="false" :class="{ active: $route.path === to }">
              <i :class="icons"></i>
              <span class="nav-text">{{ title }}</span>
            </RouterLink>
          </li>
        </template>
      </ul>
      <div class="copyright">
        <p>Edumin Saas Admin © {{ new Date().getFullYear() }} All Rights Reserved</p>
        <p class="fs-12">
          Made with
          <span
            class="heart"
            @click="(e) => {
          (e.target as HTMLSpanElement).classList.toggle('heart-blast')
        }"
          ></span>
          by DexignLab
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import MenuItems from "@/layouts/Menu";
import router from "@/router";
import { useStore } from "@/stores/Store";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "sidebar_",
  setup() {
    const { iconHover } = storeToRefs(useStore());
    const addActive = ref("Dashboard");
    const showMenu = ref(false);
    function menuActive() {
      MenuItems.map((el) => {
        if (router.currentRoute.value.fullPath == el.to) {
          addActive.value = String(el.title);
        }
        el.subMenuItems?.map((ell) => {
          if (router.currentRoute.value.fullPath == ell.to) {
            addActive.value = String(el.title);
          }
          ell.subMenuDownItems?.map((ele) => {
            if (router.currentRoute.value.fullPath == ele.to) {
              addActive.value = String(el.title);
            }
          });
        });
      });

      // for (const list of document.querySelectorAll(".has-arrow")) {
      //   if (list.classList.contains("active")) {
      //     console.log(list);
      //   }
      // }
    }
    watchEffect(() => {
      menuActive();
    });
    return { showMenu, MenuItems, addActive, iconHover };
  },
});
</script>

<style>
.mm-show {
  transition: all 0.3s linear;
}
.metismenu .active {
  color: var(--primary) !important;
}
</style>
