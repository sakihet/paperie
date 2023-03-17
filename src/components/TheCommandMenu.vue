<script setup lang="ts">
import { computed, onUpdated, ref, watch } from 'vue';
import router from '../router';
import { store } from '../store'

const refCommandMenuIndex = ref<number>(0)
const refCommandMenuInput = ref<HTMLElement | null>(null)
const refCommandMenuQuery = ref<string>("")

type Command = {
  name: string,
  to: {
    path: string
  }
}

const staticCommands: Command[] = [
  {
    name: 'Index',
    to: { path: '/' }
  },
  {
    name: 'Add',
    to: { path: '/new' }
  },
  {
    name: 'About',
    to: { path: '/about' }
  }
]

const commands = computed(() => {
  return [
    ...staticCommands,
    ...store.notes.map(note => { return <Command>{ name: note.title, to: { path: `/?noteId=${note.id}` } } })
  ].filter(c => c.name.includes(refCommandMenuQuery.value))
})

watch (() => store.commandMenuOpen, async (after, before) => {
  if (after) {
    refCommandMenuQuery.value = ''
  }
})

const handleInput = (e: Event) => {
  refCommandMenuIndex.value = 0
}
const handleKeydown = (e: KeyboardEvent) => {
}
const handleKeydownEnter = (e: KeyboardEvent) => {
  const command: Command = commands.value[refCommandMenuIndex.value]
  router.push(command.to.path)
  store.commandMenuOpen = false
}
const handleKeydownDown = (e: KeyboardEvent) => {
  if (refCommandMenuIndex.value < (commands.value.length - 1)) {
    refCommandMenuIndex.value++
  } else if (refCommandMenuIndex.value === (commands.value.length - 1)) {
    refCommandMenuIndex.value = 0
  }
}
const handleKeydownUp = (e: KeyboardEvent) => {
  if (0 < refCommandMenuIndex.value) {
    refCommandMenuIndex.value--
  } else if (0 === refCommandMenuIndex.value) {
    refCommandMenuIndex.value = (commands.value.length - 1)
  }
}

onUpdated(() => {
  if (store.commandMenuOpen) {
    refCommandMenuInput.value?.focus()
  }
})
</script>

<template>
  <div>
    <div
      class="pattern-mask"
      v-if="store.commandMenuOpen"
      @click="store.commandMenuOpen = false"
    ></div>
    <dialog
      class="rounded border-1 border-solid border-color-default"
      :open="store.commandMenuOpen"
    >
      <div class="w-96 layout-stack-4">
        <div>
          <input
            type="text"
            class="h-8 w-full border-none"
            ref="refCommandMenuInput"
            v-model="refCommandMenuQuery"
            @input="handleInput"
            @keydown="handleKeydown"
            @keydown.enter="handleKeydownEnter"
            @keydown.down="handleKeydownDown"
            @keydown.up="handleKeydownUp"
          />
        </div>
        <div class="">
          <div
            v-for="(command, index) in commands"
            class="h-8"
          >
            <router-link
              :to="command.to"
              class="text-decoration-none text-secondary"
            >
              <div
                class="h-8 p-2"
                :class="{ 'bg-command-menu text-command-menu': index === refCommandMenuIndex}"
              >
                {{ command.name }}
              </div>
            </router-link>
          </div>
        </div>
        <div class="text-secondary text-small h-4 text-center">
          <pre>enter: select | ↑↓: navigate | ⌘+k: close</pre>
        </div>
      </div>
    </dialog>
  </div>
</template>
