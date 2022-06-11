import Vue from 'vue'

Vue.prototype.$bus = new Vue()

export const Event = {
  KeyboardTop: 'KeyboardTop',
  KeyboardLeft: 'KeyboardLeft',
  KeyboardRight: 'KeyboardRight',
  KeyboardBottom: 'KeyboardBottom',
}
