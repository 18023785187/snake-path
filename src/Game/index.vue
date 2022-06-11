<template>
  <div id="Game">
    <h1 class="title">贪吃蛇</h1>
    <Main />
    <Keyboard />
  </div>
</template>

<script lang="ts">
import Keyboard from './Keyboard.vue'
import Main from "./Main.vue";

export default {
  name: "Game",
  components: {
    Keyboard,
    Main,
  },
};
</script>

<style lang="less" scoped>
#Game {
  max-width: 600px;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background-color: #efcc19;
  box-shadow: 0 0 10px #fff inset;
  border-radius: 3vmax;
  overflow: hidden;

  .title {
    padding: 1.5vh;
    font-size: 3.5vh;
    font-weight: normal;
    text-align: center;
  }
}
</style>
