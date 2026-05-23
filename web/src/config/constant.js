//  布局结构图片映射
export const layoutImgMap = {
  logicalStructure: require('../assets/img/structures/logicalStructure.jpg'),
  logicalStructureLeft: require('../assets/img/structures/logicalStructureLeft.jpg'),
  mindMap: require('../assets/img/structures/mindMap.jpg'),
  organizationStructure: require('../assets/img/structures/organizationStructure.jpg'),
  catalogOrganization: require('../assets/img/structures/catalogOrganization.jpg'),
  timeline: require('../assets/img/structures/timeline.jpg'),
  timeline2: require('../assets/img/structures/timeline2.jpg'),
  fishbone: require('../assets/img/structures/fishbone.jpg'),
  fishbone2: require('../assets/img/structures/fishbone2.jpg'),
  rightFishbone: require('../assets/img/structures/rightFishbone.jpg'),
  rightFishbone2: require('../assets/img/structures/rightFishbone2.jpg'),
  verticalTimeline: require('../assets/img/structures/verticalTimeline.jpg'),
  verticalTimeline2: require('../assets/img/structures/verticalTimeline2.jpg'),
  verticalTimeline3: require('../assets/img/structures/verticalTimeline3.jpg')
}

// 公式列表
export const formulaList = [
  'a^2',
  'a_2',
  'a^{2+2}',
  'a_{i,j}',
  'x_2^3',
  '\\overbrace{1+2+\\cdots+100}',
  '\\sum_{k=1}^N k^2',
  '\\lim_{n \\to \\infty}x_n',
  '\\int_{-N}^{N} e^x\\, dx',
  '\\sqrt{3}',
  '\\sqrt[n]{3}',
  '\\sin\\theta',
  '\\log X',
  '\\log_{10}',
  '\\log_\\alpha X',
  '\\lim_{t\\to n}T',
  '\\frac{1}{2}=0.5',
  '\\binom{n}{k}',
  '\\begin{matrix}x & y \\\\z & v\\end{matrix}',
  '\\begin{cases}3x + 5y +  z \\\\7x - 2y + 4z \\\\-6x + 3y + 2z\\end{cases}'
]

// 支持某种连线类型的结构
export const supportLineStyleLayoutsMap = {
  curve: [
    'logicalStructure',
    'logicalStructureLeft',
    'mindMap',
    'verticalTimeline',
    'organizationStructure'
  ],
  direct: [
    'logicalStructure',
    'logicalStructureLeft',
    'mindMap',
    'organizationStructure',
    'verticalTimeline'
  ]
}

// 直线模式支持设置圆角的结构
export const supportLineRadiusLayouts = [
  'logicalStructure',
  'logicalStructureLeft',
  'mindMap',
  'verticalTimeline'
]

// 支持只显示底边直线风格的结构
export const supportNodeUseLineStyleLayouts = [
  'logicalStructure',
  'logicalStructureLeft',
  'mindMap',
  'catalogOrganization',
  'organizationStructure'
]

// 支持曲线模式下，根节点样式和其他节点样式保持一致的结构
export const supportRootLineKeepSameInCurveLayouts = [
  'logicalStructure',
  'logicalStructureLeft',
  'mindMap',
  'organizationStructure'
]

// 物理公式模板列表
export const physicsFormulaList = [
  // 运动学
  { label: '平均速度', tex: '\\bar{v} = \\frac{\\Delta x}{\\Delta t}', group: '运动学' },
  { label: '加速度', tex: 'a = \\frac{v_t - v_0}{t}', group: '运动学' },
  { label: '匀变速位移-时间', tex: 'x = v_0 t + \\frac{1}{2} a t^2', group: '运动学' },
  { label: '匀变速速度-位移', tex: 'v_t^2 - v_0^2 = 2 a x', group: '运动学' },
  { label: '自由落体高度', tex: 'h = \\frac{1}{2} g t^2', group: '运动学' },
  { label: '竖直上抛最大高度', tex: 'h = \\frac{v_0^2}{2g}', group: '运动学' },
  { label: '抛体运动水平位移', tex: 'x = v_0 \\cos\\theta \\cdot t', group: '运动学' },
  { label: '抛体运动竖直位移', tex: 'y = v_0 \\sin\\theta \\cdot t - \\frac{1}{2} g t^2', group: '运动学' },
  // 力学
  { label: '牛顿第二定律', tex: 'F = m a', group: '力学' },
  { label: '重力', tex: 'G = m g', group: '力学' },
  { label: '滑动摩擦力', tex: 'f = \\mu N', group: '力学' },
  { label: '胡克定律', tex: 'F = k x', group: '力学' },
  { label: '万有引力定律', tex: 'F = G \\frac{M m}{r^2}', group: '力学' },
  { label: '向心力', tex: 'F = m \\frac{v^2}{r} = m \\omega^2 r', group: '力学' },
  { label: '动能', tex: 'E_k = \\frac{1}{2} m v^2', group: '力学' },
  { label: '重力势能', tex: 'E_p = m g h', group: '力学' },
  { label: '动能定理', tex: 'W = \\Delta E_k = \\frac{1}{2} m v_2^2 - \\frac{1}{2} m v_1^2', group: '力学' },
  { label: '机械能守恒定律', tex: 'E_{k1} + E_{p1} = E_{k2} + E_{p2}', group: '力学' },
  { label: '动量定理', tex: 'F t = m v_t - m v_0', group: '力学' },
  { label: '动量守恒定律', tex: 'm_1 v_1 + m_2 v_2 = m_1 v_1\' + m_2 v_2\'', group: '力学' },
  { label: '简谐运动回复力', tex: 'F = -k x', group: '力学' },
  { label: '单摆周期', tex: 'T = 2\\pi \\sqrt{\\frac{l}{g}}', group: '力学' },
  // 电磁学
  { label: '库仑定律', tex: 'F = k \\frac{Q_1 Q_2}{r^2}', group: '电磁学' },
  { label: '电场强度', tex: 'E = \\frac{F}{q}', group: '电磁学' },
  { label: '点电荷电场强度', tex: 'E = k \\frac{Q}{r^2}', group: '电磁学' },
  { label: '电势差与电场强度', tex: 'E = \\frac{U}{d}', group: '电磁学' },
  { label: '电场力做功', tex: 'W = q U', group: '电磁学' },
  { label: '欧姆定律', tex: 'I = \\frac{U}{R}', group: '电磁学' },
  { label: '电阻定律', tex: 'R = \\rho \\frac{l}{S}', group: '电磁学' },
  { label: '电功率', tex: 'P = U I = I^2 R = \\frac{U^2}{R}', group: '电磁学' },
  { label: '焦耳定律', tex: 'Q = I^2 R t', group: '电磁学' },
  { label: '安培力', tex: 'F = B I L \\sin\\theta', group: '电磁学' },
  { label: '洛伦兹力', tex: 'F = q v B \\sin\\theta', group: '电磁学' },
  { label: '法拉第电磁感应定律', tex: 'E = n \\frac{\\Delta \\Phi}{\\Delta t}', group: '电磁学' },
  { label: '切割磁感线电动势', tex: 'E = B L v \\sin\\theta', group: '电磁学' },
  // 热学
  { label: '理想气体状态方程', tex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}', group: '热学' },
  { label: '克拉伯龙方程', tex: 'P V = n R T', group: '热学' },
  { label: '热力学第一定律', tex: '\\Delta U = Q + W', group: '热学' },
  // 波动光学
  { label: '波长频率波速', tex: 'v = \\lambda f', group: '波动与光学' },
  { label: '折射定律', tex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2', group: '波动与光学' },
  { label: '折射率与速度', tex: 'n = \\frac{c}{v}', group: '波动与光学' },
  { label: '双缝干涉条纹间距', tex: '\\Delta x = \\frac{L}{d} \\lambda', group: '波动与光学' }
]

// 彩虹线条配置
export const rainbowLinesOptions = [
  {
    value: 'close'
  },
  {
    value: 'colors1',
    list: [
      'rgb(255, 213, 73)',
      'rgb(255, 136, 126)',
      'rgb(107, 225, 141)',
      'rgb(151, 171, 255)',
      'rgb(129, 220, 242)',
      'rgb(255, 163, 125)',
      'rgb(152, 132, 234)'
    ]
  },
  {
    value: 'colors2',
    list: [
      'rgb(248, 93, 93)',
      'rgb(255, 151, 84)',
      'rgb(255, 214, 69)',
      'rgb(73, 205, 140)',
      'rgb(64, 192, 255)',
      'rgb(84, 110, 214)',
      'rgb(164, 93, 220)'
    ]
  },
  {
    value: 'colors3',
    list: [
      'rgb(140, 240, 231)',
      'rgb(74, 210, 255)',
      'rgb(65, 168, 243)',
      'rgb(49, 128, 205)',
      'rgb(188, 226, 132)',
      'rgb(113, 215, 123)',
      'rgb(120, 191, 109)'
    ]
  },
  {
    value: 'colors4',
    list: [
      'rgb(169, 98, 99)',
      'rgb(245, 125, 123)',
      'rgb(254, 183, 168)',
      'rgb(251, 218, 171)',
      'rgb(138, 163, 181)',
      'rgb(131, 127, 161)',
      'rgb(84, 83, 140)'
    ]
  },
  {
    value: 'colors5',
    list: [
      'rgb(255, 229, 142)',
      'rgb(254, 158, 41)',
      'rgb(248, 119, 44)',
      'rgb(232, 82, 80)',
      'rgb(182, 66, 98)',
      'rgb(99, 54, 99)',
      'rgb(65, 40, 82)'
    ]
  },
  {
    value: 'colors6',
    list: [
      'rgb(171, 227, 209)',
      'rgb(107, 201, 196)',
      'rgb(55, 170, 169)',
      'rgb(18, 135, 131)',
      'rgb(74, 139, 166)',
      'rgb(75, 105, 150)',
      'rgb(57, 75, 133)'
    ]
  }
]
