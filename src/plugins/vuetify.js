import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    'iconFont': 'md',
    theme: {
        themes: {
        light: {
            primary: '#f86615', //orange
            secondary: '#363636', //black
            success: '#3BAF29', // green
            info: '#FFFFFF', // you know lah ini apa
        },
    },
    },
});
