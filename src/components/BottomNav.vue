<template>
  <v-bottom-navigation app fixed v-model="activeItem" color="primary" grow>
    <v-btn value="top" :to="{ path: '/points' }">
      <span>Точки</span>
      <v-badge
        :content="countPoints"
        :value="countPoints"
        color="green"
        overlap
        offset-x="8"
        offset-y="16"
      >
        <v-icon>mdi-domain</v-icon>
      </v-badge>
    </v-btn>

    <v-btn value="tasks" :to="{ path: '/tasks' }">
      <span>Задачи</span>
      <v-badge
        :content="countTasks"
        :value="countTasks"
        color="green"
        overlap
        offset-x="8"
        offset-y="16"
      >
        <v-icon>mdi-list-box</v-icon>
      </v-badge>
    </v-btn>
    <v-btn @click="clear()">
      <span>Настройки</span>
      <v-icon>mdi-information</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue';
import { filter } from 'lodash';

export default Vue.extend({
  name: 'BottomNav',

  data: () => ({
    activeItem: 'top',
    messages: 0,
  }),
  computed: {
    countPoints() {
      return this.$store.state.points.length;
    },
    countTasks() {
      return filter(this.$store.state.tasks, (task) => !task.completed).length;
    },
  },
  methods: {
    clear() {
      window.localStorage.clear();
    },
  },
});
</script>

<style scoped>
.v-btn {
  letter-spacing: normal;
}
</style>
