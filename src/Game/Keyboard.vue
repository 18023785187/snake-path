<template>
  <div class="Keyboard">
    <div class="setting">
      <div class="score"></div>
    </div>
    <div class="direction">
      <div
        :class="{ active: high === 0 }"
        class="btn t"
        @touchstart="top"
        @mousedown="top"
        @touchend="up"
        @mouseup="up"
      >
        T
      </div>
      <div
        :class="{ active: high === 1 }"
        class="btn l"
        @touchstart="left"
        @mousedown="left"
        @touchend="up"
        @mouseup="up"
      >
        L
      </div>
      <div
        :class="{ active: high === 2 }"
        class="btn r"
        @touchstart="right"
        @mousedown="right"
        @touchend="up"
        @mouseup="up"
      >
        R
      </div>
      <div
        :class="{ active: high === 3 }"
        class="btn b"
        @touchstart="bottom"
        @mousedown="bottom"
        @touchend="up"
        @mouseup="up"
      >
        B
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
    };
  },
  methods: {
    top() {
      this.high = 0;
      this.$bus.$emit(Event["KeyboardTop"]);
    },
    left() {
      this.high = 1;
      this.$bus.$emit(Event["KeyboardLeft"]);
    },
    right() {
      this.high = 2;
      this.$bus.$emit(Event["KeyboardRight"]);
    },
    bottom() {
      this.high = 3;
      this.$bus.$emit(Event["KeyboardBottom"]);
    },
    up() {
      this.high = -1;
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
    width: 20vh;
    height: 25vh;
    .score {
      width: 50%;
      height: 5vh;
      margin: 0vw auto 2vw;
      border: solid 0.2vh;
      border-color: #987f0f #fae36c #fae36c #987f0f;
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
}
</style>
