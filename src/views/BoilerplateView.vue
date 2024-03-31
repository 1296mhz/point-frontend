<template>
  <div class="Boilerplate">
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "BoilerplateView",
  components: {},
  methods: {
    ...mapActions(["setTitle"]),
  },
  async mounted() {
    this.$log.info("Boilerplate!");
    await this.setTitle("Boilerplate");
  },
});