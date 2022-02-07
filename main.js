
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import store from './store'


Vue.config.productionTip = false
Vue.use(uView)
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()


// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue' 
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

Vue.prototype.audioContext = uni.createInnerAudioContext();
Vue.prototype.audioContext.autoplay = true;