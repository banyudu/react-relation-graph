import React, { useState, useEffect, ReactNode } from 'react'

const getColorByPercent = (percent: number): string => {
  const startRGB = [0x18, 0x90, 0xff]
  const endRGB = [0xff, 0x00, 0x00]
  const rgb = startRGB.map((start, index) => Math.floor(start + (endRGB[index] - start) * percent))
  console.log('percent is: ', percent)
  const color = '#' + rgb.map(v => Number(v).toString(16).padStart(2, '0')).join('')
  return color
}

const getReverseColor = (hex: string, bw: boolean): string => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF'
  }
  return [r, g, b].reduce((res, item) => res + (255 - item).toString(16).padStart(2, '0'), '#')
}

interface Relation {
  name: string
  value: number
  color?: string
  bgColor?: string
  relations?: Relation[]
}

type RelationOnClickFunc = (r: Relation) => void

interface RelationCanvasProps {
  width: number
  height: number
  bgColor?: string
  relations: Relation[]
  onClick?: RelationOnClickFunc
}

interface Node {
  x: number
  y: number
  r: number // radius
  color: string
  bgColor: string
  name: string
  onClick?: (r: Relation) => void
  relation: Relation
}

const addSubNodes = (nodes: Node[], relation: Relation): void => {
  // 首先插入根节点
  const rootNode: Node = {
    x: 0,
    y: 0,
    r: 50,
    name: relation.name,
    bgColor: '#1890ff',
    color: '#ffffff',
    relation
  }
  nodes.push(rootNode)

  if (relation.relations && relation.relations.length) {
    for (const item of relation.relations) {
      addSubNodes(nodes, item)
    }
  }
}

const getNodesByRelations = (relations: Relation[], onClick?: RelationOnClickFunc): Node[] => {
  const nodes: Node[] = []
  for (const item of relations) {
    addSubNodes(nodes, item)
  }
  if (onClick) {
    for (const node of nodes) {
      node.onClick = () => onClick(node.relation)
    }
  }
  return nodes
}

const renderLine = (begin: Node, end: Node, color: string): ReactNode => {
  const xDiff = begin.x - end.x
  const yDiff = begin.y - end.y
  const len = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
  if (!len) return ''
  const x1 = begin.x - (begin.r / len) * xDiff
  const x2 = end.x + (end.r / len) * xDiff
  const y1 = begin.y - (begin.r / len) * yDiff
  const y2 = end.y + (end.r / len) * yDiff
  return <line key={end.name} {...{ x1, x2, y1, y2 }} stroke='black' />
}

const renderCircle = (node: Node): ReactNode =>
  <a key={`circle-${node.name}`} onClick={node.onClick as any}>
    <circle
      cx={node.x}
      cy={node.y}
      r={node.r}
      fill={node.bgColor}
    >
      <title>{node.name}</title>
    </circle>
  </a>

const renderTitle = (node: Node): ReactNode =>
  <a key={`text-${node.name}`} onClick={node.onClick as any}>
    <text
      x={node.x}
      y={node.y}
      dominantBaseline='middle'
      textAnchor='middle'
      fill={node.color}
    >
      {node.name}
    </text>
  </a>

const maxForce = (force: number): number => Math.max(-1000, Math.min(1000, force))

const arrangeElasticNodes = (nodes: Node[], width: number, height: number, times: number = 1): Node[] => {
  if (times <= 0) {
    return nodes
  }
  /**
   * 根据弹性重新排布节点
   * 每个节点都会受到三种类型的力；
   * 1. 来自连接线的的引力
   * 2. 来自其余节点的斥力
   * 3. 来自边界线的斥力(暂时忽略)
   *
   * 根据这几种力，综合计算出每个节点的受力情况，再做小幅度的运动，然后返回新的坐标值
   */

  // 第一个Node是根结点，和其它节点之间有连接线

  // 力可拆分为x轴和y轴两个维度的力，然后以正负值表示不同的方向

  // 引入质量的概念，等于球的半径（或半径的平方、立方），视效果而定

  // 连接线的引力与重力无关，而来自其余节点和边界线的斥力和质量有关

  if (!nodes || !nodes.length) {
    return nodes
  }

  const force: Array<[number, number]> = nodes.map(_item => [0, 0]) // [number, number] 分别是 x,y 轴的力

  const lineForceFactor = 1

  for (let i = 0; i < nodes.length; i++) {
    const dest = nodes[i]
    // fx, fy代表受力，正负数代表不同的方向。正值代表向上移动，负值代表向下移动
    for (let j = i + 1; j < nodes.length; j++) {
      const src = nodes[j]
      const dx = (dest.x - src.x) // x轴差
      const dy = (dest.y - src.y) // y轴差
      const lenFactor = dx * dx + dy * dy
      const len = Math.sqrt(lenFactor)

      const px = dx / len // x占百分比
      const py = dy / len // y占百分比

      // 斥力
      const rx = src.r * dest.r / len * px // tmp fx
      const ry = src.r * dest.r / len * py // tmp fy

      let gx = 0
      let gy = 0

      // 引力
      if (i === 0) { // 有中心节点，说明有连接线
        gx = lineForceFactor * len * px * 0.02
        gy = lineForceFactor * len * py * 0.02
      }
      const fx = maxForce(rx - gx) || 0
      const fy = maxForce(ry - gy) || 0

      force[i][0] += fx
      force[i][1] += fy
      force[j][0] -= fx
      force[j][1] -= fy
    }
  }

  // 得到受力情况(force之后)，计算其从运动偏移量。d = 1/2 at^2，其中t可认为是常量，所以 1/2 t^2 视为一个常量C，即 d = C * a
  // a = f / m
  const C = 1
  const newNodes = nodes.map((node, index) => {
    const result = { ...node }
    result.x = Math.max(result.r, Math.min(width - result.r, result.x + force[index][0] / result.r * C))
    result.y = Math.max(result.r, Math.min(height - result.r, result.y + force[index][1] / result.r * C))
    return result
  })
  return arrangeElasticNodes(newNodes, width, height, times - 1)
}

const RelationGraph: React.FC<RelationCanvasProps> = (props: RelationCanvasProps) => {
  const svgRef = React.useRef(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const { relations, width, height, onClick } = props

  useEffect(() => {
    // 如果是移动设备，则不存在resize的情况，锁定一次即可
    let nodes = getNodesByRelations(relations, onClick)
    nodes = arrangeElasticNodes(nodes, width, height, 100)
    setNodes(nodes)
  }, relations)

  return (
    <svg
      ref={svgRef}
      width={`${width}px`}
      height={`${height}px`}
      className='relation-svg'
    >
      {nodes.map(node => renderLine(nodes[0], node, 'black'))}
      {nodes.map(node => renderCircle(node))}
      {nodes.map(node => renderTitle(node))}
    </svg>
  )
}

export default RelationGraph
