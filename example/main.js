import Vue from 'vue'
import App from './App'

import './utils/ajax'

Vue.config.productionTip = false

App.mpType = 'app'

new Vue({
  ...App
}).$mount()
