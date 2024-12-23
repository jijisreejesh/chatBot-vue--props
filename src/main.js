import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './components/router'
// Vuetify
import 'vuetify/styles'
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
//import 'material-design-icons-iconfont/dist/material-design-icons.css';

import { createVuetify } from 'vuetify'
 import * as components from 'vuetify/components'
 import * as directives from 'vuetify/directives'



const vuetify = createVuetify({
     components,
     directives,
  })

const app=createApp(App);
app.use(vuetify);
app.use(router)
app.mount('#app')
