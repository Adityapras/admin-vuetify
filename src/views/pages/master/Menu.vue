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
                        v-model="params.menu_name"
                        label="Menu Name"
                        persistent-hint
                        outlined
                        :rules="optionsRules.menuRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="mt-4"
                        v-model="params.link"
                        label="Menu Link"
                        persistent-hint
                        outlined
                        :rules="optionsRules.linkRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="params.parent"
                        item-value="code"
                        item-text="label"
                        label="- Select Parent -"
                        clearable
                        :items="parent"
                        class="mt-4"
                        outlined
                        solo
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="mt-4"
                        v-model="params.menu_show_order"
                        label="Menu Order"
                        persistent-hint
                        outlined
                        :rules="optionsRules.showOrderRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="mt-4"
                        v-model="params.icon"
                        label="Menu Icon"
                        persistent-hint
                        outlined
                      ></v-text-field>
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
            <v-card-title class="text-h5 red lighten-1">
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
          Form Input Can't Be Empty
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
        ><v-icon>mdi-dots-vertical</v-icon>Master Menu
        <v-spacer></v-spacer>
        <v-icon @click="refreshTable">fas fa-sync-alt</v-icon>
      </v-card-title>
    </v-card>
    <v-card tile>
      <v-card-title>
        <v-row align="center" justify="end">
          <v-btn @click="addItem" text color="#42b983"
            ><v-icon left>fas fa-plus-square</v-icon> Add New Menu</v-btn
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
      Deselect: {
        render: (createElement) => createElement("span", "❌"),
      },
      valid: true,
      params: {
        id: "",
        menu_name: "",
        link: "",
        parent: "",
        menu_show_order: "",
        icon: "",
      },
      dialog: false,
      parent: [],
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
          text: "Menu Name",
          align: "start",
          // sortable: false,
          value: "name",
        },
        { text: "Link", value: "link" },
        { text: "Parent", value: "parent_name" },
        { text: "Menu Show Order", value: "order" },
        { text: "Icon", value: "icon" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      optionsRules: {
        menuRules: [(v) => !!v || "Menu Name is required"],
        linkRules: [(v) => !!v || "Link is required"],
        showOrderRules: [(v) => !!v || "Show Order is required"],
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
    // dialog(val) {
    //   val || this.close();
    // },
  },
  created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
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
      this.params = {
        id: item.id,
        menu_name: item.name,
        link: item.link,
        parent: item.parent,
        menu_show_order: item.order,
        icon: item.icon,
      };
      this.modal.title = "Edit Menu";
      this.dialog = true;
    },
    addItem() {
      this.maxWidthDialogDefault = 1000;
      this.actionDelete = false;
      this.actionTo = "store";
      this.modal.title = "Add New Menu";
      this.dialog = true;
    },
    getDataFromApi() {
      this.loading = true;
      axios
        .get(`${GlobalVarConfig.API_URL}/menu`)
        .then((response) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;

          let findData = response.data.data;
          let items = [];
          this.parent = response.data.data.map((item) => {
            const newParent = {};
            newParent["label"] = item.name;
            newParent["code"] = item.id;
            newParent["icon"] = item.icon;

            return newParent;
          });

          //get parent name
          for (let index = 0; index < findData.length; index++) {
            let lookingFor = findData.filter(
              (el) => el.id === findData[index].parent
            );
            if (lookingFor.length > 0) {
              findData[index].parent_name = lookingFor[0].name;
            } else {
              findData[index].parent_name = "-";
            }
            items.push(findData[index]);
          }

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
      if (this.params.parent === null || this.params.parent === "") {
        this.params.parent = 0;
      }

      if (
        this.params.menu_name === "" ||
        this.params.link === "" ||
        this.params.menu_show_order === ""
      ) {
        this.snackbar = true;
        return;
      }
      this.setLoading = true;
      axios
        .post(`${GlobalVarConfig.API_URL}/menu/${actionTo}`, this.params)
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
        .post(`${GlobalVarConfig.API_URL}/menu/delete/${item.id}`)
        .then((response) => {
          console.log(response);
          this.actionsProccess();
          this.alertObj = {
            message: response.data.message,
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
  },
};
</script>
