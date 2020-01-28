import React, { useState, useEffect, ReactNode, useRef } from 'react'

const MAX_NODE_RADIUS = 30
const MIN_NODE_RADIUS = 10

const MAX_FONT_SIZE = 16
const MIN_FONT_SIZE = 10

const DEFAULT_BACKGROUND_COLOR = '#A6ACAF'

interface Point {
  x: number
  y: number
}

interface Relation {
  name: string
  value: number
  color?: string
  bgColor?: string
  relations?: Relation[]
}

type Force = [number, number]

type RelationOnClickFunc = (r: Relation) => void

export interface RelationCanvasProps {
  width: number
  height: number
  bgColor?: string
  relations: Relation[]
  onClick?: RelationOnClickFunc
  debug?: boolean
}

interface Node {
  x: number
  y: number
  r: number // radius
  color?: string
  bgColor?: string
  name: string
  onClick?: (r: Relation) => void
  relation: Relation
  fixed?: boolean
  virtual?: boolean
  children?: Node[]
}

function useInterval(callback, delay) {
  const savedCallback = useRef<Function>(callback)

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const addSubNodes = (nodes: Node[], pNode: Node): void => {
  // 首先插入根节点
  pNode.children = pNode.children || []

  const subRelations = pNode.relation.relations
  if (subRelations && subRelations.length) {
    let maxValue = subRelations.reduce((res, item) => Math.max(res, item.value), 1)
    for (const relation of subRelations) {
      const factor = Math.sqrt(relation.value * 0.7 / maxValue)
      const node: Node = {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        r: pNode.virtual ? MAX_NODE_RADIUS : MIN_NODE_RADIUS + (pNode.r - MIN_NODE_RADIUS) * factor,
        name: relation.name,
        bgColor: relation.bgColor,
        color: relation.color,
        relation
      }
      nodes.push(node)
      pNode.children.push(node)
      addSubNodes(nodes, node)
    }
  }
}

const formatNumber = val => Math.round(val * 100) / 100

const getNodesByRelations = (relations: Relation[], center: Point, onClick?: RelationOnClickFunc): Node[] => {
  // 加入虚拟关系，使root节点尽量靠近中央节点
  const nodes: Node[] = []
  const useVirtualRelation = relations.length !== 1
  let relation: Relation = {
    name: '',
    value: 0,
    relations
  }
  if (!useVirtualRelation) {
    relation = relations[0]
  }
  const virtualNode: Node = {
    x: center.x,
    y: center.y,
    r: useVirtualRelation ? 0 : MAX_NODE_RADIUS,
    relation: relation,
    name: relation.name,
    bgColor: relation.bgColor,
    color: relation.color,
    fixed: true,
    virtual: useVirtualRelation
  }
  nodes.push(virtualNode)
  addSubNodes(nodes, virtualNode)
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

const renderLines = (node: Node, color: string): ReactNode => {
  if (node.virtual || !node.children || !node.children.length) {
    return ''
  }
  return <g key={`lines-${node.name}`}>{node.children.map(child => renderLine(node, child, color))}</g>
}

const renderCircle = (node: Node): ReactNode =>
  <a key={`circle-${node.name}`} onClick={node.onClick as any}>
    <circle
      cx={node.x}
      cy={node.y}
      r={node.r}
      fill={node.bgColor || DEFAULT_BACKGROUND_COLOR}
    >
      <title>{node.name}</title>
    </circle>
  </a>

// fontsize 跟随 radius 变化。设置最大值为16，最小值为10
const renderTitle = (node: Node): ReactNode =>
  <a key={`text-${node.name}`} onClick={node.onClick as any}>
    <text
      x={node.x}
      y={node.y}
      dominantBaseline='middle'
      textAnchor='middle'
      fill={node.color}
      fontSize={MIN_FONT_SIZE + (MAX_FONT_SIZE - MIN_FONT_SIZE) / (MAX_NODE_RADIUS - MIN_NODE_RADIUS) * (node.r - MIN_NODE_RADIUS)}
    >
      {node.name}
    </text>
  </a>

const renderForce = (node: Node, force: Force = [0, 0]): ReactNode => {
  if (node.virtual) {
    return ''
  }
  let xLine; let xArrow; let yLine; let yArrow; let xLabel; let yLabel
  const arrowSize = 3
  const xForce = force[0]
  const yForce = force[1]
  if (xForce) { // x force is not zero
    const x2 = xForce > 0 ? node.x + node.r : node.x - node.r
    xLine = <line stroke='red' x1={node.x} x2={x2} y1={node.y} y2={node.y} />
    const xOffset = xForce > 0 ? -arrowSize : arrowSize
    const xArrowPoints = [
      [x2 + xOffset, node.y + arrowSize].join(','),
      [x2, node.y].join(','),
      [x2 + xOffset, node.y - arrowSize].join(','),
    ].join(' ')
    xArrow = <polyline stroke='red' points={xArrowPoints} />
    xLabel = <text x={x2} y={node.y} dominantBaseline='middle' textAnchor='middle' fill={node.color}>{formatNumber(xForce)}</text>
  }

  if (yForce) { // y force is not zero
    const y2 = yForce > 0 ? node.y + node.r : node.y - node.r
    yLine = <line stroke='red' x1={node.x} x2={node.x} y1={node.y} y2={y2} />
    const yOffset = yForce > 0 ? -arrowSize : arrowSize
    const yArrowPoints = [
      [node.x - arrowSize, y2 + yOffset].join(','),
      [node.x, y2].join(','),
      [node.x + arrowSize, y2 + yOffset].join(','),
    ].join(' ')
    yArrow = <polyline stroke='red' points={yArrowPoints} />
    yLabel = <text x={node.x} y={y2} dominantBaseline='middle' textAnchor='middle' fill={node.color}>{formatNumber(yForce)}</text>
  }

  return <g key={`force-${node.name}`}>
    {xLine}
    {yLine}
    {xArrow}
    {yArrow}
    {xLabel}
    {yLabel}
  </g>
}

const maxForce = (force: number): number => Math.max(-1000, Math.min(1000, force))

const hasDirectRelation = (src: Relation, dest: Relation): boolean => {
  return (src.relations || []).includes(dest) || (dest.relations || []).includes(src)
}

const getForces = (nodes: Node[]): Force[] => {
  const force: Force[] = nodes.map(_item => [0, 0]) // [number, number] 分别是 x,y 轴的力
  const lineForceFactor = 6

  for (let i = 0; i < nodes.length; i++) {
    const dest = nodes[i]
    // fx, fy代表受力，正负数代表不同的方向。正值代表向上移动，负值代表向下移动
    for (let j = i + 1; j < nodes.length; j++) {
      const src = nodes[j]
      const dx = (dest.x - src.x) // x轴差
      const dy = (dest.y - src.y) // y轴差
      const lenFactor = dx * dx + dy * dy
      const len = Math.sqrt(lenFactor)

      const px = len ? dx / len : 1 // x占百分比
      const py = len ? dy / len : 1 // y占百分比
      const edgeLen = Math.max(0, len - src.r - dest.r)

      // 斥力
      let rx = src.r * dest.r / len * px // tmp fx
      let ry = src.r * dest.r / len * py // tmp fy
      // if (edgeLen < 0) {
      //   // 如果有重叠，将斥力放大
      //   rx *= 100
      //   ry *= 100
      // }

      let gx = 0
      let gy = 0

      // 引力
      if (hasDirectRelation(src.relation, dest.relation)) { // 有连接线的情况下，需要计算引力
        gx = lineForceFactor * edgeLen * px * 0.02
        gy = lineForceFactor * edgeLen * py * 0.02
      }
      const fx = maxForce(rx - gx) || 0
      const fy = maxForce(ry - gy) || 0

      force[i][0] += fx
      force[i][1] += fy
      force[j][0] -= fx
      force[j][1] -= fy
    }
  }
  return force.map(item => [formatNumber(item[0]), formatNumber(item[1])])
}

const getDiff = diff => Math.max(-5, Math.min(5, diff))

const arrangeElasticNodes = (nodes: Node[], width: number, height: number, times: number = 2000): Node[] => {
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

  while(times-- > 0) {
    const force = getForces(nodes)
    // 得到受力情况(force之后)，计算其从运动偏移量。d = 1/2 at^2，其中t可认为是常量，所以 1/2 t^2 视为一个常量C，即 d = C * a
    // a = f / m

    const C = 1
    nodes = nodes.map((node, index) => {
      if (node.fixed) {
        return node
      }
      // 加上随机数以打破同一直线方向
      const m = node.r // 重量认为是r
      // 修订：运动幅度可能会过大，导致来回振荡。应限制其单位移动距离
      const xDiff = getDiff(C * force[index][0] / m)
      const yDiff = getDiff(C * force[index][1] / m)
      if (Math.abs(force[index][0]) < 1 && Math.abs(force[index][1]) < 1) {
        node.fixed = true
      }

      node.x = Math.max(node.r, Math.min(width - node.r, node.x + xDiff))
      node.y = Math.max(node.r, Math.min(height - node.r, node.y + yDiff))
      // console.log('diff: ', [xDiff, yDiff].join(','))
      // console.log('result: ', [result.x, result.y].join(','))
      return node
    })
  }
  return nodes
}

const RelationGraph: React.FC<RelationCanvasProps> = (props: RelationCanvasProps) => {
  const { relations, width, height, onClick, bgColor = '#ffffff', debug } = props
  const svgRef = React.useRef(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [forces, setForces] = useState<Force[]>([])
  const [isRunning, setIsRunning] = useState<boolean>(true)

  useEffect(() => {
    let newNodes = getNodesByRelations(relations, { x: width / 2, y: height / 2 }, onClick)
    newNodes = arrangeElasticNodes(newNodes, width, height)
    setNodes(newNodes)
  }, relations)

  useEffect(() => {
    setForces(getForces(nodes))
  }, [nodes])

  const reSort = () => {
    setNodes(arrangeElasticNodes(nodes, width, height))
  }

  if (debug) {
    useInterval(reSort, isRunning ? 200: null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {debug && <button style={{ width: '60px' }} onClick={() => {setIsRunning(!isRunning)}}>{isRunning ? 'Pause' : 'Resume'}</button> }
      <svg
        ref={svgRef}
        width={`${width}px`}
        height={`${height}px`}
        className='relation-svg'
        style={{backgroundColor: bgColor}}
      >
        {nodes.map(node => renderLines(node, 'black'))}
        {nodes.map(node => renderCircle(node))}
        {nodes.map(node => renderTitle(node))}
        {debug && nodes.map((node, index) => renderForce(node, forces[index]))}
      </svg>
    </div>
  )
}

export default RelationGraph
