<script setup lang="ts">
import { onUpdated, ref } from 'vue'
import { store } from '../store'

const refCommandMenuInput = ref<HTMLElement | null>(null)

onUpdated(() => {
  if (store.commandMenuDialogOpen) {
    refCommandMenuInput.value?.focus()
  }
})
</script>

<template>
  <div>
    <div
      class="pattern-mask"
      v-if="store.commandMenuDialogOpen"
      @click="store.commandMenuDialogOpen = false"
    />
    <dialog
      class="border-none shadow rounded"
      :open="store.commandMenuDialogOpen"
    >
      <div>
        <div class="h-8">
          <input
            class="w-full border-color-default"
            type="text"
            placeholder="Under constrcution..."
            ref="refCommandMenuInput"
          />
        </div>
        <div>
          <hr />
          <ul class="list-style-none pl-0 my-2">
            <li
              class="h-8"
              v-for="note in store.notes"
              :key="note.id"
            >
              <router-link
                class="text-decoration-none"
                :to="{ path: '/', query: { noteId: note.id} }"
              >
                {{ note.title }}
              </router-link>
            </li>
          </ul>
          <hr />
          <ul class="list-style-none pl-0 my-2">
            <li
              class="h-8"
            >
              <router-link
                class="text-decoration-none"
                :to="{ path: '/' }"
                @click="store.commandMenuDialogOpen = false"
              >
                /
              </router-link>
            </li>
            <li
              class="h-8"
            >
              <router-link
                class="text-decoration-none"
                :to="{ path: '/about' }"
                @click="store.commandMenuDialogOpen = false"
              >
                About
              </router-link>
            </li>
          </ul>
        </div>
        <div>
          <div class="f-1 text-secondary">
            <small>
              <p>command + k: Close the command menu</p>
            </small>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
