<template>
  <div>
    <v-list style="overflow-y: scroll">
      <!-- <v-autocomplete
        v-model="selectPoint"
        :loading="loading"
        :items="points"
        :search-input.sync="search"
        cache-items
        class="mx-4"
        flat
        hide-no-data
        hide-details
        label="Найти?"
        solo-inverted
      ></v-autocomplete> -->
      <v-list-item-group
        color="primary"
        v-model="selected"
        active-class="pink--text"
      >
        <v-list three-line>
          <template v-for="(item, index) in points">
            <!-- <v-divider :key="index"></v-divider> -->
            <v-list-item :key="item.name">
              <v-list-item-avatar>
                <v-img
                  :src="`${apiHost}${item.avatar}`"
                  light
                  @click="openDialogEditObject(item)"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.orgName"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.address"
                ></v-list-item-subtitle>
                <v-list-item-subtitle
                  v-html="item.codeOfObject"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-list-item-group>
    </v-list>
    <v-speed-dial
      v-model="fab"
      fixed
      fab
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      :direction="direction"
      :open-on-hover="hover"
      :transition="transition"
      class="mb-12"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="pink" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-playlist-check </v-icon>
        </v-btn>
      </template>
      <v-btn
        v-if="selected != null"
        fab
        dark
        small
        color="green"
        @click="openDialogEditObject(selectedPoint)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="selected == null"
        fab
        dark
        small
        color="indigo"
        @click="openDialogNewObject()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn
        v-if="selected != null"
        fab
        dark
        small
        color="red"
        @click="deletePoint(selectedPoint)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-dialog
      v-model="dialogNewObject"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogNewObject = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ addPointTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveNewObject()"> Сохранить </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <!-- <v-subheader>Новый обьект</v-subheader> -->
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="orgName"
                :counter="10"
                :rules="nameRules"
                label="Наименование организации"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="codeOfObject"
                :counter="10"
                label="Номер объекта"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="sim" label="Номер sim"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="address"
                label="Адрес обслуживания"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-select
                v-model="districtObject"
                :items="districts"
                item-text="text"
                item-value="_id"
                return-object
                :rules="[(v) => !!v || 'Item is required']"
                label="Район"
                required
              ></v-select>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="fireSafetyOfficer"
                label="Ответственный за пожарную безопасность"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="employee" label="Сотрудник"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="paperAct"
                label="Акт бумажный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="electronicAct"
                label="Акт электронный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list three-line>
                <v-subheader>Ремарки</v-subheader>
                <v-textarea
                  v-model="note"
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Введи текст."
                  value="Описание обьекта."
                ></v-textarea>
              </v-list>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="maintain"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Обслуживать</v-list-item-title>
              <v-list-item-subtitle
                >На данный момент отбьект не требуется
                проверять</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogEditObject"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogEditObject = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Редактрировать обьект</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveEditObject()"> Сохранить </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Редактируемый обьект</v-subheader>
          <v-list-item class="justify-center">
            <v-avatar color="orange" size="128">
              <v-img :src="`http://localhost:4000${avatarValue}`" light>
                <v-file-input
                  hide-input
                  v-model="avatarFile"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an avatar"
                  prepend-icon="mdi-camera"
                  label="Avatar"
                  @change="saveEditAvatar()"
                ></v-file-input
              ></v-img>
            </v-avatar>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="orgName"
                :counter="10"
                :rules="nameRules"
                label="Наименование организации"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="codeOfObject"
                :counter="10"
                label="Номер объекта"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="sim" label="Номер sim"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="address"
                label="Адрес обслуживания"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-select
                v-model="districtObject"
                :items="districts"
                item-text="text"
                item-value="_id"
                :rules="[(v) => !!v || 'Item is required']"
                label="Район"
                required
                return-object
              ></v-select>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="fireSafetyOfficer"
                label="Ответственный за пожарную безопасность"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field v-model="employee" label="Сотрудник"></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="paperAct"
                label="Акт бумажный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="electronicAct"
                label="Акт электронный"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list three-line>
                <v-subheader>Ремарки</v-subheader>
                <v-textarea
                  v-model="note"
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Введи текст."
                  value="Описание обьекта."
                ></v-textarea>
              </v-list>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item>
            <v-list-item-content>
              <v-textarea
                v-model="remarks"
                label="Пометка"
                required
              ></v-textarea>
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content> </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="maintain"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Обслуживать</v-list-item-title>
              <v-list-item-subtitle
                >На данный момент отбьект не требуется
                проверять</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="enable"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Пометить на удаление</v-list-item-title>
              <v-list-item-subtitle
                >По умолчанию не будет отображаться в
                списке.</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogForAddingToTask" max-width="500px">
      <v-card>
        <v-card-title> Добавление в задачу </v-card-title>
        <v-card-text>
          <v-select
            v-model="task"
            :items="tasks"
            label="Добавить в задачу"
            item-text="taskDate"
            item-value="_id"
            return-object
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogForAddingToTask = false">
            Закрыть
          </v-btn>
          <v-btn color="primary" text @click="addToTask()"> Сохранить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { filter } from 'lodash';

export default {
  components: {},
  data: () => ({
    direction: 'top',
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: 'slide-y-reverse-transition',
    selected: null,
    addPointTitle: 'Новая точка',
    _id: '',
    selectPoint: null,
    hidden: false,
    dialogNewObject: false,
    dialogEditObject: false,
    dialogForAddingToTask: false,
    sound: true,
    widgets: false,
    maintain: false,
    valid: true,
    avatarValue: null,
    orgName: '',
    codeOfObject: 0,
    sim: '',
    address: '',
    avatarFile: null,
    districtObject: null,
    district: null,
    fireSafetyOfficer: '',
    employee: '',
    paperAct: '',
    electronicAct: '',
    codeOfObject: 0,
    note: "",
    contact: '',
    uuid: '',
    enable: null,
    task: null,
    items: [],
    search: null,
    select: null,
    loading: false,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 80) || 'Name must be less than 40 characters',
    ],
    apiHost: process.env.VUE_APP_BACKEND_API_URI,
  }),
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  computed: {
    ...mapGetters({
      districts: 'getterDistricts',
      points: 'getterPoints',
      draft: 'getterDraft',
      getterPoint: 'getterPoint',
    }),
    tasks() {
      return this.$store.state.tasks;
    },
    selectedPoint() {
      if (this.selected !== null) {
        return this.$store.state.points[Number(this.selected)];
      } else {
        return null;
      }
    },
  },
  methods: {
    ...mapActions([
      'getPoints',
      'getDistricts',
      'addAvatarPoint',
      'setTitle',
      'setLoading',
      'updateDraft',
      'getDraft',
      'getPoint',
      'removePoint',
    ]),
    convertDate(date) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      var newDate = new Date(date);
      return newDate.toLocaleDateString('RU-ru', options);
    },
    openDialogForAddingToTask(point) {
      this.selectPoint = { ...point };
      this.dialogForAddingToTask = true;
    },
    async openDialogNewObject() {
      const draft = await this.$store.dispatch('getDraft');
      this.orgName = this.draft.orgName;
      this.maintain = this.draft.maintain;
      this.codeOfObject = this.draft.codeOfObject;
      this.sim = this.draft.sim;
      this.note = this.note;
      this.address = this.draft.address;
      this.districtObject = null;
      this.district = this.draft.district;
      this.fireSafetyOfficer = this.draft.fireSafetyOfficer;
      this.employee = this.draft.employee;
      this.paperAct = this.draft.paperAct;
      this.electronicAct = this.draft.electronicAct;
      this.dialogNewObject = true;
    },
    async saveEditAvatar() {
      console.log(this._id);
      let formData = new FormData();
      formData.append(`${this._id}`, this.avatarFile);

      const result = await this.addAvatarPoint(formData);
      formData = null;
      this.avatarFile = null;
    },
    async saveNewObject() {
      const newObject = {
        orgName: this.orgName.trim(),
        maintain: this.maintain,
        codeOfObject: this.codeOfObject,
        sim: this.sim.trim(),
        address: this.address.trim(),
        district: this.districtObject._id,
        fireSafetyOfficer: this.fireSafetyOfficer.trim(),
        employee: this.employee.trim(),
        paperAct: this.paperAct.trim(),
        electronicAct: this.electronicAct.trim(),
        note: this.note,
        maintain: this.maintain,
      };
      if (newObject.orgName && newObject.codeOfObject) {
        try {
          await this.setLoading(false);
          await this.$store.dispatch('addPoint', newObject);
          await this.getPoints();
          await this.setLoading(true);
          this.$store.dispatch('setMessage', 'Сохранено!');
        } catch (error) {
          this.$store.dispatch('setError', 'Ошибка!');
          await this.setLoading(true);
        }
      }
      this.dialogNewObject = false;
    },
    async openDialogEditObject(val) {
      const t = await this.getPoint(val._id);
      this._id = val._id;
      this.avatarValue = this.getterPoint.avatar;
      this.orgName = this.getterPoint.orgName.trim();
      this.maintain = this.getterPoint.maintain;
      this.enable = this.getterPoint.enable;
      this.codeOfObject = this.getterPoint.codeOfObject;
      this.note = this.getterPoint.note;
      this.address = this.getterPoint.address.trim();
      this.district = this.getterPoint.district;
      this.districtObject = this.districts.filter(
        (v) => v._id === val.district
      )[0];
      this.fireSafetyOfficer = this.getterPoint.fireSafetyOfficer.trim();
      this.employee = this.getterPoint.employee.trim();
      this.paperAct = this.getterPoint.paperAct.trim();
      this.electronicAct = this.getterPoint.electronicAct.trim();
      this.sim = this.getterPoint.sim.trim();
      this.dialogEditObject = true;
    },
    async saveEditObject() {
      await this.$store.dispatch('updatePoint', {
        _id: this._id,
        orgName: this.orgName,
        maintain: this.maintain,
        sim: this.sim,
        electronicAct: this.electronicAct,
        paperAct: this.paperAct,
        employee: this.employee,
        enable: this.enable,
        codeOfObject: this.codeOfObject,
        district: this.districtObject._id,
        fireSafetyOfficer: this.fireSafetyOfficer,
        note: this.note,
        address: this.address,
        contact: this.contact,
        enable: this.enable,
      });
      await this.setLoading(false);
      await this.getPoints();
      await this.setLoading(true);
      this.dialogEditObject = false;
    },
    async addToTask() {
      try {
        await this.setLoading(false);
        await this.$store.dispatch('updatePointToTask', {
          task: this.task,
          point: this.selectPoint,
        });
        await this.getPoints();
        await this.setLoading(true);
        this.$store.dispatch('setMessage', 'Сохранено!');
        this.dialogForAddingToTask = false;
        this.selectPoint = null;
      } catch (error) {
        await this.setLoading(true);
        this.$store.dispatch('setError', 'Ошибка!');
      }
    },
    async deletePoint(point) {
      await this.setLoading(false);
      await this.removePoint(point._id);
      await this.getPoints();
      await this.setLoading(true);
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter((e) => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
  },
  async mounted() {
    await this.setLoading(false);
    await this.getDistricts();
    await this.getPoints();
    await this.setLoading(true);
  },
};
</script>

<style>
#oop {
  padding-bottom: 100px;
}

/* This is for documentation purposes and will not be needed in your application */
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
</style>
