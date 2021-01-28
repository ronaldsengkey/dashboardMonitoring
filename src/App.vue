<template>
  <v-app id="inspire">
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped>
#inspire {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
  }
  #inspire::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
</style>