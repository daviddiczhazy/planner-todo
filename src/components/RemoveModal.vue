<script setup lang="ts">
interface DialogProps {
  title?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  title: ''
})

const emit = defineEmits(['removeItem'])

const removeTodoItem = () => {
  emit('removeItem')
}
</script>

<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-icon icon="mdi-close" v-bind="props"></v-icon>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Naozaj cheťe vymazať túto úlohu?">
        <v-card-text>
          {{ props.title }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Zrušiť" @click="isActive.value = false"></v-btn>
          <v-btn
            color="red-darken-1"
            variant="outlined"
            text="Vymazať"
            @click.prevent="
              () => {
                ;(isActive.value = false), removeTodoItem()
              }
            "
          >
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped></style>
