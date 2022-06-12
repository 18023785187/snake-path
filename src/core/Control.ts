import { Direction } from './constants'

/**
 * 遥控器
 */
export class Control {
  public direction: Direction
  constructor() {
    this.direction = Direction.Top

    window.addEventListener('keydown', this._keydown)
  }

  private _keydown = (e: KeyboardEvent) => {
    if (e.keyCode === 38) { // 上
      this.top()
    } else if (e.keyCode === 39) { // 右
      this.right()
    } else if (e.keyCode === 40) { // 下
      this.bottom()
    } else if (e.keyCode === 37) { // 左
      this.left()
    }
  }

  public top = () => {
    this.direction = Direction.Top
  }
  public right = () => {
    this.direction = Direction.Right
  }
  public bottom = () => {
    this.direction = Direction.Bottom
  }
  public left = () => {
    this.direction = Direction.Left
  }

  public destroy() {
    window.removeEventListener('keydown', this._keydown)
  }
}
