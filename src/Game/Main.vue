<template>
  <div class="Main" ref="game_main"></div>
</template>

<script>
import { Game } from "../ts/Game";
import { Event } from "@/event";

export default {
  name: "Main",
  mounted() {
    const game = new Game(this.$refs["game_main"], 30);
    this.$bus.$on(Event['KeyboardTop'], () => {
      game.control.top()
    })
    this.$bus.$on(Event['KeyboardLeft'], () => {
      game.control.left()
    })
    this.$bus.$on(Event['KeyboardRight'], () => {
      game.control.right()
    })
    this.$bus.$on(Event['KeyboardBottom'], () => {
      game.control.bottom()
    })
    console.log(game);
  },
};
</script>

<style lang="less" scoped>
.Main {
  width: 80%;
  height: 50vh;
  margin: 0 auto;
  border: solid 0.5vh;
  border-color: #987f0f #fae36c #fae36c #987f0f;
}
</style>
