<template>
  <v-card class="flexcard" height="100%">
    <v-row class="pa-4" justify="space-between">
      <v-col cols="3">
        <v-treeview
          v-model="tree"
          :active.sync="active"
          :items="items"
          :load-children="fetchManagers"
          :open.sync="open"
          activatable
          color="warning"
          open-on-click
          transition
          item-key="_id"
          item-text="name"
        >
          <template v-slot:prepend="{ item }">
            <v-icon v-if="!item.children"> mdi-account </v-icon>
            <div class="v-treeview-node__label">
              {{ item.name }}
            </div>
          </template>
          <template v-slot:label="{ item }">
            <div class="v-treeview-node__label">
              {{ item.lastName }} {{ item.firstName }} {{ item.middleName }}
            </div>
          </template>
        </v-treeview>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col class="d-flex text-center">
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="text-h6 grey--text text--lighten-1 font-weight-light"
            style="align-self: center"
          >
            Выбери менеджера
          </div>
          <v-card
            v-else
            :key="selected._id"
            class="pt-6 mx-auto"
            flat
            max-width="400"
          >
            <v-card-text>
              <v-avatar v-if="avatar" size="88">
                <v-img
                  :src="`https://avataaars.io/${avatar}`"
                  class="mb-6"
                ></v-img>
              </v-avatar>
              <!-- <h3 class="text-h5 mb-2">
                  {{ selected.username }}
                </h3> -->
              <!-- <div class="blue--text mb-2">
                  {{ selected.email }}
                </div> -->
              <div class="blue--text subheading font-weight-bold">
                {{ selected.username }}
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <!-- <v-row class="text-left" tag="v-card-text">
                <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                  Company:
                </v-col>
                <v-col>{{ selected.company.name }}</v-col>
                <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                  Website:
                </v-col>
                <v-col>
                  <a :href="`//${selected.website}`" target="_blank">{{
                    selected.website
                  }}</a>
                </v-col>
                <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                  Phone:
                </v-col>
                <v-col>{{ selected.phone }}</v-col>
              </v-row> -->
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions, mapMutations } from 'vuex';
// import { map, findIndex, find, matches } from 'lodash';
const avatars = [
  '?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban',
  '?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun',
  '?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong',
  '?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair',
  '?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly',
];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: 'ReportsView',
  data: () => ({
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
    items() {
      return [
        {
          name: 'Менеджеры',
          children: this.managers,
        },
      ];
    },
    selected(item) {
      console.log(item);
      console.log(this.active);
      if (!this.active.length) return undefined;

      const _id = this.active[0];
      console.log(_id);
      // console.log(
      //   this.managers.find((manager) => {
      //     console.log(manager);
      //     console.log(_id);
      //     return manager._id === _id;
      //   })
      // );
      // return this.managers.find((manager) => manager._id === _id);
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
  },
  watch: {
    // selected: 'randomAvatar',
  },
  created() {},
  async mounted() {
    this.$log.info('Reports!');
    await this.setTitle('Отчёты по менеджерам');
    await this.setLoading(false);
    await this.setLoading(true);
  },
};
</script>
