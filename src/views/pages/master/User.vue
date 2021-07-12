<template>
  <v-container fluid>
    <!-- modal  -->
    <template>
      <template>
        <v-alert v-show="isAlert" outlined :type="alertObj.type" text>
          {{ alertObj.message }}
        </v-alert>
      </template>
      <v-dialog v-model="dialog" :max-width="maxWidthDialogDefault">
        <template v-slot:default="dialog">
          <!-- Edit & Add Data  -->
          <v-card v-if="!actionDelete">
            <v-toolbar color="primary" dark>{{ modal.title }}</v-toolbar>
            <v-card-text>
              <template>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-show="false"
                        v-model="params.id"
                        hidden
                      ></v-text-field>
                      <v-text-field
                        class="mt-4"
                        v-model="params.name"
                        label="Username"
                        persistent-hint
                        outlined
                        :rules="rules.name"
                      ></v-text-field>
                      <v-autocomplete
                        v-model="params.roles"
                        label="Roles"
                        clearable
                        :items="roles"
                        class="mt-4"
                        outlined
                        solo
                        :rules="rules.roles"
                      ></v-autocomplete>
                      <v-text-field
                        class="mt-4"
                        v-model="params.city"
                        label="City"
                        persistent-hint
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="mt-4"
                        v-model="params.email"
                        label="Email"
                        persistent-hint
                        outlined
                        type="Email"
                        :rules="rules.email"
                        max="5"
                      ></v-text-field>
                      <v-text-field
                        class="mt-4"
                        v-model="params.phoneNumber"
                        label="Phone"
                        persistent-hint
                        outlined
                      ></v-text-field>
                      <v-file-input
                        class="mt-4"
                        v-model="params.profile_photo_url"
                        color="primary"
                        counter
                        label="Profile picture"
                        placeholder="Select your files"
                        prepend-icon="mdi-paperclip"
                        outlined
                        :show-size="1000"
                        accept="image/png, image/jpeg, image/jpg"
                        :rules="rules.profile_photo_url"
                      >
                        <template v-slot:selection="{ index, text }">
                          <v-chip color="primary" dark label small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="mt-4"
                        v-model="params.password"
                        label="Password"
                        persistent-hint
                        outlined
                        type="password"
                        :rules="rules.password"
                      ></v-text-field>
                      <v-text-field
                        class="mt-4"
                        v-model="params.houseNumber"
                        label="House Number"
                        persistent-hint
                        outlined
                      ></v-text-field>
                      <v-textarea
                        class="mt-4"
                        outlined
                        v-model="params.address"
                        name="input-7-4"
                        label="Address"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </template>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text color="error" outlined @click="dialog.value = false"
                >Close</v-btn
              >
              <v-btn
                :loading="setLoading"
                color="primary"
                outlined
                text
                @click="actionsApi(actionTo)"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
          <!-- End Edit & Add Data  -->

          <v-card v-if="actionDelete">
            <v-card-title class="text-h5 red lighten-1" text>
              <span style="color:white">Delete Data</span>
            </v-card-title>
            <br />
            <v-card-text>
              Are you sure to delete this data
              <p class="font-weight-black">{{ params.name }} ?</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-end">
              <v-btn text color="error" outlined @click="dialog.value = false"
                >Close</v-btn
              >
              <v-btn
                :loading="setLoading"
                color="primary"
                outlined
                text
                @click="deleteItem(params)"
                >YES</v-btn
              >
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <template>
        <v-snackbar :timeout="2000" top v-model="snackbar">
          {{ snackbarMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </template>
    </template>
    <!-- end modal  -->

    <!-- datatables serverside  -->
    <v-card color="#42b983" tile dark>
      <v-card-title
        ><v-icon>mdi-dots-vertical</v-icon>Master User
        <v-spacer></v-spacer>
        <v-icon @click="refreshTable">fas fa-sync-alt</v-icon>
      </v-card-title>
    </v-card>
    <v-card tile>
      <v-card-title>
        <v-row align="center" justify="end">
          <v-btn @click="addItem" text color="#42b983"
            ><v-icon left>fas fa-plus-square</v-icon> Add New User</v-btn
          >
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            @change="getDataFromApi(search)"
          >
          </v-text-field>
          <v-icon color="red" class="ml-2 mt-4 mr-4" @click="clearSearch"
            >fas fa-window-close</v-icon
          >
        </v-row>
      </v-card-title>
      <br />
      <v-data-table
        :headers="headers"
        :items="dataList"
        :options.sync="options"
        :server-items-length="totalData"
        :loading="loading"
        :loading-text="'retrieving data from server .... '"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item.no="{ item }">
          <v-chip :color="'primary'" dark>
            {{ dataList.indexOf(item) + 1 }}
          </v-chip>
        </template>
        <template v-slot:item.name="{ item }">
          <v-chip>
            {{ item.name }}
          </v-chip>
        </template>
        <template v-slot:item.icon="{ item }">
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon outlined color="primary" class="mr-2" @click="editItem(item)">
            far fa-edit
          </v-icon>
          <v-icon outlined color="error" @click="deleteConfirm(item)">
            far fa-trash-alt
          </v-icon>
        </template>
        <template v-slot:item.profile_photo_url="{ item }">
          <v-img
            :lazy-src="item.profile_photo_url"
            max-height="50"
            max-width="50"
            :src="item.profile_photo_url"
            contain
          ></v-img>
        </template>
      </v-data-table>
    </v-card>
    <!-- end datatables  -->
    <!-- </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import axios from "axios";
import GlobalVarConfig from "../../../config/globalVariable";

export default {
  // name: "Home",
  data() {
    return {
      maxWidthDialogDefault: 1000,
      actionDelete: false,
      actionTo: "",
      alertObj: {
        message: "",
        type: "success",
      },
      isAlert: false,
      setLoading: false,
      snackbar: false,
      snackbarMessage: "",
      Deselect: {
        render: (createElement) => createElement("span", "❌"),
      },
      valid: true,
      params: {
        id: "",
        name: "",
        email: "",
        address: "",
        houseNumber: "",
        phoneNumber: "",
        city: "",
        roles: "",
        profile_photo_url: [],
      },
      dialog: false,
      roles: ["ADMIN", "USER"],
      modal: {
        title: "",
      },
      search: "",
      totalData: 0,
      dataList: [],
      loading: true,
      options: {},
      headers: [
        {
          text: "No.",
          align: "start",
          value: "no",
        },
        {
          text: "User Name",
          align: "start",
          // sortable: false,
          value: "name",
        },
        { text: "Email", value: "email" },
        { text: "Address", value: "address" },
        { text: "City", value: "city" },
        { text: "Phone", value: "phoneNumber" },
        { text: "Phone House", value: "houseNumber" },
        { text: "Roles", value: "roles" },
        { text: "Picture", value: "profile_photo_url" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      rules: {
        name: [(v) => !!v || "Food Name is required"],
        email: [(v) => !!v || "email is required"],
        password: [(v) => !!v || "password is required"],
        roles: [(v) => !!v || "roles is required"],
        profile_photo_url: [
          (v) =>
            v?.size < 2 * 1024 * 1024 ||
            "Picture size should  be less than 2 MB !",
        ],
      },
      ingredients: [],
      tags: [],
      priceDefault: {
        locale: "pt-BR",
        prefix: "Rp",
        suffix: "IDR",
        length: 11,
        precision: 2,
      },
    };
  },
  watch: {
    // options: {
    //   handler() {
    //     this.getDataFromApi();
    //   },
    //   deep: true,
    // },
    // model(val) {
    //   if (val.length > 5) {
    //     this.$nextTick(() => this.model.pop());
    //   }
    // },
    // dialog(val) {
    //   val || this.close();
    // },
  },
  created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    this.getDataFromApi();
  },
  methods: {
    clearParams() {
      this.params = {
        menu_name: "",
      };
      this.dialog = false;
    },
    clearSearch() {
      this.search = "";
    },
    editItem(item) {
      this.maxWidthDialogDefault = 1000;
      this.actionDelete = false;
      this.actionTo = "update";
      console.log(item)
      this.params = {
        id: item.id,
        name: item.name,
        email: item.email,
        address: item.address,
        houseNumber: item.houseNumber,
        phoneNumber: item.phoneNumber,
        password:"",
        city: item.city,
        roles: item.roles,
        profile_photo_url: [],
      };
      this.modal.title = "Edit User";
      this.dialog = true;
    },
    addItem() {
      this.maxWidthDialogDefault = 1000;
      this.actionDelete = false;
      this.actionTo = "store";
      this.modal.title = "Add New User";
      this.dialog = true;
    },
    getDataFromApi() {
      this.loading = true;
      axios
        .get(`${GlobalVarConfig.API_URL}/users`)
        .then((response) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;

          let items = response.data.data;
          let search = this.search.trim().toLowerCase();
          const total = items.length;

          // search data
          if (search) {
            items = items.filter((item) => {
              return Object.values(item)
                .join(",")
                .toLowerCase()
                .includes(search);
            });
          }
          // sorting data
          if (sortBy.length === 1 && sortDesc.length === 1) {
            items = items.sort((a, b) => {
              const sortA = a[sortBy[0]];
              const sortB = b[sortBy[0]];
              if (sortDesc[0]) {
                if (sortA < sortB) return 1;
                if (sortA > sortB) return -1;
                return 0;
              } else {
                if (sortA < sortB) return -1;
                if (sortA > sortB) return 1;
                return 0;
              }
            });
          }
          if (itemsPerPage > 0) {
            items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
          }
          // handle success
          this.dataList = items;
          this.totalData = total;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
        });
    },
    actionsApi(actionTo) {
      this.$refs.form.validate();
      if (actionTo !== "update") {
        // file validate
        if (!this.params.profile_photo_url) {
          this.snackbar = true;
          this.snackbarMessage = "File Not Selected !";
          return;
        } else {
          if (this.params.profile_photo_url.size > 2 * 1024 * 1024) {
            this.snackbar = true;
            this.snackbarMessage = "Picture size should  be less than 2 MB !";
            return;
          } else if (
            this.params.profile_photo_url.type !== "image/png" &&
            this.params.profile_photo_url.type !== "image/jpeg" &&
            this.params.profile_photo_url.type !== "image/jpg"
          ) {
            this.snackbar = true;
            this.snackbarMessage = "File type not allowed!";
            return;
          }
        }
      }

      if (this.params.rate > 5) {
        this.snackbar = true;
        this.snackbarMessage = "Maximal Rate is '5' ";
        return;
      }
      if (
        this.params.name === "" ||
        this.params.email === "" ||
        this.params.roles === "" 
      ) {
        this.snackbarMessage = "Form Input Can't Be Empty";

        this.snackbar = true;
        return;
      }
      this.setLoading = true;

      //set form upload image
      const formData = new FormData();

      formData.append("file", this.params.profile_photo_url);
      for (const itemlist in this.params) {
        formData.append(`${itemlist}`, `${this.params[itemlist]}`);
      }
      axios
        .post(`${GlobalVarConfig.API_URL}/users/${actionTo}`, formData)
        .then((response) => {
          this.actionsProccess();
          this.alertObj = {
            message: response.data.meta.message,
            type: "success",
          };
          this.getDataFromApi();
          setTimeout(() => {
            this.isAlert = false;
          }, 2000);
        })
        .catch((error) => {
          this.actionsProccess();
          this.alertObj = {
            message: error.message,
            type: "error",
          };
          this.getDataFromApi();
          setTimeout(() => {
            this.isAlert = false;
          }, 2000);
        });
    },
    actionsProccess() {
      this.setLoading = false;
      this.isAlert = true;
      this.dialog = false;
    },
    refreshTable() {
      this.getDataFromApi();
    },
    deleteConfirm(item) {
      this.params = item;
      this.dialog = true;
      this.actionDelete = true;
      this.maxWidthDialogDefault = 290;
    },
    deleteItem(item) {
      this.setLoading = true;
      axios
        .post(`${GlobalVarConfig.API_URL}/users/delete/${item.id}`)
        .then((response) => {
          this.actionsProccess();
          this.alertObj = {
            message: response.data.meta.message,
            type: "success",
          };
          this.getDataFromApi();
          setTimeout(() => {
            this.isAlert = false;
          }, 2000);
        })
        .catch((error) => {
          this.actionsProccess();
          this.alertObj = {
            message: error.meta.message,
            type: "error",
          };
          this.getDataFromApi();
          setTimeout(() => {
            this.isAlert = false;
          }, 2000);
        });
    },
  },
};
</script>
