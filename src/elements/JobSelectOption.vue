<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  options?: any;
  Click?: any;
}>();

const addActive = ref(0);

const selectHandler = () => { };
</script>

<template>
  <button type="button" tabindex="-1" class="btn dropdown-toggle btn-light" data-bs-toggle="dropdown" role="combobox"
    aria-owns="bs-select-1" aria-haspopup="listbox" aria-expanded="false" title="France">
    <div class="filter-option">
      <div class="filter-option-inner">
        <div class="filter-option-inner-inner">
          <img :src="options[addActive].img" alt="" v-if="options[addActive].img">
          {{ options[addActive].title }}
        </div>
      </div>
    </div>
  </button>
  <div class="dropdown-menu">
    <div class="inner show" role="listbox" id="bs-select-1" tabindex="-1" aria-activedescendant="bs-select-1-2">
      <ul class="dropdown-menu inner show" role="presentation">
        <li :class="`${addActive == ind ? 'selected active' : ''}`" v-for="({ title, img }, ind) in options" :key="ind"
          @click="
            addActive = ind;
          Click(title);
          ">
          <a role="option" :class="`dropdown-item ${addActive == ind ? 'active selected' : ''}`" id="bs-select-1-2"
            tabindex="0" aria-setsize="3" aria-posinset="3" aria-selected="true">
            <img :src="img" alt="" v-if="img">
            <span class="text">{{ title
              }}</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
