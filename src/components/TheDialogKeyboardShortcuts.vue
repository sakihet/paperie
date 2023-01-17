<script setup lang="ts">
import { store } from '../store'
import AppCode from '../components/AppCode.vue'
</script>

<template>
  <div>
    <div
      class="pattern-mask"
      v-if="store.dialogKeyboardShortcutsOpen"
      @click="store.dialogKeyboardShortcutsOpen = false"
    ></div>
    <dialog
      :open="store.dialogKeyboardShortcutsOpen"
      class="border-1 border-color-default shadow rounded"
    >
      <div>
        <h3>Keyboard shortcuts</h3>
        <div>
          <ul class="list-style-none pl-0 text-secondary">
            <li>
              <AppCode>Command + k</AppCode>: Open the command menu
            </li>
          </ul>
        </div>
      </div>
    </dialog>
  </div>
</template>
