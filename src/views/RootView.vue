<template>
  <v-app id="inspire">
    <v-overlay :value="!loading" opacity="0.46">
      <v-progress-circular
        indeterminate
        :rotate="360"
        :size="100"
        :width="15"
        color="amber"
        >Загрузка</v-progress-circular
      >
    </v-overlay>
    <v-app-bar app color="orange" clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ getterTitle }}</v-toolbar-title>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
      <v-btn @click="exit()" target="_blank" text>
        <!-- <span class="mr-2">Выход</span> -->
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary fixed>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{
            roleToText(getterUser.role)
          }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ getterUser.lastName }} {{ getterUser.firstName }}
            {{ getterUser.middleName }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon v-show="item.roles.includes(getterUser.role)">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-show="item.roles.includes(getterUser.role)">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
  <!-- <BottomNav /> -->
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
// import BottomNav from '../components/BottomNav.vue';

export default Vue.extend({
  name: 'RootView',
  components: {
    // BottomNav,
  },
  data: () => ({
    addPointTitle: '',
    value: 1,
    drawer: false,
    items: [
      {
        title: 'Отчёт по выручке',
        icon: 'receipt_long',
        path: '/',
        roles: ['ADMIN', 'MANAGER'],
      },
      { title: 'Отчеты', icon: 'report', path: '/reports', roles: ['ADMIN'] },
      {
        title: 'Сводный отчёт',
        icon: 'summarize',
        path: '/settings',
        roles: ['ADMIN'],
      },
      {
        title: 'Адреса точек',
        icon: 'contact_mail',
        path: '/addressPoints',
        roles: ['ADMIN'],
      },
      {
        title: 'Пользователи',
        icon: 'group',
        path: '/users',
        roles: ['ADMIN'],
      },
    ],
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
      'getterUser',
    ]),
    loading() {
      return this.$store.state.loading;
    },
  },
  methods: {
    ...(mapActions(['setTitle', 'setLoading', 'logout', 'setMessage']) as any),
    exit() {
      this.logout();
      this.$router.push('/login');
    },
    roleToText(data: string) {
      return data == 'ADMIN' ? 'Администратор' : 'Менеджер';
    },
  },
  async mounted() {
    this.$log.info('Application started!');
    // await this.setTitle('ПРОВЕРОЧНОЕ ЗАДАНИЕ');
    // await this.setMessage('Добро пожаловать!');
    await this.setLoading(false);
    // Убрать это  отсюда
    // await this.getDistricts();
    // await this.getPoints();
    // await this.getTasks();
    await this.setLoading(true);
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
.v-nav-bar {
  left: 0px;
}
/* style="height: 64px;margin-top: 0px;transform: translateY(0px);left: 0px;right: 0px;" */
</style>
