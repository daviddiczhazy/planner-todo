<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { TodoItemAttr } from '@/models/itemModels'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const props = withDefaults(defineProps<TodoItemAttr>(), {
  title: '',
  subtitle: '',
  date: '',
  completed: false
})

const itemState = {
  title: props.title,
  subtitle: props.subtitle,
  date: props.date
}

const state = reactive({ ...itemState })

const rules = computed(() => {
  return {
    title: { required }
  }
})

const v$ = useVuelidate(rules, state)

const emit = defineEmits(['editTodoItem'])

const onSubmit = () => {
  v$.value.$validate()

  if (v$.value.$error) {
    alert('Chybne vyplnené polia')
    state.title = props.title
  } else {
    emit('editTodoItem', state)
  }
}
</script>

<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-icon v-if="!props.completed" icon="mdi-pencil-outline" v-bind="props"></v-icon>
    </template>

    <template v-slot:default="{ isActive }">
      <form>
        <v-card title="Upraviť úlohu">
          <div class="edit-section">
            <v-text-field
              v-model="state.title"
              :error-messages="v$.title.$errors.map((e) => 'Hodnota je povinna')"
              variant="outlined"
              required
              label="Nazov"
              @input="v$.title.$touch"
              @blur="v$.title.$touch"
            ></v-text-field>
            <v-textarea v-model="state.subtitle" variant="outlined" label="Popis"></v-textarea>
            <label>Dátum: </label>
            <input type="date" v-model="state.date" />
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="
                () => {
                  isActive.value = false
                }
              "
            >
              Zrušiť
            </v-btn>
            <v-btn
              variant="tonal"
              color="success"
              class="me-4"
              @click="
                () => {
                  v$.$validate, onSubmit(), (isActive.value = false)
                }
              "
            >
              Uložiť
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </template>
  </v-dialog>
</template>

<style scoped>
.edit-section {
  padding: 1rem;
}
</style>
