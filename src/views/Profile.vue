<template>
    <v-card shaped outlined hover>
      <v-card-title class="primary white--text"> Profile </v-card-title>
      <v-container fluid class="my-5">
        <v-list-item class="d-flex justify-center">
          <v-list-item-avatar size="300">
            <v-img :src="userImage"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-container>

      <v-card-text class="mb-5 d-flex justify-space-around" style="position:relative;">
        <!-- <v-btn absolute color="orange" class="white--text" fab large right top>
          <v-icon>mdi-account-edit</v-icon>
        </v-btn> -->
        <div class="d-flex flex-column">
            <div class="headline">
              <v-banner
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  mdi-clipboard-account
                </v-icon>
                {{ userName }}
              </v-banner>
            </div>
            <div class="headline">
              <v-banner
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  mdi-account-tie
                </v-icon>
                {{ userGrade }}
              </v-banner>
            </div>
            <div class="headline">
              <v-banner
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  mdi-email
                </v-icon>
                {{ userEmail }}
              </v-banner>
            </div>
            <div class="headline">
              <v-banner
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  mdi-domain
                </v-icon>
                {{ userCompany }}
              </v-banner>
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="headline">
              <v-banner
              two-line
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  mdi-map-marker
                </v-icon>
                {{ userAddress }}
              </v-banner>
            </div>
            <div class="headline">
              <v-banner
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  mdi-phone
                </v-icon>
                {{ userPhone }}
              </v-banner>
            </div>
            <div class="headline">
              <v-banner
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  {{gender}}
                </v-icon>
                {{ userGender }}
              </v-banner>
            </div>
            <div class="headline">
              <v-banner
              >
                <v-icon
                  slot="icon"
                  color="warning"
                  size="36"
                >
                  mdi-cake
                </v-icon>
                {{ userBirthDate }}
              </v-banner>
            </div>
          </div>
      </v-card-text>
    </v-card>
</template>

<script>
import * as moment from "moment/moment";

export default {
  computed: {
    userEmail: function () {
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_email;
    },
    userGrade: function () {
      return (
        JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
          .auth_name +
        " of " +
        JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
          .division_name +
        " division"
      );
    },
    userImage: function () {
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_profile_img;
    },
    userName: function () {
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_name;
    },
    userCompany: function () {
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .company_name;
    },
    userAddress: function(){
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_address
    },
    userPhone: function(){
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_phone_code + JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_phone
    },
    userGender: function(){
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_gender
    },
    gender: function(){
      return JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_gender == 'male' ? 'mdi-gender-male' : 'mdi-gender-female'
    },
    userBirthDate: function(){
      return moment(JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
        .employee_birth_date).format("DD MMM YYYY");
    }
  },
};
</script>