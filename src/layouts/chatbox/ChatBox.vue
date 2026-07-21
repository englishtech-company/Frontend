<template>
  <div :class="`chatbox ${openChatbox ? 'active' : ''}`">
    <div class="chatbox-close" @click="closeChatbox"></div>
    <div class="custom-tab-1">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#notes">Notes</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#alerts">Alerts</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" data-bs-toggle="tab" href="#chat">Chat</a>
        </li>
      </ul>
      <div class="tab-content">
        <Chats />
        <Alerts />
        <Notes />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/stores/Store'
import Chats from './Chats.vue'
import Alerts from './Alerts.vue'
import Notes from './Notes.vue'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'chatBox',
  setup() {
    const store = useStore()
    const { openChatbox } = storeToRefs(store)

    return { openChatbox }
  },

  methods: {
    closeChatbox() {
      this.openChatbox = false
    }
  },
  components: { Chats, Alerts, Notes }
})
</script>

<style scoped></style>
