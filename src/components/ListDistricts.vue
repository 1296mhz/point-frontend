<template>
  <div>
    <v-list style="overflow-y: scroll">
      <v-list-item-group
        color="primary"
        v-model="selected"
        active-class="pink--text"
      >
        <v-list three-line>
          <template v-for="(item, index) in districts">
            <!-- <v-divider :key="index"></v-divider> -->
            <v-list-item :key="item.name">
              <v-list-item-avatar>
                <v-img
                  :src="`${apiHost}${item.avatar}`"
                  light
                  @click="openDialogEditDistrict(item)"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.description"
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
        @click="openDialogEditDistrict(selectedPoint)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="selected == null"
        fab
        dark
        small
        color="indigo"
        @click="openDialogNewDistrict()"
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
      v-model="dialogNewDistrict"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="orange">
          <v-btn icon dark @click="dialogNewDistrict = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ addPointTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveNewDistrict()"> Сохранить </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <!-- <v-subheader>Hban обьект</v-subheader> -->

          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="name"
                :counter="10"
                :rules="nameRules"
                label="Название района"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-textarea
                v-model="description"
                rows="3"
                :counter="1000"
                label="Описание"
                required
              ></v-textarea>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="inTheTrashCan"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Обслуживать</v-list-item-title>
              <v-list-item-subtitle
                >На данный момент обьект не требуется
                проверять</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogEditDistrict"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="orange">
          <v-btn icon dark @click="dialogEditDistrict = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Редактрировать район</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveEditDistrict()"> Сохранить </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Редактируемый район: {{ name }}</v-subheader>
          <v-list-item class="justify-center">
            <!-- <v-badge bordered color="error" icon="mdi-lock" overlap> -->
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
            <!-- </v-badge> -->
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-text-field
                v-model="name"
                :counter="10"
                :rules="nameRules"
                label="Название района"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-textarea
                v-model="description"
                rows="3"
                :counter="1000"
                label="Описание"
                required
              ></v-textarea>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-rating
                :value="rating"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>
              <v-slider max="5" min="0" v-model="rating" thumb-label></v-slider>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>Прочее</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="enable"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Скрыть</v-list-item-title>
              <v-list-item-subtitle
                >Не будет отображаться в списке точек.</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex';

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
    addPointTitle: 'Новый район',
    _id: '',
    selectPoint: null,
    hidden: false,
    dialogNewDistrict: false,
    dialogEditDistrict: false,
    dialogForAddingToTask: false,
    sound: true,
    widgets: false,
    valid: true,
    avatar: '',
    avatarFile: null,
    avatarValue: null,
    name: '',
    description: '',
    rating: 0,
    inTheTrashCan: false,
    notes: [],
    contact: '',
    uuid: '',
    enable: null,
    task: null,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 80) || 'Name must be less than 40 characters',
    ],
    apiHost: process.env.VUE_APP_BACKEND_API_URI,
  }),
  computed: {
    ...mapGetters({
      districts: 'getterDistricts',
      district: 'getterDistrict',
    }),
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
      'getDistricts',
      'getDistrict',
      'updateDistrict',
      'addDistrict',
      'addAvatarDistrict',
      'setMessage',
      'setError',
      'setTitle',
      'setLoading',
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
    converterLink(model) {
      return `${precess.env.VUE_APP_BACKEND_API_URI}${model}`;
    },
    async openDialogNewDistrict() {
      this.avatar = '';
      this.name = '';
      this.description = '';
      this.rating = 0;
      this.inTheTrashCan = false;
      this.dialogNewDistrict = true;
    },
    async saveNewDistrict() {
      const newObject = {
        name: this.name.trim(),
        description: this.description.trim(),
        rating: Number(this.rating),
        inTheTrashCan: this.inTheTrashCan,
      };

      try {
        await this.setLoading(false);
        await this.addDistrict(newObject);
        await this.getDistricts();
        await this.setLoading(true);
        await this.setMessage('Сохранено!');
      } catch (error) {
        await this.setError(`Ошибка! ${error}`);
        await this.setLoading(true);
      }

      this.dialogNewDistrict = false;
    },
    async openDialogEditDistrict(val) {
      this.dialogEditDistrict = true;
      await this.getDistrict(val._id);
      this._id = val._id;
      this.avatarValue = this.district.avatar;
      this.name = this.district.name.trim();
      this.description = this.district.description.trim();
      this.rating = Number(this.district.rating);
      this.inTheTrashCan = this.district.inTheTrashCan;
    },
    async saveEditAvatar() {
      let formData = new FormData();
      formData.append(`${this._id}`, this.avatarFile);

      const result = await this.addAvatarDistrict(formData);
      formData = null;
      this.avatarFile = null;
    },
    async saveEditDistrict() {
      await this.updateDistrict({
        _id: this._id,
        name: this.name,
        description: this.description,
        rating: Number(this.rating),
        inTheTrashCan: this.inTheTrashCan,
      });

      await this.setLoading(false);
      await this.getDistricts();
      await this.setLoading(true);
      this.dialogEditDistrict = false;
    },
    async deleteDistrict(district) {
      await this.setLoading(false);
      // await this.removePoint(point._id);
      // await this.getPoints();
      await this.setLoading(true);
    },
  },
  async mounted() {
    await this.setLoading(false);
    await this.getDistricts();
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
