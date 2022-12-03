// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import websocket from './assets/websocket'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Button,
  Input,
  Icon,
  Badge,
  Dialog,
  Aside,
  Main,
  Header,
  Container,
  Upload,
  MessageBox,
  Notification
} from 'element-ui'

Vue.use(Icon)
Vue.use(Input)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Aside)
Vue.use(Badge)
Vue.use(Main)
Vue.use(Header)
Vue.use(Upload)
Vue.use(Container)

Vue.config.productionTip = false
Vue.prototype.$notify = Notification
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$websocket = websocket

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
