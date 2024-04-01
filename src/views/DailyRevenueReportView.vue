<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="getterReports"
      sort-by="createdAt"
      class="elevation-1"
      :items-per-page="7"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Ежедневные отчёт по выручке</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="newItem({ action: 'new' })"
          >
            Новый отчет
          </v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <!-- <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Новый отчет
              </v-btn>
            </template> -->
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="report.user"
                        :items="getterUsers"
                        label="ФИО менеджера"
                        :item-text="
                          (item) =>
                            `${item.lastName} ${item.firstName} ${item.middleName}`
                        "
                        item-value="_id"
                        return-object
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="report.user.pointAddress.address"
                        label="Адрес точки"
                        disabled
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="report.taking"
                        label="Выручка за день"
                      ></v-text-field>
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
      <template v-slot:[`item.user`]="{ item }">
        {{ item.user.lastName }} {{ item.user.firstName }}
        {{ item.user.middleName }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem({ action: 'edit', item: item })"
        >
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions, mapMutations } from 'vuex';
// import { map, findIndex, find, matches } from 'lodash';
export default {
  name: 'DailyRevenueReportView',
  data: () => ({
    action: null,
    selected: [],
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 80) || 'Name must be less than 40 characters',
    ],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Дата', value: 'createdAt' },
      { text: 'ФИО менеджера', value: 'user' },
      { text: 'Адрес точки', value: 'address.address' },
      { text: 'Выручка за день', value: 'taking' },
      { text: 'Действие', value: 'actions', sortable: false },
    ],
    report: {
      user: {
        _id: '',
        firstName: '',
        lastName: '',
        middleName: '',
        pointAddress: {
          _id: '',
          address: '',
        },
      },
      taking: 0,
    },
  }),
  computed: {
    ...mapGetters(['getterUser', 'getterUsers', 'getterReports']),
    formTitle() {
      return this.editedIndex === -1 ? 'Новый' : 'Редактирование';
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
      'addReport',
      'editReport',
      'findUsers',
      'findAddressPoint',
      'findReports',
    ]),
    ...mapMutations(['setUsers']),
    convertDate(date) {
      var newDate = new Date(date);
      return newDate.toISOString().split('T')[0];
    },

    newItem(item) {
      this.action = item.action;
      this.dialog = true;
    },
    editItem(item) {
      console.log(item);
      this.action = item.action;
      this.report._id = item.item._id;
      this.report.user = {
        ...item.item.user,
        pointAddress: item.item.address,
      };
      this.report.taking = item.item.taking;
      this.dialog = true;
    },

    deleteItem(item) {
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {});
    },

    async save() {
      if (this.action === 'new') {
        await this.addReport({
          user: this.report.user._id,
          address: this.report.user.pointAddress._id,
          taking: this.report.taking,
        });
        this.report = {
          user: {
            _id: '',
            firstName: '',
            lastName: '',
            middleName: '',
            pointAddress: {
              _id: '',
              address: '',
            },
          },
          taking: 0,
        };
        await this.findReports();
      }

      if (this.action === 'edit') {
        await this.editReport({
          _id: this.report._id,
          user: this.report.user._id,
          address: this.report.user.pointAddress._id,
          taking: this.report.taking,
        });
        this.report = {
          user: {
            _id: '',
            firstName: '',
            lastName: '',
            middleName: '',
            pointAddress: {
              _id: '',
              address: '',
            },
          },
          taking: 0,
        };
        await this.findReports();
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
    this.$log.info('Выбор точек для проверки!');
    await this.setTitle('Выбор точек для проверки');
    await this.setLoading(false);
    if (this.getterUser.role === 'MANAGER') {
      this.report.user = this.getterUser;
      this.setUsers([this.getterUser]);
      await this.findReports();
    }
    if (this.getterUser.role === 'ADMIN') {
      this.report.user = this.getterUser;
      await this.findUsers();
      await this.findAddressPoint();
      await this.findReports();
    }
    await this.setLoading(true);
  },
};
</script>
