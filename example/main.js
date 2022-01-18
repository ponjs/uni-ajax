import Vue from 'vue'
import App from './App'
import * as ajax from './common/ajax'

Vue.config.productionTip = false

Vue.use(ajax)

App.mpType = 'app'

new Vue({
  ...App
}).$mount()
