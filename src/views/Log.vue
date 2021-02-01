<template>
  <v-card shaped outlined :loading="cardLoad">
    <v-card-title class="primary white--text">
      Log
      <v-spacer></v-spacer>
      <v-btn icon medium @click="refreshData()">
        <v-icon color="white">mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text :key="keyTable">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="logData"
        :search="search"
        no-data-text="empty data"
        no-results-text="empty results"
        multi-sort
        loading="load"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      ></v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  beforeMount() {
    let data = { signature: this.$signature, link: this.$urlLink };
    this.$store.dispatch("getLogList", data);
  },
  computed: {
    logData: function () {
      this.load = false;
      this.cardLoad = false;
      return this.$store.getters.getMomentedLog;
    },
  },
  methods: {
    refreshData: function () {
      this.load = true;
      this.cardLoad = 'info';
      let data = { signature: this.$signature, link: this.$urlLink };
      this.$store.dispatch("getLogList", data);
      this.keyTable += 1;
    },
  },
  data: () => ({
    search: "",
    keyTable:0,
    load: true,
    cardLoad:false,
    sortDesc: true,
    sortBy: ["created_at"],
    headers: [
      {text: "Category",value: "category"},
      { text: "Module", value: "module" },
      { text: "User ID", value: "user_id" },
      { text: "Username", value: "user_name" },
      { text: "Description", value: "description" },
      { text: "Created At", value: "created_at" },
    ],
  }),
};
</script>