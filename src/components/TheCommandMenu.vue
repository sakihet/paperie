<script setup lang="ts">
import { onUpdated, ref } from 'vue'
import { store } from '../store'
import AppCode from './AppCode.vue'

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
      <div class="layout-stack-4">
        <div class="h-8">
          <input
            class="h-8 w-full border-solid border-1 border-color-default rounded px-2"
            type="text"
            placeholder="Under constrcution..."
            ref="refCommandMenuInput"
          />
        </div>
        <div>
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
          <ul class="list-style-none pl-0 my-2">
            <li
              class="h-8 hover"
            >
              <router-link
                class="text-decoration-none"
                :to="{ path: '/' }"
                @click="store.commandMenuDialogOpen = false"
              >
                <div class="h-8 p-2">/</div>
              </router-link>
            </li>
            <li
              class="h-8 hover"
            >
              <router-link
                class="text-decoration-none"
                :to="{ path: '/new' }"
                @click="store.commandMenuDialogOpen = false"
              >
               <div class="h-8 p-2">/new</div>
              </router-link>
            </li>
            <li
              class="h-8 hover"
            >
              <router-link
                class="text-decoration-none"
                :to="{ path: '/about' }"
                @click="store.commandMenuDialogOpen = false"
              >
                <div class="h-8 p-2">About</div>
              </router-link>
            </li>
          </ul>
        </div>
        <div>
          <div class="f-1 text-secondary">
            <small>
              <p><AppCode>Command + k</AppCode>: Close the command menu</p>
            </small>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
