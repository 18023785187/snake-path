import { Direction } from './constants'
import { computePosition } from './utils'

type sort = 0 | 1 | 2

type ImageMap = { [key: string]: NodeRequire }

const head: ImageMap = { // 头部图片
  [Direction.Top]: require('@/assets/images/snake/snake-head-top.png'), // 上 👆
  [Direction.Right]: require('@/assets/images/snake/snake-head-right.png'), // 右 👉
  [Direction.Bottom]: require('@/assets/images/snake/snake-head-bottom.png'), // 下 👇
  [Direction.Left]: require('@/assets/images/snake/snake-head-left.png'), // 左 👈
}
const body: ImageMap = { // 身体图片
  [Direction.Top]: require('@/assets/images/snake/snake-body-top(bottom).png'), // 上
  [Direction.Bottom]: require('@/assets/images/snake/snake-body-top(bottom).png'), // 下
  [Direction.Left]: require('@/assets/images/snake/snake-body-left(right).png'), // 左
  [Direction.Right]: require('@/assets/images/snake/snake-body-left(right).png'), // 右
  [Direction.Left + Direction.Top]: require('@/assets/images/snake/snake-body-left(bottom)-top(right).png'), // 由左到上
  [Direction.Bottom + Direction.Right]: require('@/assets/images/snake/snake-body-left(bottom)-top(right).png'), // 由下到右
  [Direction.Right + Direction.Top]: require('@/assets/images/snake/snake-body-right(bottom)-top(left).png'), // 由右到上
  [Direction.Bottom + Direction.Left]: require('@/assets/images/snake/snake-body-right(bottom)-top(left).png'), // 由下到左
  [Direction.Top + Direction.Left]: require('@/assets/images/snake/snake-body-top(right)-left(bottom).png'), // 由上到左
  [Direction.Right + Direction.Bottom]: require('@/assets/images/snake/snake-body-top(right)-left(bottom).png'), // 由右到下
  [Direction.Top + Direction.Right]: require('@/assets/images/snake/snake-body-top(left)-right(bottom).png'), // 由上到右
  [Direction.Left + Direction.Bottom]: require('@/assets/images/snake/snake-body-top(left)-right(bottom).png'), // 由左到下
}
const tail: ImageMap = { // 尾部图片
  [Direction.Top]: require('@/assets/images/snake/snake-tail-top.png'), // 上 👆
  [Direction.Right]: require('@/assets/images/snake/snake-tail-right.png'), // 右 👉
  [Direction.Bottom]: require('@/assets/images/snake/snake-tail-bottom.png'), // 下 👇
  [Direction.Left]: require('@/assets/images/snake/snake-tail-left.png'), // 左 👈
}

/**
 * 蛇
 */
export class Snake {
  private _parent: HTMLElement // 父节点，指定蛇放置的锚点
  private _width: number // 蛇单元格宽
  private _height: number // 蛇单元格高
  private _gridLength: number
  public head: Node // 头
  public tail: Node // 尾
  private _prevTailData?: { // 上一次尾部的数据，在添加节点时复位使用
    idx: number,
    direction: Direction,
    position: [number, number]
  }
  public length: number
  constructor(
    parent: HTMLElement,
    width: number,
    height: number,
    gridLength: number,
    initPosition: [number, number, number] // 初始化蛇头、身、尾位置
  ) {
    this._parent = parent
    this._width = width
    this._height = height
    this._gridLength = gridLength

    const head = new Node(this._parent, 0, initPosition[0], this._gridLength, this._width, this._height)
    const body = new Node(this._parent, 1, initPosition[1], this._gridLength, this._width, this._height)
    const tail = new Node(this._parent, 2, initPosition[2], this._gridLength, this._width, this._height)
    head.next = body
    body.prev = head
    body.next = tail
    tail.prev = body
    this.head = head
    this.tail = tail

    this.length = 3
  }

  /**
   * 每次更新
   */
  public update() {
    this._prevTailData = {
      idx: this.tail.idx,
      direction: this.tail.direction,
      position: this.tail.position
    }
    // 把尾部前一个节点的重要值赋给尾部
    const tailPrev = this.tail.prev!
    this.tail.idx = tailPrev.idx
    this.tail.direction = tailPrev.direction
    this.tail.position = tailPrev.position
    // 把头部的重要值赋给尾部前一个节点
    tailPrev.idx = this.head.idx
    tailPrev.direction = this.head.next!.direction // 设置尾部前一个节点基础位置
    tailPrev.position = this.head.position

    // 头部走动，如果报错说明游戏结束
    this.head.run()
    tailPrev.direction = this.head.direction // 设置尾部前一个节点的当前位置

    if (this.length > 3) { // 当蛇长度大于 3 时，需要置换节点位置
      const headNext = this.head.next!
      const tailPrevPrev = this.tail.prev!.prev!
      this.head.next = tailPrev
      tailPrev.prev = this.head
      tailPrev.next = headNext
      headNext.prev = tailPrev
      tailPrevPrev.next = this.tail
      this.tail.prev = tailPrevPrev
    }
  }

  /**
   * 在吃食物时添加节点
   */
  public addNode() {
    const node = new Node(
      this._parent,
      1,
      this.tail.idx,
      this._gridLength,
      this._width,
      this._height,
      this.tail.direction
    )

    const tailPrev = this.tail.prev!
    tailPrev.next = node
    node.prev = tailPrev
    node.next = this.tail
    this.tail.prev = node
    // 尾部复位至上一次的位置
    this.tail.idx = this._prevTailData!.idx
    this.tail.direction = this._prevTailData!.direction
    this.tail.position = this._prevTailData!.position

    this.length += 1 // 蛇长度加一
  }

  /**
   * 销毁
   */
  public destroy() {
    let cur: Node | null = this.head
    while (cur) {
      cur.destroy()
      cur = cur.next
    }
  }
}

/**
 * 蛇片段，实质是一条双向链表
 */
class Node {
  private _parent: HTMLElement
  public sort: sort // 类型，0 为头、1 为身、2 为尾
  public idx: number // 当前索引位
  private _gridLength: number
  private _width: number
  private _height: number
  private _el: HTMLElement
  private _direction!: Direction // 方向
  private _position!: [number, number] // 位置
  public prev: Node | null // 上一个节点
  public next: Node | null // 下一个节点
  constructor(
    parent: HTMLElement,
    sort: sort,
    idx: number,
    gridLength: number,
    width: number,
    height: number,
    direction?: Direction
  ) {
    this._parent = parent
    this.sort = sort
    this.idx = idx
    this._gridLength = gridLength
    this._width = width
    this._height = height
    this._el = document.createElement('div')
    this._el.style.cssText = // 初始化模型
      `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      // transition-property: top, left;
      // transition-duration: 0.3s, 0.3s;
    `
    this.direction = direction ? direction : Direction.Top // 初始化方向
    this.position = computePosition(this.idx, this._gridLength, this._width, this._height) // 初始化位置
    this.prev = null
    this.next = null

    this._parent.appendChild(this._el)
  }

  /**
   * 当设置方向时，基于 sort 和上一次的 direction 赋给模型皮肤
   */
  set direction(newDirection: Direction) {
    let image
    if (this.sort === 0) { // 头
      image = head[newDirection]
    } else if (this.sort === 1) { // 身
      const direction = (this._direction && this._direction !== newDirection) ? this._direction + newDirection : newDirection
      image = body[direction]
    } else { // 尾
      image = tail[newDirection]
    }
    this._el.style.cssText +=
      `
      background-image: url(${image});
      background-size: 100% 100%;
    `

    this._direction = newDirection
  }
  get direction() {
    return this._direction
  }

  /**
   * 当设置位置时，模型也同步到当前位置
   */
  set position(newPosition: [number, number]) {
    this._el.style.cssText +=
      `
      left: ${newPosition[0]}px;
      top: ${newPosition[1]}px;
    `

    this._position = newPosition
  }
  get position() {
    return this._position
  }

  /**
   * 蛇头走一个单元格
   */
  public run() {
    switch (this._direction) {
      case Direction.Top:
        if (this.idx % this._gridLength === 0) {
          this.idx -= -Infinity
        }
        this.idx -= 1
        break;
      case Direction.Right:
        this.idx += this._gridLength
        break;
      case Direction.Bottom:
        if (this.idx % this._gridLength === this._gridLength - 1 && ((this.idx + 1) / this._gridLength % 1 === 0 || (this.idx + 1) / this._gridLength === 0)) {
          this.idx += Infinity
        }
        this.idx += 1
        break;
      case Direction.Left:
        this.idx -= this._gridLength
        break;
    }
    if (this.idx < 0 || this.idx >= this._gridLength ** 2) {
      throw new Error('die')
    }

    this.position = computePosition(this.idx, this._gridLength, this._width, this._height)
  }


  /**
   * 销毁
   */
  public destroy() {
    this._el.remove()
  }
}
