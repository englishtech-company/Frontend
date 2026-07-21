<template>
  <div class="dropdown bootstrap-select default-select status-select dropup">
    <button
      type="button"
      tabindex="-1"
      class="btn dropdown-toggle btn-light"
      data-bs-toggle="dropdown"
      role="combobox"
      aria-owns="bs-select-1"
      aria-haspopup="listbox"
      aria-expanded="true"
      :title="initialValue"
    >
      <div class="filter-option">
        <div class="filter-option-inner">
          <div class="filter-option-inner-inner">{{ initialValue }}</div>
        </div>
      </div>
    </button>
    <div
      class="dropdown-menu"
      style="
        max-height: 311.683px;
        overflow: hidden;
        min-height: 86px;
        position: absolute;
        inset: auto auto 0px 0px;
        margin: 0px;
        transform: translate(0px, -33.7333px);
      "
      data-popper-placement="top-start"
    >
      <div
        class="inner show"
        role="listbox"
        id="bs-select-1"
        tabindex="-1"
        style="max-height: 297.683px; overflow-y: auto; min-height: 72px"
        aria-activedescendant="bs-select-1-0"
      >
        <ul
          class="dropdown-menu inner show"
          role="presentation"
          style="margin-top: 0px; margin-bottom: 0px"
        >
          <li @click="changeValue(String(valueOne))">
            <a
              role="option"
              :class="`dropdown-item`"
              id="bs-select-1-0"
              tabindex="0"
              aria-setsize="4"
              aria-posinset="1"
              aria-selected="true"
              ><span class="text">Mediam</span></a
            >
          </li>
          <li @click="changeValue(String(valueTwo))">
            <a
              role="option"
              :class="`dropdown-item`"
              id="bs-select-1-1"
              tabindex="0"
              aria-setsize="4"
              aria-posinset="2"
              ><span class="text">High</span></a
            >
          </li>
          <li @click="changeValue(String(valueThree))">
            <a
              role="option"
              :class="`dropdown-item `"
              id="bs-select-1-2"
              tabindex="0"
              aria-setsize="4"
              aria-posinset="3"
              ><span class="text">Low</span></a
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
    valueTwo: String as () => string,
    valueThree: String as () => string
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
