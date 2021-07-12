<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      color="grey lighten-4"
      app
    >
      <v-list-item class="px-2">
        <v-list-item-title>Dashboard Admin Mobile Apps</v-list-item-title>

        <!-- <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn> -->
      </v-list-item>

      <v-divider></v-divider>

      <v-card class="mx-auto" width="300">
        <v-list dense>
          <div v-for="item in menus" :key="item.id">
            <!-- start menu parent no child  -->
            <v-list-item v-if="item.sub.length === 0" link>
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-title
                ><router-link
                  style="display: inline-block;text-decoration:none;color:#616161"
                  :to="item.link"
                  >{{ item.name }}</router-link
                ></v-list-item-title
              >
            </v-list-item>
            <!-- end menu parent no child  -->

            <!-- start menu parent had a child  -->
            <v-list-group
              v-if="item.sub.length > 0"
              :value="false"
              :prepend-icon="item.icon"
            >
              <template v-slot:activator>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </template>

              <v-list-group
                :disabled="itemSub.sub.length === 0"
                v-for="itemSub in item.sub"
                :key="itemSub.id"
                :value="false"
                no-action
                sub-group
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <router-link
                      style="display: inline-block;text-decoration:none;color:#616161"
                      :to="itemSub.sub.length > 0 ? '#' : itemSub.link"
                    >
                      <v-list-item-title>{{ itemSub.name }}</v-list-item-title>
                    </router-link>
                  </v-list-item-content>
                </template>

                <v-list-item
                  v-for="itemSubtwo in itemSub.sub"
                  :key="itemSubtwo.id"
                  link
                >
                  <v-list-item-title> {{ itemSubtwo.name }} </v-list-item-title>

                  <!-- <v-list-item-icon>
                    <v-icon>{{itemSubtwo.icon}}</v-icon>
                  </v-list-item-icon> -->
                </v-list-item>
              </v-list-group>
            </v-list-group>
            <!-- end menu parent had a child  -->
          </div>
        </v-list>
      </v-card>
      <!--       
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              ><router-link
                style="display: inline-block;text-decoration:none;color:#616161"
                :to="item.link"
                >{{ item.title }}</router-link
              ></v-list-item-title
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list> -->
    </v-navigation-drawer>

    <v-app-bar height="48" color="grey lighten-4" app>
      <v-app-bar-nav-icon @click.stop="mini = !mini"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item-avatar v-bind="attrs" v-on="on" right>
            <v-img :src="user.profile_photo_url"></v-img>
          </v-list-item-avatar>
          <p class="mt-4">{{ user.name }}</p>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-icon small>fas fa-user</v-icon> My Profile
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon small>fas fa-key</v-icon> Log Out
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
import GlobalVarConfig from "../../config/globalVariable";

export default {
  name: "App",

  data() {
    return {
      drawer: true,
      mini: false,
      user: "",
      menus: [],
    };
  },
  mounted() {
    this.user = this.$store.getters.getUser;
    axios
      .get(`${GlobalVarConfig.API_URL}/menu-recursive`)
      .then((response) => {
        this.menus = response.data;
      })
      .catch((error) => {
        // commit("SET_MENU", []);
      });
  },
  created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>
