import { Food } from './Food'
import { Snake } from './Snake'
import { Control } from './Control'
import { computePosition } from './utils'
import { Direction } from './constants'

type mode = 0 | 1 | 2 | 3 | 4 | 5 | 6
const modeRange: mode[] = [0, 6]
const speed = [1000, 700, 400, 200, 150, 100, 50]

type status = 0 | 1

export class Game {
  private _el: HTMLElement // 受控元素
  private _gridLength: number // 网格长度，适宜范围在 10 ~ 30
  private _grid!: number[] // 网格，用于标记剩余位置
  private _gridIdxMap!: { [key: number]: number | null } // 网格对应索引缓存表，用于快速查找索引
  private _pos!: number // 当前最大范围指针
  private _width!: number // 受控元素宽度 / _gridLength
  private _height!: number // 受控元素高度 / _gridLength
  // 角色
  private _food!: Food
  private _snake!: Snake
  // 控制
  public control!: Control
  public mode: mode // 难度
  private _timer?: number
  private _score!: number // 得分
  private _status!: status // 游戏状态，0 表示存活，1 表示死亡
  private _flag!: boolean // 是否已进行游戏
  public scoreHook: (score: number) => void = () => { }
  public endHook: (score: number) => void = () => { }
  get score() {
    return this._score
  }
  set score(newScore: number) {
    this._score = newScore
    this.scoreHook(this.score)
  }
  constructor(el: HTMLElement, gridLength: number) {
    this._el = el
    if (gridLength < 6) {
      throw new Error("gridLength can't be less than 6")
    }
    this._gridLength = gridLength

    this._el.style.cssText +=
      `
      position: relative;
      background-image: url(${require('@/assets/images/bg.jpg')});
      background-size: 100% 100%;
    `
    this.mode = 3

    this._init()
  }

  /**
   * 初始化参数
   */
  private _init() {
    // 初始化 _grid 和 _gridIdxMap
    const grid = new Array(this._gridLength ** 2).fill(0).map((_, i) => i)
    const gridIdxMap: Game['_gridIdxMap'] = {}
    for (let i = 0; i < grid.length; ++i) {
      gridIdxMap[i] = i
    }
    this._grid = grid
    this._gridIdxMap = gridIdxMap
    // 初始化指针
    this._pos = this._gridLength ** 2 - 1
    // 初始化网格单元宽高，向下取整确保精度
    this._width = Math.ceil(this._el.clientWidth / this._gridLength)
    this._height = Math.ceil(this._el.clientHeight / this._gridLength)
    this._el.style.cssText += // 适当调整内容区宽高
      `
      width: ${this._width * this._gridLength}px;
      height: ${this._height * this._gridLength}px;
    `
    // 初始化食物
    this._food = this._food ? this._food : new Food(this._el, this._width, this._height)

    const startIdx = Math.floor((this._gridLength ** 2) / 2 - this._gridLength / 2) // 蛇起始位置为中心点坐标
    // 初始化蛇
    if (this._snake) this._snake.destroy()
    this._snake = new Snake(
      this._el,
      this._width,
      this._height,
      this._gridLength,
      [startIdx, startIdx + 1, startIdx + 2]
    )
    // 初始化控制器
    this.control = this.control ? this.control : new Control()

    this._updateGrid(startIdx)
    this._updateGrid(startIdx + 1)
    this._updateGrid(startIdx + 2)
    this._food.idx = this._random()
    this._food.setPosition(...computePosition(this._food.idx, this._gridLength, this._width, this._height))

    this._score = 0
    this._status = 0
    this._flag = false
  }

  /**
   * 更新网格，如果没有补操作说明是蛇在吃食物，否则则是走动。吃食物对 _grid 进行洗牌操作，走动则是洗牌 ➕ 放回
   * @param {number} fetch 取操作
   * @param {?number} repair 补操作
   */
  private _updateGrid(fetch: number, repair?: number) {
    if (repair === undefined) {
      const temp = this._gridIdxMap[fetch]
      this._gridIdxMap[fetch] = null
      this._grid[temp!] = this._grid[this._pos]
      this._gridIdxMap[this._grid[this._pos]] = temp
      this._pos--
    } else {
      const temp = this._gridIdxMap[fetch]!
      this._grid[temp] = repair
      this._gridIdxMap[fetch] = null
      this._gridIdxMap[repair] = temp
    }
  }

  /**
   * 洗牌算法随机数
   * @returns {number}
   */
  private _random(): number {
    return this._grid[
      Math.floor(Math.random() * (this._pos + 1))
    ]
  }

  /**
   * 游戏进行一步
   */
  private _run() {
    // 每次更新获取遥控器的方向值赋给蛇头
    const newDirection =
      (
        (this.control.direction === Direction.Top && this._snake.head.direction === Direction.Bottom)
        || (this.control.direction === Direction.Bottom && this._snake.head.direction === Direction.Top)
        || (this.control.direction === Direction.Left && this._snake.head.direction === Direction.Right)
        || (this.control.direction === Direction.Right && this._snake.head.direction === Direction.Left)
      )
        ? this._snake.head.direction : this.control.direction

    this._snake.head.direction = newDirection
    try {
      const tailIdx = this._snake.tail.idx
      this._snake.update() // 更新蛇位置
      if (this._snake.head.idx === this._food.idx) { // 如果吃到食物，那么更新蛇长度、更新网格、更新食物位置
        if (this._gridIdxMap[this._snake.head.idx] === null) { // 当蛇触碰到自己时，游戏结束
          this._status = 1
          this.stop()
          this.endHook(this.score)
        }
        this._snake.addNode()
        this._updateGrid(this._snake.head.idx)
        this.score += 1 // 得分加一
        if (this._pos === -1) { // 如果食物被吃完，那么胜利
          this._status = 1
          this.stop()
          this.endHook(this.score)
        }
        this._food.idx = this._random()
        this._food.setPosition(...computePosition(this._food.idx, this._gridLength, this._width, this._height))
      } else { // 未吃到食物，更新网格
        if (this._gridIdxMap[this._snake.head.idx] === null && this._snake.head.idx !== tailIdx) { // 当蛇触碰到自己时，游戏结束
          this._status = 1
          this.stop()
          this.endHook(this.score)
        }
        this._updateGrid(this._snake.head.idx, tailIdx)
      }
    } catch { // 游戏结束
      this._status = 1
      this.stop()
      this.endHook(this.score)
    }
  }

  /**
   * 开始游戏
   */
  public play() {
    if (this._status === 1) {
      this._init()
    }
    this._flag = true

    this._timer = setTimeout(() => {
      this._flag && this._run()
      this._flag && this.play()
    }, speed[this.mode])
  }

  /**
   * 停止
   */
  public stop() {
    this._flag = false
    clearTimeout(this._timer)
  }

  /**
   * 设置难度
   * @param {number} mode 
   */
  public setMode(mode: number) {
    if (mode < modeRange[0]) this.mode = modeRange[0]
    else if (mode > modeRange[modeRange.length - 1]) this.mode = modeRange[modeRange.length - 1]
    else this.mode = mode as mode
  }
}
