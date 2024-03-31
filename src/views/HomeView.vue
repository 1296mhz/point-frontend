<template>
  <List-Points />
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import ListPoints from '../components/ListPoints.vue';

export default Vue.extend({
  name: 'HomeView',
  components: {
    ListPoints,
  },
  methods: {
    ...mapActions(['setTitle']),
  },
  async mounted() {
    this.$log.info('Точки!');
    await this.setTitle('Точки');
  },
});
</script>
