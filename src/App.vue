<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import PlannerHome from './components/PlannerTodoHome.vue'
import SearchTodo from './components/SearchTodo.vue'
import { useStateStore } from '@/stores/state'
import { ref } from 'vue'

const filterState = useStateStore()
const filteredOption = ref<string>('all')

const filterTodoItems = (value: string) => {
  filterState.updatefilter('')
  filterState.updatefilter(value)
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/todologo.png" width="125" height="125" />

    <div class="wrapper">
      <PlannerHome msg="Plánovač úloh" />

      <nav>
        <RouterLink to="/">Domov</RouterLink>
        <RouterLink to="/about">Archív</RouterLink>
      </nav>
      <div class="planner-chips">
        <v-chip
          @click="filterTodoItems('all'), (filteredOption = 'all')"
          :variant="filteredOption === 'all' ? 'elevated' : 'tonal'"
        >
          Všetky
        </v-chip>
        <v-chip
          @click="filterTodoItems('active'), (filteredOption = 'active')"
          :variant="filteredOption === 'active' ? 'elevated' : 'tonal'"
        >
          Aktívne </v-chip
        ><v-chip
          @click="filterTodoItems('completed'), (filteredOption = 'completed')"
          :variant="filteredOption === 'completed' ? 'elevated' : 'tonal'"
        >
          Dokončené
        </v-chip>
        <div>
          <SearchTodo />
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

.planner-chips {
  margin-top: 0.5rem;
}
.planner-chips span {
  margin-right: 0.25em;
  cursor: pointer;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
