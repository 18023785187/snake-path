/**
 * 根据一维索引位 idx 和网格单行长度 gridLength 和单元格 unitX、unitY 计算 idx 所在的位置
 * @param {number} idx 一维索引位
 * @param {number} gridLength 网格单行长度
 * @param {number} unitX 单元格
 * @param {number} unitY 单元格
 * @returns {[number, number]}
 */
export function computePosition(
  idx: number,
  gridLength: number,
  unitX: number,
  unitY: number
): [number, number] {
  if (idx < 0 || idx >= gridLength ** 2) {
    throw new Error('idx out of range')
  }

  const i = Math.floor(idx / gridLength)
  const j = idx % gridLength

  return [i * unitX, j * unitY]
}
