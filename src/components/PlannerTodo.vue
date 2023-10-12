<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import RemoveModal from '@/components/RemoveModal.vue'
import EditItem from '@/components/dialogs/EditItemDialog.vue'
import type { TodoItemAttr } from '@/models/itemModels'
import { onMounted } from 'vue'
import { useStateStore } from '@/stores/state'
import { useTodoStore } from '@/stores/todoStore'
import moment from 'moment'

const inputField = ref<string>('')
const filterState = useStateStore()
const filterStateFilter = computed(() => useStateStore().getFilter)
const filterStateText = computed(() => useStateStore().getTextFilter)
const TodoItems = useTodoStore()

const spinner = ref<boolean>(true)
const connectionProblem = ref<boolean>(false)
const errorMessage = ref<string>('')

const filteredTodo = ref<TodoItemAttr[]>([])

const formatDate = (value: string) => {
  if (value) {
    return moment(String(value)).format('DD.MM.YYYY')
  }
}

const getItems = async () => {
  try {
    await TodoItems.getItemsToTodos()
    filterItems()
    spinner.value = false
  } catch (error) {
    connectionProblem.value = true
    errorMessage.value = error as string
  }
}

const addItemToList = async (value: string) => {
  spinner.value = true
  await TodoItems.addItemToList(value)
  inputField.value = ''
  await getItems()
  spinner.value = false
}

const removeItemFromTodos = async (id: number) => {
  spinner.value = true
  await TodoItems.removeItemFromTodos(id)
  await getItems()
  spinner.value = false
}

const setItemCompleted = async (id: number) => {
  await TodoItems.updateTodosItemCompleted(id)
  await getItems()
}

const editItem = async (id: number, item: any) => {
  await TodoItems.editTodosItem(id, item)
  await getItems()
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

watch(TodoItems, () => {
  filterItems(filterState.getFilter)
})

watch(filterStateFilter, () => {
  filterItems(filterState.getFilter)
})

watch(filterStateText, () => {
  textFilter(filterState.getTextFilter)
})

onMounted(() => {
  getItems()
  filterItems()
})
</script>

<template>
  <div>
    <v-text-field
      label="Pridať úlohu..."
      variant="outlined"
      v-model="inputField"
      @keydown.enter="addItemToList(inputField)"
      class="todo-input"
    >
    </v-text-field>
  </div>
  <div v-if="connectionProblem">
    <h2>Nastala chyba spojenia</h2>
    <p>chyba: {{ errorMessage }}</p>
    <p><small>Skuste obnovit stranku</small></p>
  </div>
  <div v-else>
    <div v-if="spinner">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="70"
        class="planner-spinner"
      ></v-progress-circular>
    </div>
    <div v-else>
      <v-list lines="two">
        <v-list-item
          v-for="(item, n) in filteredTodo"
          :key="n"
          class="todo-card"
          :class="{ 'todo-completed': item.completed }"
          :title="item.title"
          :subtitle="item.subtitle"
        >
          <template v-slot:prepend>
            <v-icon
              v-if="!item.completed"
              icon="mdi-check-circle-outline"
              @click="setItemCompleted(parseInt(item.id))"
            ></v-icon>
            <v-icon
              v-else
              icon="mdi-checkbox-marked-circle"
              @click="setItemCompleted(parseInt(item.id))"
            ></v-icon>
          </template>
          <template v-slot:title="{ title }">
            <p :class="{ 'text-completed': item.completed }">{{ title }}</p>
          </template>
          <template v-slot:subtitle="{ subtitle }">
            <p :class="{ 'text-completed': item.completed }">{{ subtitle }}</p>
            <small :class="{ 'text-completed': item.completed }">{{
              item.date ? formatDate(item.date as string) : ''
            }}</small>
          </template>

          <template v-slot:append>
            <EditItem
              :id="item.id"
              :title="item.title"
              :subtitle="item.subtitle"
              :completed="item.completed"
              :date="item.date"
              @edit-todo-item="(item) => editItem(n, item)"
            />
            &nbsp; &nbsp;
            <RemoveModal
              :title="item.title"
              @remove-item="removeItemFromTodos(parseInt(item.id))"
            /> </template
        ></v-list-item>
      </v-list>
    </div>
  </div>
</template>

<style scoped>
.planner-spinner {
  position: relative;
  top: 5em;
  left: 15em;
}
.todo-input {
  max-width: 80%;
}
.todo-card {
  padding: 1em;
  border-radius: 16px;
  border: 1px solid #082659;
  max-width: 80%;
  margin-bottom: 1.5em;
}

.todo-completed {
  background-color: #08265922;
}

.text-completed {
  text-decoration: line-through;
}
</style>
