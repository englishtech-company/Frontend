<template>
  <div class="dropdown bootstrap-select default-select style-1 wide w-100">
    <button
      type="button"
      tabindex="-1"
      class="btn dropdown-toggle btn-light"
      data-bs-toggle="dropdown"
      role="combobox"
      aria-owns="bs-select-1"
      aria-haspopup="listbox"
      aria-expanded="false"
      title="Post"
    >
      <div class="filter-option">
        <div class="filter-option-inner">
          <div class="filter-option-inner-inner">{{ initialValue }}</div>
        </div>
      </div>
    </button>
    <div class="dropdown-menu" style="max-height: 146.4px; overflow: hidden; min-height: 0px">
      <div
        class="inner show"
        role="listbox"
        id="bs-select-1"
        tabindex="-1"
        style="max-height: 132.4px; overflow-y: auto; min-height: 0px"
        aria-activedescendant="bs-select-1-0"
      >
        <ul
          class="dropdown-menu inner show"
          role="presentation"
          style="margin-top: 0px; margin-bottom: 0px"
        >
          <li @click="changeValue(String(valueOne))" class="selected active">
            <a role="option" :class="`dropdown-item ${initialValue == valueOne ? 'active' : ''}`"
              ><span class="text">{{ valueOne }} </span></a
            >
          </li>
          <li @click="changeValue(String(valueTwo))">
            <a
              role="option"
              :class="`dropdown-item ${initialValue == valueTwo ? 'active' : ''}`"
              id="bs-select-1-1"
              ><span class="text">{{ valueTwo }}</span></a
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
  name: 'customSelect_',

  setup() {
    const initialValue = ref('')
    return { initialValue }
  },
  props: {
    valueOne: String as () => string,
    valueTwo: String as () => string
  },
  mounted: function () {
    this.initialValue = String(this.valueOne)
  },
  methods: {
    changeValue(value: string) {
      this.initialValue = value
    }
  }
})
</script>

<style scoped></style>
