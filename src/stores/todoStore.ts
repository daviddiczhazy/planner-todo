import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TodoItemAttr } from '@/models/itemModels'
import moment from 'moment'
import axios from 'axios'

export const useTodoStore = defineStore('todoStore', () => {
  const allTodos = reactive<TodoItemAttr[]>([
       
  ])
    const Todos = reactive<TodoItemAttr[]>([
       
      ])
  const getTodos = computed(() => Todos)

   async function addItemToList(value: string) {
     const TodoItem: TodoItemAttr = {
        id: Todos.length + 1 as unknown as string,
        title: value,
        subtitle: '',
        date: moment(new Date()).format('YYYY-MM-DD'),
        completed: false,
        deleted: false,
      }

    await sendItemToTodos(TodoItem)
  } 

  async function removeItemFromTodos(id: number) {
   
    allTodos[id-1].deleted = true
    await axios.put(`https://6526b560917d673fd76cda91.mockapi.io/items/${id}`, allTodos[id-1], {headers: {
      'Content-Type': 'application/json'
    }} )
  }

  async function editTodosItem(id: number, item: any){

    const editItem: TodoItemAttr = {
      id: Todos[id].id,
      title: item.title,
      subtitle: item.subtitle,
      date: item.date,
      completed: Todos[id].completed
    }

    await axios.put(`https://6526b560917d673fd76cda91.mockapi.io/items/${Todos[id].id}`, editItem,  {headers: {
      'Content-Type': 'application/json'
    }} )
  }

  async function getItemsToTodos() {
    const items = await axios.get('https://6526b560917d673fd76cda91.mockapi.io/items')
    const notDeletedItems = items.data.filter((item: any) => item.deleted ? !item.deleted : true)

    Todos.length = 0
    Object.assign(Todos, notDeletedItems)
    Object.assign(allTodos, items.data)
  }

  async function sendItemToTodos(item: TodoItemAttr) {
    await axios.post('https://6526b560917d673fd76cda91.mockapi.io/items', item, {headers: {
      'Content-Type': 'application/json'
    }})
    
  }

  async function updateTodosItemCompleted (id: number) {
    allTodos[id-1].completed = !allTodos[id-1].completed
    await axios.put(`https://6526b560917d673fd76cda91.mockapi.io/items/${id}`, allTodos[id-1], {headers: {
      'Content-Type': 'application/json'
    }} )
  }

  

  return { Todos, getTodos, addItemToList, removeItemFromTodos, editTodosItem, getItemsToTodos, sendItemToTodos, updateTodosItemCompleted }
})