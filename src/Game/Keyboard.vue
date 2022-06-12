<template>
  <div class="Keyboard">
    <div class="setting">
      <div class="setting-item output border">得分：{{ score }}</div>
      <div class="setting-item output border">历史最高：{{ endScore }}</div>
      <div class="setting-item mode">
        <div class="output border">难度：{{ mode }}</div>
        <div class="btns">
          <div class="btn border" style="background: red" @click="modeUp">UP</div>
          <div class="btn border" style="background: green" @click="modeDown">DOWN</div>
        </div>
      </div>
      <div class="setting-item on-off">
        <div class="border btn" style="background: rgb(0, 72, 107)" @click="stop">
          STOP
        </div>
        <div class="border btn" style="background: rgb(60, 202, 10)" @click="play">
          PLAY
        </div>
      </div>
    </div>
    <div class="direction">
      <div
        v-for="direction in directions"
        :key="direction.high"
        :class="{ active: high === direction.high, [direction.className]: true }"
        class="btn"
        @touchstart="direction.callback"
        @mousedown="direction.callback"
        @touchend="up"
        @mouseup="up"
      >
        {{ direction.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { Event } from "@/event";

export default {
  name: "Keyboard",
  data() {
    return {
      high: -1,
      directions: [
        {
          className: "t",
          text: "T",
          high: 0,
          callback: () => {
            this.high = 0;
            this.$bus.$emit(Event["KeyboardTop"]);
          },
        },
        {
          className: "l",
          text: "L",
          high: 1,
          callback: () => {
            this.high = 1;
            this.$bus.$emit(Event["KeyboardLeft"]);
          },
        },
        {
          className: "r",
          text: "R",
          high: 2,
          callback: () => {
            this.high = 2;
            this.$bus.$emit(Event["KeyboardRight"]);
          },
        },
        {
          className: "b",
          text: "B",
          high: 3,
          callback: () => {
            this.high = 3;
            this.$bus.$emit(Event["KeyboardBottom"]);
          },
        },
      ],
      mode: 3,
      score: 0,
      endScore: 0,
    };
  },
  created() {
    this.$bus.$on(Event["outputMode"], (mode) => {
      this.mode = mode;
    });
    this.$bus.$on(Event["outputScore"], (score) => {
      this.score = score;
    });
    this.$bus.$on(Event["outputEndScore"], (endScore) => {
      const endScorePrev = window.localStorage.getItem("END_SCORE");
      if (endScorePrev == null || this.endScore < endScore) {
        this.endScore = endScore;
        window.localStorage.setItem("END_SCORE", this.endScore);
      }
    });
  },
  methods: {
    up() {
      this.high = -1;
    },
    modeUp() {
      this.$bus.$emit(Event["KeyboardUp"]);
    },
    modeDown() {
      this.$bus.$emit(Event["KeyboardDown"]);
    },
    stop() {
      this.$bus.$emit(Event["KeyboardStop"]);
    },
    play() {
      this.$bus.$emit(Event["KeyboardPlay"]);
    },
  },
};
</script>

<style lang="less" scoped>
.Keyboard {
  display: flex;
  justify-content: space-between;
  padding: 2vh;
  width: 100%;
  height: 40vh;
  box-sizing: border-box;

  .setting {
    flex: 1;
    padding-right: 5%;
    color: #eee;
    text-align: center;

    .setting-item {
      width: 100%;
      height: 6vh;
      line-height: 5.5vh;
      font-size: 14px;
      margin: 0.5vh 0;
      box-sizing: border-box;
    }

    .output {
      background-color: rgb(40, 44, 52);
    }

    .mode {
      display: flex;

      .output {
        flex: 1;
      }

      .btns {
        width: 40%;

        .btn {
          height: 3vh;
          line-height: 2.2vh;
          font-size: 12px;
        }
      }
    }
    .on-off {
      display: flex;
      justify-content: space-between;

      .btn {
        width: 48%;
      }
    }

    .btn {
      position: relative;
      box-sizing: border-box;

      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: 0 5px 10px rgba(255, 255, 255, 80%) inset;
      }

      &::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: 0 -5px 10px rgba(0, 0, 0, 80%) inset;
      }
    }
  }

  .direction {
    position: relative;
    width: 25vh;
    height: 25vh;

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 40%;
      height: 40%;
      color: #fff;
      background: #5a65f1;
      border-radius: 50%;
      border: 1px solid #000;

      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        box-shadow: 0 5px 10px rgba(255, 255, 255, 80%) inset;
      }

      &::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        box-shadow: 0 -5px 10px rgba(0, 0, 0, 80%) inset;
      }
    }

    .active {
      &::after {
        box-shadow: 0 -5px 5px rgba(255, 255, 255, 60%) inset;
      }
      &::before {
        box-shadow: 0 5px 5px rgba(0, 0, 0, 60%) inset;
      }
    }

    .t {
      left: 50%;
      transform: translate3d(-50%, 0, 0);
    }

    .l {
      top: 33%;
      left: -3%;
    }

    .r {
      top: 33%;
      right: -3%;
    }

    .b {
      bottom: -8%;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
    }
  }

  .border {
    border: solid 0.3vh;
    border-color: #987f0f #fae36c #fae36c #987f0f;
  }
}
</style>
