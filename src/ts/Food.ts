
/**
 * 食物
 */
export class Food {
  private _el: HTMLElement // 食物实体元素
  private _idx!: number // 索引位，用于标识虫食物的位置
  constructor(prent: HTMLElement, width: number, height: number) {
    this._el = document.createElement('div')
    this._el.style.cssText =
    `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      background-image: url(${require('@/assets/images/food.png')});
      background-size: 100% 100%;
    `

    prent.appendChild(this._el)
  }

  /**
   * 读取 idx
   * @returns {number} idx
   */
  public getIdx(): number {
    if(!this._idx) this._idx = -1
    return this._idx
  }

  /**
   * 设置索引位
   * @param {number} idx 索引位
   */
  public setIdx(idx: number) {
    this._idx = idx
  }

  /**
   * 设置食物放置的位置
   * @param {number} x px
   * @param {number} y px
   */
  public setPosition(x: number, y: number) {
    this._el.style.cssText +=
    `
      left: ${x}px;
      top: ${y}px;
    `
  }
}