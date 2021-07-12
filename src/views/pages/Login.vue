<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="success">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert v-show="isError" type="error" text>
                {{ isErrosMsg }}
              </v-alert>
              <v-form v-model="valid" lazy-validation>
                <v-text-field
                  v-model="email"
                  label="email"
                  type="text"
                  outlined
                  color="success"
                  :rules="rules.email"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="password"
                  type="password"
                  outlined
                  color="success"
                  :rules="rules.password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :loading="loading" color="success" @click="login"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import GlobalVarConfig from "../../config/globalVariable";
import axios from "axios";

export default {
  name: "Login",
  props: {
    source: String,
  },
  data() {
    return {
      isError: false,
      loading: false,
      isErrosMsg: "",
      valid: true,
      email: "",
      password: "",
      rules: {
        email: [(v) => !!v || "email is required"],
        password: [(v) => !!v || "password is required"],
      },
    };
  },
  methods: {
    login() {
      this.loading = true;
      if (this.email === "" || this.password === "") {
        this.isError = true;
        this.isErrosMsg = "email & password can't be empty";

        setTimeout(() => {
          this.isError = false;
        }, 2000);
        this.loading = false;
        return;
      }
      axios
        .post(`${GlobalVarConfig.API_URL}/login`, {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.loading = false;
          const token = response.data.data.access_token;
          const user = response.data.data.user;
          this.$store.dispatch("login", { token, user });
          this.$router.push("/");
        })
        .catch((error) => {
          this.isError = true;
          this.isErrosMsg = error?.response?.data?.meta?.message;
          this.loading = true;

          setTimeout(() => {
            this.isError = false;
            this.loading = false;
          }, 2000);
        });
    },
  },
};
</script>

<style scoped></style>
