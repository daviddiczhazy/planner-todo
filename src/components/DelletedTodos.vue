<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { TodoItemAttr } from '@/models/itemModels'
import { onMounted } from 'vue'
import { useStateStore } from '@/stores/state'
import { useDeletedTodoStore } from '@/stores/deletedStore'
import moment from 'moment'

const filterState = useStateStore()
const filterStateFilter = computed(() => useStateStore().getFilter)
const filterStateText = computed(() => useStateStore().getTextFilter)
const TodoItems = useDeletedTodoStore()

const filteredTodo = ref<TodoItemAttr[]>([])

const formatDate = (value: string) => {
  if (value) {
    return moment(String(value)).format('DD.MM.YYYY')
  }
}

const getItems = async () => {
  await TodoItems.getItemsToTodos()
  filterItems()
}

const textFilter = (text: string) => {
  if (text) {
    filteredTodo.value = TodoItems.getTodos.filter(
      (item) => item.title?.toLowerCase().includes(text.toLowerCase())
    )
  } else {
    filterItems(filterState.getFilter)
  }
}

const filterItems = async (filter: string = 'all') => {
  if (filter === 'active') {
    filteredTodo.value = TodoItems.getTodos.filter((item) => !item.completed)
  } else if (filter === 'completed') {
    filteredTodo.value = TodoItems.getTodos.filter((item) => item.completed)
  } else {
    filteredTodo.value = TodoItems.getTodos
  }
}

watch(filterStateFilter, () => {
  filterItems(filterState.getFilter)
})

watch(filterStateText, () => {
  textFilter(filterState.getTextFilter)
})

onMounted(() => {
  getItems()
})
</script>

<template>
  <div>
    <v-list lines="two">
      <v-list-item
        v-for="(item, n) in filteredTodo"
        :key="n"
        class="todo-card"
        :title="item.title"
        :subtitle="item.subtitle"
      >
        <template v-slot:title="{ title }">
          <p :class="{ 'text-completed': item.completed }">{{ title }}</p>
        </template>
        <template v-slot:subtitle="{ subtitle }">
          <p :class="{ 'text-completed': item.completed }">{{ subtitle }}</p>
          <small :class="{ 'text-completed': item.completed }">{{
            item.date ? formatDate(item.date as string) : ''
          }}</small>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.todo-card {
  padding: 1em;
  border-radius: 16px;
  border: 1px solid #082659;
  max-width: 80%;
  margin-bottom: 1.5em;
  background-color: #08265966;
  color: #555;
}

.text-completed {
  text-decoration: line-through;
}
</style>
