import Vue from 'vue'

Vue.prototype.$bus = new Vue()

export const Event = {
  KeyboardTop: 'KeyboardTop',
  KeyboardLeft: 'KeyboardLeft',
  KeyboardRight: 'KeyboardRight',
  KeyboardBottom: 'KeyboardBottom',
  KeyboardUp: 'KeyboardUp',
  KeyboardDown: 'KeyboardDown',
  outputMode: 'outputMode',
  outputScore: 'outputScore',
  KeyboardStop: 'KeyboardStop',
  KeyboardPlay: 'KeyboardPlay',
  outputEndScore: 'outputEndScore',
}
