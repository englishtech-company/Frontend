<template>
  <div class="dropdown bootstrap-select default-select status-select normal-select">
    <button
      type="button"
      tabindex="-1"
      class="btn dropdown-toggle btn-light d-flex"
      data-bs-toggle="dropdown"
      role="combobox"
      aria-owns="bs-select-3"
      aria-haspopup="listbox"
      aria-expanded="false"
      title="Month"
    >
      <div class="filter-option">
        <div class="filter-option-inner">
          <div class="filter-option-inner-inner">{{ selectOptin }}</div>
        </div>
      </div>
    </button>
    <div class="dropdown-menu" style="max-height: 202px; overflow: hidden; min-height: 100px">
      <div
        class="inner show"
        role="listbox"
        id="bs-select-3"
        tabindex="-1"
        style="max-height: 188px; overflow-y: auto; min-height: 0px"
        aria-activedescendant="bs-select-3-2"
      >
        <ul
          class="dropdown-menu inner show"
          role="presentation"
          style="margin-top: 0px; margin-bottom: 0px"
        >
          <li
            :class="selectOptin == title ? 'active selected' : ''"
            v-for="({ title }, ind) in selectBox"
            :key="ind"
            @click="selectOption(title)"
          >
            <a
              role="option"
              :class="`dropdown-item ${selectOptin == title ? 'active selected' : ''}`"
              id="bs-select-3-0"
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
import { defineComponent, ref } from 'vue'

export default defineComponent({
  data() {
    return {}
  },
  setup() {
    const selectOptin = ref('Month')

    const checkboxes = ref(false)
    return {
      checkboxes,
      selectOptin,
      selectBox: [{ title: 'Today' }, { title: 'Week' }, { title: 'Month' }]
    }
  },
  methods: {
    selectOption(option: string) {
      this.selectOptin = option
    }
  }
})
</script>
