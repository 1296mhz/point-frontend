<template>
  <div>
    <v-navigation-drawer app fixed clipped width="300">
      <v-list subheader>
        <v-subheader>Менеджеры</v-subheader>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item
            v-for="manager in this.getterManagers"
            :key="manager._id"
          >
            <v-list-item-content>
              <v-list-item-title
                @click="selectManager(manager)"
                v-text="
                  `${manager.lastName} ${manager.firstName} ${manager.middleName}`
                "
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon> </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-row>
      <v-card v-show="selectedItem === -1" class="mx-auto" max-width="500">
        <v-card-title>Выберите менеджера</v-card-title>
      </v-card>
      <v-card v-show="selectedItem !== -1" class="mx-auto" max-width="500">
        <v-list class="transparent">
          <v-list-item>
            <v-row justify="center">
              <v-date-picker
                v-model="dates"
                multiple
                readonly
                full-width
              ></v-date-picker>
            </v-row>
          </v-list-item>
          <v-list-item>
            <v-card-subtitle
              >Адрес точки: {{ manager.pointAddress.address }}</v-card-subtitle
            >
            <v-row>
              <!-- <v-list-item-title
                >{{ manager.lastName }} {{ manager.firstName }}
                {{ manager.middleName }}</v-list-item-title
              > -->

              <!-- <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon> -->

              <!-- <v-list-item-subtitle class="text-right">
              {{ manager.pointAddress.address }}
            </v-list-item-subtitle> -->

              <!-- <v-list-item-subtitle class="text-right">
              Taking:
            </v-list-item-subtitle> -->
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-row>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions, mapMutations } from 'vuex';
// import { map, findIndex, find, matches } from 'lodash';

export default {
  name: 'ReportsView',
  data: () => ({
    dates: ['2019-09-10', '2019-09-20'],
    selectedItem: -1,
    time: 0,
    cards: [],
    manager: {
      _id: '',
      username: '',
      firstName: '',
      lastName: '',
      middleName: '',
      pointAddress: {
        _id: '',
        address: '',
      },
      createdAt: '',
      updatedAt: '',
      role: '',
    },
    tree: [],
    active: [],
    avatar: null,
    open: [],
    managers: [],
    action: null,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 80) || 'Name must be less than 40 characters',
    ],
  }),
  computed: {
    ...mapGetters([
      'getterUser',
      'getterUsers',
      'getterReports',
      'getterManagers',
    ]),
    fullName() {
      return `${this.getterUser.lastName} ${this.getterUser.firstName} ${this.getterUser.middleName}`;
    },
    // selected(item) {
    //   console.log(item);
    //   console.log(this.active);
    //   if (!this.active.length) return undefined;

    //   const _id = this.active[0];
    //   console.log(_id);
    //   // console.log(
    //   //   this.managers.find((manager) => {
    //   //     console.log(manager);
    //   //     console.log(_id);
    //   //     return manager._id === _id;
    //   //   })
    //   // );
    //   // return this.managers.find((manager) => manager._id === _id);
    // },
  },
  methods: {
    ...mapActions([
      'setMessage',
      'setError',
      'setTitle',
      'setLoading',
      'addReport',
      'editReport',
      'findUsers',
      'findAddressPoint',
      'findReports',
      'findManagers',
    ]),
    ...mapMutations(['setUsers']),
    convertDate(date) {
      var newDate = new Date(date);
      return newDate.toISOString().split('T')[0];
    },
    async fetchManagers(item) {
      await this.findManagers();
      item.children.push(...this.getterManagers);
      return true;
    },
    randomAvatar() {
      this.avatar = avatars[Math.floor(Math.random() * avatars.length)];
    },
    selectManager(item) {
      this.manager = { ...item };
      console.log(item);
    },
  },
  watch: {
    // selected: 'randomAvatar',
  },
  created() {},
  async mounted() {
    this.$log.info('Reports!');
    await this.setTitle('Отчёты по менеджерам');
    await this.setLoading(false);
    await this.findManagers();
    await this.setLoading(true);
  },
};
</script>
