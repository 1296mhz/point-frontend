<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row justify="center">
          <v-col cols="10" sm="5" md="3" lg="3">
            <!-- <div class="d-flex flex-column justify-space-between align-center">
              <v-img
                lazy-src="../assets/logo.png"
                max-height="100"
                max-width="100"
                src="../assets/logo.png"
              ></v-img>
            </div> -->
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                outlined
                dense
                v-model="username"
                :counter="20"
                :rules="nameRules"
                label="Username"
                required
              ></v-text-field>

              <v-text-field
                outlined
                dense
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn
                block
                outlined
                :loading="loading"
                color="indigo"
                @click="sendCredentials"
              >
                Вход
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Snackbar -->
    <v-snackbar v-model="errorBar" color="error">
      {{ lastError }}
      <v-btn @click="errorBar = false" dark text>Close</v-btn>
    </v-snackbar>
    <v-footer app>
      <v-col class="text-end" cols="12"> </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
export default Vue.extend({
  name: 'LoginView',
  components: {},
  data: () => ({
    loading: false,
    valid: true,
    email: null,
    username: '',
    password: '',
    errorBar: false,
    progressBar: false,
    logoImageHeight: 75,
    logoImageWidth: 75,
    nameRules: [
      (v: any) => !!v || 'Username is required',
      (v: any) =>
        (v && v.length <= 20) || 'Username must be less than 20 characters',
    ],
    passwordRules: [
      (v: any) => !!v || 'Password is required',
      (v: any) =>
        (v && v.length <= 20) || 'Password must be less than 20 characters',
    ],
  }),
  methods: {
    ...mapActions(['setTitle', 'login', 'setError']),
    async sendCredentials() {
      this.loading = true;
      const authResult = await this.login({
        username: this.username.trim(),
        password: this.password.trim(),
      });
      if (authResult) {
        this.loading = false;
        this.$router.push('/DailyRevenueReport');
      } else {
        this.loading = false;
        return false;
      }
    },
  },
  computed: {
    ...mapGetters({
      lastError: 'lastError',
    }),
  },
  async mounted() {
    this.$log.info('Вход!');
    await this.setTitle('Вход');
  },
});
</script>
