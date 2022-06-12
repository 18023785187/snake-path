
/**
 * 食物
 */
export class Food {
  private _el: HTMLElement // 食物实体元素
  public idx!: number // 索引位，用于标识虫食物的位置
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

  /**
   * 销毁
   */
  public destroy() {
    this._el.remove()
  }
}