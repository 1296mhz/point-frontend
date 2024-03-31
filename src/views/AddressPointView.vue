<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="getterAddresses"
      sort-by="createdAt"
      class="elevation-1"
      :items-per-page="7"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Адреса точек</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Новая точка
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="addressObject.address"
                        label="Адрес точки"
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
                <v-btn color="blue darken-1" text @click="save">
                  Сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Вы уыерены что хотите удалить ?</v-card-title
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
          </v-dialog> -->
        </v-toolbar>
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ convertDate(item.createdAt) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
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
import { mapGetters, mapActions } from 'vuex';
// import { map, findIndex, find, matches } from 'lodash';
export default {
  name: 'AddressPointView',
  data: () => ({
    selected: [],
    prevSelectedCounter: 0,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 80) || 'Name must be less than 40 characters',
    ],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Дата', value: 'createdAt' },
      { text: 'Адрес точки', value: 'address' },
      { text: 'Действие', value: 'actions', sortable: false },
    ],
    statusEdit: false,
    addressObject: {
      _id: '',
      address: '',
      createdAt: '',
      updatedAt: '',
    },
    address: '',
    editedIndex: -1,
    editedItem: {
      pointAddress: '',
    },
    defaultItem: {
      pointAddress: '',
    },
  }),
  computed: {
    ...mapGetters(['getterUser', 'getterAddresses']),
    formTitle() {
      return this.editedIndex === -1 ? 'Новый' : 'Редактирование';
    },
  },
  methods: {
    ...mapActions([
      'setMessage',
      'setError',
      'setTitle',
      'setLoading',
      'addAddressPoint',
      'findAddressPoint',
      'updatePointsToCheck',
      'removeAddressPoint'
    ]),
    convertDate(date) {
      var newDate = new Date(date);
      return newDate.toISOString().split('T')[0];
    },
    editItem(item) {
      this.statusEdit = true;
      this.addressObject = {
        _id: item._id,
        address: item.address,
      };
      this.dialog = true;
    },

    async deleteItem(item) {
      await this.removeAddressPoint(item._id);
      await this.findAddressPoint();
      this.dialogDelete = true;
    },

    deleteItemConfirm(item) {
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(async () => {
        await this.findAddressPoint();
        this.addressObject = {
          _id: '',
          address: '',
          createdAt: '',
          updatedAt: '',
        };
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        // this.editedItem = Object.assign({}, this.defaultItem);
        // this.editedIndex = -1;
      });
    },

    async save() {
      if (this.statusEdit) {
        await this.updatePointsToCheck(this.addressObject);
        await this.findAddressPoint();
        this.addressObject = {
          _id: '',
          address: '',
          createdAt: '',
          updatedAt: '',
        };
        this.statusEdit = false;
      } else {
        await this.addAddressPoint({
          address: this.addressObject.address,
        });
        await this.findAddressPoint();
        this.addressObject = {
          _id: '',
          address: '',
          createdAt: '',
          updatedAt: '',
        };
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
    await this.findAddressPoint();
    await this.setLoading(false);
    await this.setLoading(true);
  },
};
</script>
