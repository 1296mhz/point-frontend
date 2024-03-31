<template>
  <div class="text-center">
    <v-app>
      <router-view></router-view>
      <v-snackbar v-model="errorBar" color="error">
        {{ lastError }}
        <template v-slot:action="{ attrs }">
          <v-btn color="indigo" text v-bind="attrs" @click="errorBar = false">
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar v-model="messageBar" :timeout="timeout" color="teal">
        {{ lastMessage }}
        <v-btn @click="messageBar = false" dark text>Закрыть</v-btn>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'App',
  components: {},
  data: () => ({
    addPointTitle: '',
    value: 1,
    drawer: false,
    errorBar: false,
    messageBar: false,
    timeout: 10000,
  }),
  computed: {
    ...mapGetters([
      'lastError',
      'errorsCount',
      'lastMessage',
      'messagesCount',
      'getterTitle',
    ]),
    loading() {
      return this.$store.state.loading;
    },
  },
  methods: {
    ...mapActions([
      'getDistricts',
      'setTitle',
      'setLoading',
      'getPoints',
      'getTasks',
    ]),
  },
  async mounted() {
    this.$log.info('Загрука...!');
    // navigator.serviceWorker.addEventListener('message', (msg) => {
    //   this.$log.info('Сообщение от сервис воркера: ');
    //   this.$log.info(msg);
    // });
    // await this.setTitle('Загрука...');
    // await this.setLoading(false);
    // await this.getDistricts();
    // await this.getPoints();
    // await this.getTasks();
    // await this.setLoading(true);
  },
  watch: {
    errorsCount: function () {
      this.errorBar = true;
    },
    messagesCount: function () {
      this.messageBar = true;
    },
  },
});
</script>

<style>
#app .v-bottom-navigation .v-btn {
  height: inherit !important;
}
.v-progress-circular {
  margin: 1rem;
}
</style>
