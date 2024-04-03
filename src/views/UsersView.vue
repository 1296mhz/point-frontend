<template>
  <div>
    <v-main>
      <v-data-table
        :headers="headers"
        :items="getterUsers"
        sort-by="createdAt"
        class="elevation-1"
        :items-per-page="7"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Управление пользователями</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="newUser({ action: 'new' })"
            >
              Новый пользователь</v-btn
            >
            <v-dialog v-model="dialog" max-width="500px">
              <!-- <template v-slot:activator="{ on, attrs }"> -->
              <!-- <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Новый пользователь
              </v-btn> -->
              <!-- </template> -->
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.username"
                          label="Логин"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.password"
                          label="Пароль"
                          :disabled="isResetPassword"
                        >
                          <!-- <template v-slot:append-outer>
                          <v-slide-x-reverse-transition mode="out-in">
                            <v-icon
                              :key="`icon-${isEditing}`"
                              :color="isEditing ? 'success' : 'info'"
                              @click="isEditing = !isEditing"
                              v-text="
                                isEditing
                                  ? 'mdi-check-outline'
                                  : 'mdi-circle-edit-outline'
                              "
                            ></v-icon>
                          </v-slide-x-reverse-transition>
                        </template> -->
                        </v-text-field>
                        <v-btn
                          v-show="title === 'edit'"
                          class="ma-2"
                          outlined
                          @click="isResetPassword = !isResetPassword"
                          >Сброс пароля</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.lastName"
                          label="Фамилия"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.firstName"
                          label="Имя"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.middleName"
                          label="Отчество"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="role"
                          :items="roles"
                          label="Роль"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          v-model="address"
                          :items="getterAddresses"
                          label="Адрес"
                          item-text="address"
                          item-value="_id"
                          return-object
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Отмена
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Вы уыерены что хотите удалить этот отчет?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Отмена</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ convertDate(item.createdAt) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editUser({ item: item, action: 'edit' })"
          >
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template> -->
      </v-data-table>
    </v-main>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex';
import { map, findIndex, find, matches } from 'lodash';
export default {
  name: 'UsersView',
  data: () => ({
    address: null,
    role: null,
    roles: ['ADMIN', 'MANAGER'],
    isResetPassword: true,
    title: 'new',
    prevSelectedCounter: 0,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 80) || 'Name must be less than 40 characters',
    ],
    dialog: false,
    dialogDelete: false,
    isEditing: false,
    model: null,
    headers: [
      { text: 'Дата', value: 'createdAt' },
      { text: 'Логин', value: 'username' },
      { text: 'Фамилия', value: 'lastName' },
      { text: 'Имя', value: 'firstName' },
      { text: 'Отчество', value: 'middleName' },
      { text: 'Адрес точки', value: 'pointAddress.address' },
      { text: 'Действие', value: 'actions', sortable: false },
    ],
    reports: [],
    editedIndex: -1,
    editedItem: {
      username: '',
      firstName: '',
      lastName: '',
      middleName: '',
      pointAddress: '',
      role: '',
      password: '',
    },
    defaultItem: {
      username: '',
      firstName: '',
      lastName: '',
      middleName: '',
      pointAddress: '',
      role: 'MANAGER',
      password: '',
    },
  }),
  computed: {
    ...mapGetters(['getterUser', 'getterUsers', 'getterAddresses']),
    formTitle() {
      return this.title === 'new' ? 'Новый' : 'Редактирование';
    },
    fullName() {
      return `${this.getterUser.lastName} ${this.getterUser.firstName} ${this.getterUser.middleName}`;
    },
  },
  methods: {
    ...mapActions([
      'setMessage',
      'setError',
      'setTitle',
      'setLoading',
      'findUsers',
      'addUser',
      'findAddressPoint',
      'updateUser',
    ]),
    convertDate(date) {
      var newDate = new Date(date);
      const _date = newDate.toISOString().split('T')[0];
      const _time = newDate.toISOString().split('T')[1].split('.')[0];
      return `${_date} ${_time}`;
    },
    editUser(item) {
      this.title = item.action;
      this.isResetPassword = true;
      this.defaultItem = {
        _id: item.item._id,
        username: item.item.username,
        firstName: item.item.firstName,
        lastName: item.item.lastName,
        middleName: item.item.middleName,
        pointAddress: item.item.pointAddress.address,
      };
      this.address = item.item.pointAddress;
      (this.role = item.item.role), (this.dialog = true);
    },
    async newUser(item) {
      this.title = item.action;
      this.isResetPassword = false;
      this.defaultItem = {
        username: '',
        firstName: '',
        lastName: '',
        middleName: '',
        pointAddress: '',
        password: '',
        role: 'MANAGER',
      };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.reports.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.reports.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.title === 'new') {
        await this.addUser({
          ...this.defaultItem,
          role: this.role,
          pointAddress: this.address._id,
        });
        await this.findUsers();
      }
      if (this.title === 'edit') {
        await this.updateUser({
          ...this.defaultItem,
          role: this.role,
          pointAddress: this.address._id,
        });
        await this.findUsers();
      }
      this.close();
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {},
  async mounted() {
    this.$log.info('Управление пользователями');
    await this.setTitle('Управление пользователями');
    await this.setLoading(false);
    await this.findUsers();
    await this.findAddressPoint();
    await this.setLoading(true);
  },
};
</script>
