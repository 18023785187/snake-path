<template>
  <div class="Content" ref="game_content"></div>
</template>

<script lang="ts">
import { Game } from '../../ts/Game'

export default {
  name: "Content",
  mounted () {
    const game = new Game(this.$refs['game_content'], 20)
    console.log(game)
  }
};
</script>

<style lang="less" scoped>
.Content {
  left: 2vw;
  width: 75vw;
  height: 50vh;
  background-color: pink;
}
</style>
