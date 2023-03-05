<script setup lang="ts">
import { onUpdated, ref, nextTick } from 'vue'
import { store } from '../store'
import AppCode from './AppCode.vue'

const refCommandMenuInput = ref<HTMLElement | null>(null)
const refCommandMenuQuery = ref<string>("")

onUpdated(() => {
  if (store.commandMenuDialogOpen) {
    refCommandMenuInput.value?.focus()
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  const ignoreKeys = ['Enter', 'ArrowUp', 'ArrowDown']
  if (ignoreKeys.includes(e.key)) {
    console.log('ignore', e.key)
  } else {
    console.log('keydown', e, refCommandMenuQuery.value)
  }
}
const handleKeydownEnter = (e: Event) => {
  console.log('keydown enter')
}
const handleKeydownUp = (e: Event) => {
  console.log('keydown up')
}
const handleKeydownDown = (e: Event) => {
  console.log('keydown down')
}

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
      <div class="">
        <div class="h-8">
          <input
            class="h-8 w-full border-solid border-1 border-color-default rounded px-2"
            type="text"
            placeholder="Under constrcution..."
            ref="refCommandMenuInput"
            v-model="refCommandMenuQuery"
            @keydown="handleKeydown"
            @keydown.enter="handleKeydownEnter"
            @keydown.up="handleKeydownUp"
            @keydown.down="handleKeydownDown"
          />
        </div>
        <div>
          <ul class="list-style-none pl-0 my-2">
            <li
              class="h-8 hover"
              v-for="note in store.notes"
              :key="note.id"
            >
              <router-link
                class="text-decoration-none"
                :to="{ path: '/', query: { noteId: note.id} }"
                @click="store.commandMenuDialogOpen = false"
              >
                <div class="h-8 px-2 py-2">
                  {{ note.title }}
                </div>
              </router-link>
            </li>
          </ul>
          <ul class="list-style-none pl-0 my-2">
            <li class="h-8 hover">
              <router-link
                class="text-decoration-none"
                :to="{ path: '/' }"
                @click="store.commandMenuDialogOpen = false"
              >
                <div class="h-8 px-2 py-2">/</div>
              </router-link>
            </li>
            <li class="h-8 hover">
              <router-link
                class="text-decoration-none"
                :to="{ path: '/new' }"
                @click="store.commandMenuDialogOpen = false"
              >
               <div class="h-8 px-2 py-2">/new</div>
              </router-link>
            </li>
            <li class="h-8 hover">
              <router-link
                class="text-decoration-none"
                :to="{ path: '/about' }"
                @click="store.commandMenuDialogOpen = false"
              >
                <div class="h-8 px-2 py-2">About</div>
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
