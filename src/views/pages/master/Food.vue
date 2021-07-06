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
                        label="Food Name"
                        persistent-hint
                        outlined
                        :rules="rules.name"
                      ></v-text-field>
                      <v-combobox
                        class="mt-4"
                        v-model="params.ingredients"
                        :items="ingredients"
                        hide-selected
                        label="Ingredients"
                        multiple
                        persistent-hint
                        small-chips
                        outlined
                        deletable-chips
                        item-color="primary"
                        :rules="rules.ingredients"
                      >
                        <template
                          v-slot:selection="{ attrs, item, parent, selected }"
                        >
                          <v-chip
                            v-bind="attrs"
                            :color="`blue lighten-4`"
                            :input-value="selected"
                            label
                            small
                          >
                            <span class="pr-2">
                              {{ item }}
                            </span>
                            <v-icon small @click="parent.selectItem(item)">
                              $delete
                            </v-icon>
                          </v-chip>
                        </template>
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                Press <kbd>enter</kbd> to create a new one
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-combobox>
                      <v-textarea
                        class="mt-4"
                        outlined
                        v-model="params.description"
                        name="input-7-4"
                        label="Description"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="4">
                      <vuetify-money
                        class="mt-4"
                        v-model="params.price"
                        outlined
                        label="Food Price"
                        clearable
                        :options="priceDefault"
                        valueWhenIsEmpty="0"
                        :rules="rules.price"
                      >
                        {{ params.price }}
                      </vuetify-money>
                      <v-text-field
                        class="mt-4"
                        v-model="params.rate"
                        label="Rate"
                        persistent-hint
                        outlined
                        type="number"
                        :rules="rules.rate"
                        max="5"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-combobox
                        class="mt-4"
                        v-model="params.types"
                        :items="tags"
                        hide-selected
                        label="Types"
                        hint="recommended, popular, new"
                        multiple
                        persistent-hint
                        small-chips
                        outlined
                        deletable-chips
                        item-color="primary"
                        :rules="rules.types"
                      >
                        <template
                          v-slot:selection="{ attrs, item, parent, selected }"
                        >
                          <v-chip
                            v-bind="attrs"
                            :color="`blue lighten-4`"
                            :input-value="selected"
                            label
                            small
                          >
                            <span class="pr-2">
                              {{ item }}
                            </span>
                            <v-icon small @click="parent.selectItem(item)">
                              $delete
                            </v-icon>
                          </v-chip>
                        </template>
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                Press <kbd>enter</kbd> to create a new one
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-combobox>
                      <v-file-input
                        class="mt-4"
                        v-model="params.picturePath"
                        color="primary"
                        counter
                        label="Food Picture"
                        placeholder="Select your files"
                        prepend-icon="mdi-paperclip"
                        outlined
                        :show-size="1000"
                        accept="image/png, image/jpeg, image/jpg"
                        :rules="rules.picturePath"
                      >
                        <template v-slot:selection="{ index, text }">
                          <v-chip color="primary" dark label small>
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
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
        ><v-icon>mdi-dots-vertical</v-icon>Master Food
        <v-spacer></v-spacer>
        <v-icon @click="refreshTable">fas fa-sync-alt</v-icon>
      </v-card-title>
    </v-card>
    <v-card tile>
      <v-card-title>
        <v-row align="center" justify="end">
          <v-btn @click="addItem" text color="#42b983"
            ><v-icon left>fas fa-plus-square</v-icon> Add New Food</v-btn
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
          <v-icon outlined color="primary"  class="mr-2" @click="editItem(item)">
            far fa-edit
          </v-icon>
          <v-icon outlined color="error"  @click="deleteConfirm(item)">
            far fa-trash-alt
          </v-icon>
        </template>
        <template v-slot:item.picturePath="{ item }">
          <v-img
            :lazy-src="item.picturePath"
            max-height="50"
            max-width="50"
            :src="item.picturePath"
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
        name: "Nasi Goreng",
        description: "test",
        ingredients: [],
        price: 50000,
        rate: 5,
        types: "",
        picturePath: [],
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
          text: "Food Name",
          align: "start",
          // sortable: false,
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Ingredients", value: "ingredients" },
        { text: "Price", value: "price" },
        { text: "Rate", value: "rate" },
        { text: "Type", value: "types" },
        { text: "Picture", value: "picturePath" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      rules: {
        name: [(v) => !!v || "Food Name is required"],
        rate: [(v) => v < 5 || "Maximal Rate is '5' "],
        ingredients: [(v) => !!v || "Ingredients is required"],
        types: [(v) => !!v || "Types is required"],
        price: [(v) => !!v || "Price is required"],
        picturePath: [
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
      this.params = {
        id: item.id,
        name: item.name,
        description: item.description,
        ingredients: item.ingredients.split(","),
        price: item.price,
        rate: item.rate,
        types: item.types.split(","),
        picturePath: [],
      };
      this.modal.title = "Edit Food";
      this.dialog = true;
    },
    addItem() {
      this.maxWidthDialogDefault = 1000;
      this.actionDelete = false;
      this.actionTo = "store";
      this.modal.title = "Add New Food";
      this.dialog = true;
    },
    getDataFromApi() {
      this.loading = true;
      axios
        .get(`${GlobalVarConfig.API_URL}/food`)
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
        if (!this.params.picturePath) {
          this.snackbar = true;
          this.snackbarMessage = "File Not Selected !";
          return;
        } else {
          if (this.params.picturePath.size > 2 * 1024 * 1024) {
            this.snackbar = true;
            this.snackbarMessage = "Picture size should  be less than 2 MB !";
            return;
          } else if (
            this.params.picturePath.type !==
            ("image/png" || "image/jpeg" || "image/jpg")
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
        this.params.description === "" ||
        this.params.ingredients === "" ||
        this.params.types === "" ||
        this.params.rate === "" ||
        this.params.price === ""
      ) {
        this.snackbarMessage = "Form Input Can't Be Empty";

        this.snackbar = true;
        return;
      }
      this.setLoading = true;

      //set form upload image
      const formData = new FormData();

      formData.append("file", this.params.picturePath);
      for (const itemlist in this.params) {
        formData.append(`${itemlist}`, `${this.params[itemlist]}`);
      }
      axios
        .post(`${GlobalVarConfig.API_URL}/food/${actionTo}`, formData)
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
        .post(`${GlobalVarConfig.API_URL}/food/delete/${item.id}`)
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
