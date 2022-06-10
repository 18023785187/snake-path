<template>
  <div class="Content" ref="game_content"></div>
</template>

<script lang="ts">
import { Game } from '../../ts/Game'

export default {
  name: "Content",
  mounted () {
    const game = new Game(this.$refs['game_content'], 4)
    console.log(game)
  }
};
</script>

<style lang="less" scoped>
.Content {
  width: 100vw;
  height: 100vh;
}
</style>
