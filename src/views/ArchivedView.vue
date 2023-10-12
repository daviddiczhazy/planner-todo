<script setup lang="ts">
import DeletedTodos from '../components/DelletedTodos.vue'
</script>

<template>
  <div>
    <h1>Zmazané úlohy:</h1>
    <br />
    <DeletedTodos />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
