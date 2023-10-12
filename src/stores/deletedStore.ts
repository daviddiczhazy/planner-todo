import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TodoItemAttr } from '@/models/itemModels'
import axios from 'axios'

export const useDeletedTodoStore = defineStore('deletedTodoStore', () => {
    const DeletedTodos = reactive<TodoItemAttr[]>([
       
      ])
  const getTodos = computed(() => DeletedTodos)

  async function getItemsToTodos() {
    const items = await axios.get('https://6526b560917d673fd76cda91.mockapi.io/items')
    const notDeletedItems = items.data.filter((item: any) => item.deleted ? item.deleted : false)
    Object.assign(DeletedTodos, notDeletedItems)
  }

  return { DeletedTodos, getTodos,  getItemsToTodos, }
})