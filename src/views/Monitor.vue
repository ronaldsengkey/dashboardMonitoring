<template>
  <div class="login">
    <v-card color="transparent" width="350">
      <v-form lazy-validation>
        <v-container>
          <v-text-field
            v-model="text"
            label="Email"
            autocomplete="off"
          ></v-text-field>
          <v-textarea clearable v-model="textArea">

          </v-textarea>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
    data: () => ({
       text:'kosong',
       textArea:''
    })
}
</script>