import { Food } from './Food'

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
  constructor(el: HTMLElement, gridLength: number) {
    this._el = el
    this._gridLength = gridLength

    this._el.style.position = 'relative'

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
    this._pos = this._gridLength**2 - 1
    // 初始化网格单元宽高
    this._width = this._el.clientWidth / this._gridLength
    this._height = this._el.clientHeight / this._gridLength
    // 初始化食物
    this._food = new Food(this._el, this._width, this._height)

    const startIdx = Math.floor((this._gridLength ** 2) / 2 - this._gridLength / 2) // 蛇起始位置为中心点坐标
    this._updateGrid(startIdx)
    this._food.setPosition(...this.computePosition(this._random()))
  }

  /**
   * 更新网格，如果没有补操作说明是蛇在吃食物，否则则是走动。吃食物对 _grid 进行洗牌操作，走动则是洗牌 ➕ 放回
   * @param {number} fetch 取操作
   * @param {?number} repair 补操作
   */
  private _updateGrid(fetch: number, repair?: number) {
    if (!repair) {
      const temp = this._gridIdxMap[fetch]
      this._gridIdxMap[fetch] = null
      this._grid[temp!] = this._grid[this._pos]
      this._gridIdxMap[this._pos] = temp
      this._pos--
    } else {
      const temp = this._grid[repair]
      this._grid[repair] = repair
      this._grid[fetch] = temp
      this._gridIdxMap[temp] = fetch
      this._gridIdxMap[repair] = repair
    }
  }

  /**
   * 洗牌算法随机数
   * @returns {number}
   */
  private _random(): number {
    return this._grid[
      Math.floor(Math.random() * this._pos + 1)
    ]
  }

  /**
   * 根据索引位得出 x、y 轴位置
   * @param {number} idx 网格范围内的索引位
   * @returns {[number, number]} 得出 x、y 轴位置
   */
  public computePosition(idx: number): [number, number] {
    if (idx < 0 || idx >= this._gridLength ** 2) {
      throw new Error('idx out of range')
    }

    const i = Math.floor(idx / this._gridLength)
    const j = idx % this._gridLength

    return [i * this._width, j * this._height]
  }

}
