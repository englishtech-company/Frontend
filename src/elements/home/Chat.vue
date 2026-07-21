<template>
  <div class="col-xl-4 col-md-6 chat-map">
    <div class="card">
      <div class="card-header border-0 mb-0">
        <h4 class="heading mb-0">Chat</h4>
        <div class="d-flex align-items-center cs-settiong">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.8711 5.08237L13.4561 4.36231C13.1051 3.75303 12.3271 3.54284 11.717 3.89244V3.89244C11.4266 4.06352 11.08 4.11206 10.7538 4.02735C10.4275 3.94264 10.1484 3.73164 9.97788 3.44087C9.86819 3.25606 9.80925 3.04556 9.80702 2.83065V2.83065C9.81691 2.48611 9.68693 2.15223 9.44667 1.90507C9.20641 1.65792 8.87634 1.51853 8.53166 1.51868H7.69565C7.35796 1.51867 7.03419 1.65324 6.79599 1.89259C6.55778 2.13194 6.42477 2.45635 6.42639 2.79404V2.79404C6.41638 3.49124 5.84831 4.05117 5.15103 4.05109C4.93613 4.04886 4.72562 3.98992 4.54081 3.88023V3.88023C3.93069 3.53064 3.15273 3.74082 2.80168 4.3501L2.35622 5.08237C2.00559 5.69089 2.21292 6.46836 2.81999 6.8215V6.8215C3.21459 7.04932 3.45767 7.47035 3.45767 7.926C3.45767 8.38164 3.21459 8.80268 2.81999 9.0305V9.0305C2.21369 9.38125 2.00614 10.1568 2.35622 10.7635V10.7635L2.77727 11.4897C2.94175 11.7865 3.21772 12.0055 3.54411 12.0983C3.87051 12.191 4.22041 12.1499 4.5164 11.984V11.984C4.80737 11.8142 5.15411 11.7677 5.47955 11.8548C5.80498 11.9418 6.08214 12.1553 6.24943 12.4477C6.35912 12.6326 6.41806 12.8431 6.42029 13.058V13.058C6.42029 13.7623 6.99129 14.3333 7.69565 14.3333H8.53166C9.23364 14.3333 9.80366 13.766 9.80702 13.0641V13.0641C9.80538 12.7253 9.93923 12.4 10.1788 12.1604C10.4183 11.9209 10.7436 11.7871 11.0824 11.7887C11.2968 11.7944 11.5064 11.8531 11.6926 11.9596V11.9596C12.3011 12.3102 13.0786 12.1029 13.4317 11.4958V11.4958L13.8711 10.7635C14.0412 10.4716 14.0878 10.124 14.0008 9.79754C13.9137 9.47112 13.7002 9.19286 13.4073 9.0244V9.0244C13.1145 8.85593 12.9009 8.57768 12.8139 8.25125C12.7268 7.92483 12.7735 7.57717 12.9436 7.28527C13.0541 7.09218 13.2142 6.93209 13.4073 6.8215V6.8215C14.0107 6.46855 14.2176 5.69562 13.8711 5.08847V5.08847V5.08237Z"
              stroke="#0D99FF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="8.1167"
              cy="7.92602"
              r="1.75744"
              stroke="#0D99FF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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
            <div
              class="dropdown-menu"
              style="max-height: 202px; overflow: hidden; min-height: 100px"
            >
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
        </div>
      </div>
      <div class="card-body pt-0">
        <div class="chat-box-area style-1 dz-scroll" id="chartBox2">
          <div class="media">
            <div class="message-received w-auto">
              <div class="d-flex">
                <img
                  src="../../assets/images/contacts/pic2.jpg"
                  class="avatar rounded-circle"
                  alt=""
                />
                <div class="ms-1 text">
                  <p class="mb-1">Good morning</p>
                  <p class="mb-1">Can you arrange schedule for next meeting?</p>
                  <span>12:45 PM</span>
                </div>
              </div>
            </div>
          </div>
          <span class="text-center d-block mb-4">Today</span>
          <div class="media justify-content-end align-items-end ms-auto">
            <div class="message-sent w-auto">
              <p class="mb-1">Very Good morning</p>
              <p class="mb-1">Okay, I’ll arrange it soon. i noftify you when</p>
              <p class="mb-1">Very Good morning</p>
              <p>
                Okay, I’ll arrange it soon. i noftify you when it’s done<br />
                +91-235 2574 2566<br />
                kk Sharma<br />
                pan card eeer2063i
              </p>
              <span class="fs-12">9.30 AM</span>
            </div>
          </div>
        </div>
        <div class="message-send">
          <div class="type-massage style-1">
            <div class="input-group">
              <textarea rows="1" class="form-control" placeholder="Hello Hanuman..."></textarea>
            </div>
          </div>
          <button type="button" class="btn btn-primary p-2">
            Send
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.555 5.44976L6.73936 9.30612L2.39962 6.59178C1.77783 6.20276 1.90718 5.25829 2.61048 5.05262L12.9142 2.03518C13.5582 1.84642 14.155 2.44855 13.9637 3.09466L10.9154 13.3912C10.7066 14.0955 9.76747 14.2213 9.38214 13.5968L6.73734 9.3068"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'chat_',

  setup() {
    const selectOptin = ref('Setting')
    return {
      selectOptin,
      selectBox: [{ title: 'Setting' }, { title: 'Group' }, { title: 'Chat' }]
    }
  },
  methods: {
    selectOption(option: string) {
      this.selectOptin = option
    }
  }
})
</script>

<style scoped></style>
