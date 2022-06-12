<template>
  <div class="Main" ref="game_main"></div>
</template>

<script>
import { Game } from "../core/Game";
import { Event } from "@/event";

export default {
  name: "Main",
  mounted() {
    const game = new Game(this.$refs["game_main"], 20);
    this.$bus.$on(Event["KeyboardTop"], () => {
      game.control.top();
    });
    this.$bus.$on(Event["KeyboardLeft"], () => {
      game.control.left();
    });
    this.$bus.$on(Event["KeyboardRight"], () => {
      game.control.right();
    });
    this.$bus.$on(Event["KeyboardBottom"], () => {
      game.control.bottom();
    });
    this.$bus.$on(Event["KeyboardUp"], () => {
      game.setMode(game.mode + 1);
      this.$bus.$emit(Event["outputMode"], game.mode);
    });
    this.$bus.$on(Event["KeyboardDown"], () => {
      game.setMode(game.mode - 1);
      this.$bus.$emit(Event["outputMode"], game.mode);
    });
    game.scoreHook = (score) => {
      this.$bus.$emit(Event["outputScore"], score);
    };
    this.$bus.$on(Event["KeyboardStop"], () => {
      game.stop();
    });
    this.$bus.$on(Event["KeyboardPlay"], () => {
      game.stop();
      game.play();
    });
    game.endHook = (endScore) => {
      this.$bus.$emit(Event["outputEndScore"], endScore);
    };

    this.$bus.$emit(Event["outputMode"], game.mode);
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
