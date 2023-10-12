<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { ref } from 'vue'

const searchText = ref<string>('')
const updateFilterText = useStateStore().updateTextFilter

const filterTodoItems = (val: string) => {
  updateFilterText(val)
}
</script>

<template>
  <div>
    <v-text-field
      label="Hľadať úlohu..."
      variant="outlined"
      v-model="searchText"
      @keyup="filterTodoItems(searchText)"
      class="search-input"
    >
    </v-text-field>
  </div>
</template>

<style scoped>
.search-input {
  margin-top: 1.5rem;
  width: 100%;
}
</style>
