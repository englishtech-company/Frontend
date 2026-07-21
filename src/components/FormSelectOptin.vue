<!-- @format -->

<template>
  <div
    class="dropdown bootstrap-select default-select form-control wide mb-3 form-control-lg"
  >
    <button
      type="button"
      tabindex="-1"
      class="btn dropdown-toggle btn-light"
      data-bs-toggle="dropdown"
      role="combobox"
      aria-owns="bs-select-1"
      aria-haspopup="listbox"
      aria-expanded="true"
    >
      <div class="filter-option">
        <div class="filter-option-inner">
          <div class="filter-option-inner-inner">{{ option }}</div>
        </div>
      </div>
    </button>
    <div
      class="dropdown-menu"
      style="
        max-height: 278.967px;
        overflow: hidden;
        min-height: 0px;
        position: absolute;
        inset: auto auto 0px 0px;
        margin: 0px;
        transform: translate(0px, -54.8px);
      "
      data-popper-placement="top-start"
    >
      <div
        class="inner show"
        role="listbox"
        id="bs-select-1"
        tabindex="-1"
        style="max-height: 264.967px; overflow-y: auto; min-height: 0px"
        aria-activedescendant="bs-select-1-2"
      >
        <ul
          class="dropdown-menu inner show"
          role="presentation"
          style="margin-top: 0px; margin-bottom: 0px"
        >
          <li
            class=""
            v-for="({ title }, ind) in optionArray"
            :key="ind"
            @click="option = title"
          >
            <a
              role="option"
              class="dropdown-item"
              id="bs-select-1-0"
              tabindex="0"
              aria-setsize="3"
              aria-posinset="1"
              ><span class="text">{{ title }}</span></a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "formSelect_",
  props: { optionArray: Array as () => any },
  setup() {
    const option = ref("Option 1");
    return { option };
  },
});
</script>
