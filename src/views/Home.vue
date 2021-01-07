<template>
  <div class="home">
    <!-- <h2 class="mt-2 font-weight-black pl-4 ">Home Page</h2> -->
    <v-carousel class="" hide-delimiters height="200">
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        :class="rounded-lg"
      ></v-carousel-item>
    </v-carousel>

    <v-fade-transition mode="out-in">
      <v-container class="grey lighten-5">
      <!-- <v-row no-gutters>
        <v-col
          v-for="n in 3"
          :key="n"
          cols="4"
          sm="4"
        >
          <v-card
            class="pa-1 ma-1"
            outlined
            tile
          >
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              max-height="150"
              max-width="250"
              src="https://picsum.photos/id/11/500/300"
            ></v-img>
          </v-card>
        </v-col>
      </v-row> -->

      <v-row>
        <v-col cols="4">
          <v-card class="text-center pt-3">
            <center>
              <v-img
                max-height="40"
                max-width="40"
                lazy-src="https://cdn.onlinewebfonts.com/svg/img_486935.png"
                src="https://cdn.onlinewebfonts.com/svg/img_486935.png"
              ></v-img>
            </center>
            <v-card-subtitle class="subtitle-2 text-center">
              Stylist
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="text-center pt-3">
            <center>
              <v-img
                max-height="80"
                max-width="80"
                lazy-src="https://cdn.onlinewebfonts.com/svg/img_531937.png"
                src="https://cdn.onlinewebfonts.com/svg/img_531937.png"
              ></v-img>
            </center>
            <v-card-subtitle class="subtitle-2 text-center">
              Body Fit
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="text-center pt-3">
            <!-- <v-icon class="mt-3"
              large
              color="orange darken-2"
            >
              mdi-message-text
            </v-icon> -->
            <center>
              <v-img
                  max-height="40"
                  max-width="40"
                  lazy-src="https://www.flaticon.com/svg/static/icons/svg/2965/2965462.svg"
                  src="https://www.flaticon.com/svg/static/icons/svg/2965/2965462.svg"
                ></v-img>
            </center>
            <v-card-subtitle class="subtitle-2 text-center">
              Groomers
            </v-card-subtitle>
          </v-card>
        </v-col>
        <!-- <v-col cols="4">
          <v-card class="text-align:center;">
            <v-img
              src="https://picsum.photos/350/165?random"
              height="66"
              class="grey darken-4"
            ></v-img>
            <v-card-subtitle class="subtitle-2 text-center">
              Groomers
            </v-card-subtitle>
          </v-card>
        </v-col> -->
      </v-row>

    </v-container>


    </v-fade-transition>
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  data () {
      return {
        items: [
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
          },
        ],
      }
    },
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
