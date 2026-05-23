// 化学元素快速插入列表
export const chemicalElementList = [
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Ag', 'Ba', 'Mn',
  'Br', 'I', 'Pt', 'Au', 'Hg', 'Pb'
]

// 数字按钮（用于下标/上标/系数）
export const numberList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// 化学符号
export const chemicalSymbolList = [
  { label: '→', tex: ' \\to ', desc: '反应箭头', type: 'arrow' },
  { label: '=', tex: ' = ', desc: '等号', type: 'arrow' },
  { label: '⇌', tex: ' \\rightleftharpoons ', desc: '可逆反应', type: 'arrow' },
  { label: '↑', tex: '\\uparrow', desc: '气体', type: 'state' },
  { label: '↓', tex: '\\downarrow', desc: '沉淀', type: 'state' },
  { label: '△', tex: '\\triangle', desc: '加热', type: 'condition' },
  { label: '+', tex: ' + ', desc: '加号', type: 'op' },
  { label: '→[加热]', tex: ' \\xrightarrow{\\triangle} ', desc: '加热箭头', type: 'arrow' },
  { label: '→[高温]', tex: ' \\xrightarrow{\\text{高温}} ', desc: '高温箭头', type: 'arrow' },
  { label: '→[催化剂]', tex: ' \\xrightarrow{\\text{催化剂}} ', desc: '催化剂箭头', type: 'arrow' },
  { label: '→[通电]', tex: ' \\xrightarrow{\\text{通电}} ', desc: '通电箭头', type: 'arrow' },
  { label: '→[点燃]', tex: ' \\xrightarrow{\\text{点燃}} ', desc: '点燃箭头', type: 'arrow' },
  { label: '→[浓H₂SO₄]', tex: ' \\xrightarrow{\\text{浓}H_{2}SO_{4}} ', desc: '浓硫酸条件', type: 'arrow' },
  { label: '⁺', tex: '^{+}', desc: '正一价', type: 'charge' },
  { label: '²⁺', tex: '^{2+}', desc: '正二价', type: 'charge' },
  { label: '³⁺', tex: '^{3+}', desc: '正三价', type: 'charge' },
  { label: '⁻', tex: '^{-}', desc: '负一价', type: 'charge' },
  { label: '²⁻', tex: '^{2-}', desc: '负二价', type: 'charge' },
  { label: 'e⁻', tex: 'e^{-}', desc: '电子', type: 'charge' },
  { label: 'H⁺', tex: 'H^{+}', desc: '氢离子', type: 'charge' },
  { label: 'OH⁻', tex: 'OH^{-}', desc: '氢氧根', type: 'charge' }
]

// 高中常见化学方程式模板（纯 KaTeX LaTeX，无 mhchem 依赖）
export const chemicalEquationTemplates = [
  // 无机化学
  {
    label: '氢气燃烧',
    tex: '2H_{2} + O_{2} \\xrightarrow{\\text{点燃}} 2H_{2}O',
    category: 'inorganic'
  },
  {
    label: '碳在氧气中燃烧',
    tex: 'C + O_{2} \\xrightarrow{\\text{点燃}} CO_{2}',
    category: 'inorganic'
  },
  {
    label: '一氧化碳燃烧',
    tex: '2CO + O_{2} \\xrightarrow{\\text{点燃}} 2CO_{2}',
    category: 'inorganic'
  },
  {
    label: '合成氨',
    tex: 'N_{2} + 3H_{2} \\underset{\\text{催化剂}}{\\stackrel{\\text{高温、高压}}{\\rightleftharpoons}} 2NH_{3}',
    category: 'inorganic'
  },
  {
    label: '碳酸钙分解',
    tex: 'CaCO_{3} \\xrightarrow{\\text{高温}} CaO + CO_{2}\\uparrow',
    category: 'inorganic'
  },
  {
    label: '钠与水反应',
    tex: '2Na + 2H_{2}O \\to 2NaOH + H_{2}\\uparrow',
    category: 'inorganic'
  },
  {
    label: '铝与盐酸反应',
    tex: '2Al + 6HCl \\to 2AlCl_{3} + 3H_{2}\\uparrow',
    category: 'inorganic'
  },
  {
    label: '高炉炼铁',
    tex: 'Fe_{2}O_{3} + 3CO \\xrightarrow{\\text{高温}} 2Fe + 3CO_{2}',
    category: 'inorganic'
  },
  {
    label: '铝热反应',
    tex: '2Al + Fe_{2}O_{3} \\xrightarrow{\\text{高温}} Al_{2}O_{3} + 2Fe',
    category: 'inorganic'
  },
  {
    label: 'SO₂催化氧化',
    tex: '2SO_{2} + O_{2} \\underset{\\triangle}{\\stackrel{\\text{催化剂}}{\\rightleftharpoons}} 2SO_{3}',
    category: 'inorganic'
  },
  {
    label: '氨的催化氧化',
    tex: '4NH_{3} + 5O_{2} \\xrightarrow[\\triangle]{\\text{催化剂}} 4NO + 6H_{2}O',
    category: 'inorganic'
  },
  {
    label: 'Al(OH)₃两性(酸)',
    tex: 'Al(OH)_{3} + 3H^{+} \\to Al^{3+} + 3H_{2}O',
    category: 'inorganic'
  },
  {
    label: 'Al(OH)₃两性(碱)',
    tex: 'Al(OH)_{3} + OH^{-} \\to AlO_{2}^{-} + 2H_{2}O',
    category: 'inorganic'
  },
  // 有机化学
  {
    label: '甲烷燃烧',
    tex: 'CH_{4} + 2O_{2} \\xrightarrow{\\text{点燃}} CO_{2} + 2H_{2}O',
    category: 'organic'
  },
  {
    label: '乙醇燃烧',
    tex: 'C_{2}H_{5}OH + 3O_{2} \\xrightarrow{\\text{点燃}} 2CO_{2} + 3H_{2}O',
    category: 'organic'
  },
  {
    label: '酯化反应',
    tex: 'CH_{3}COOH + C_{2}H_{5}OH \\underset{\\triangle}{\\stackrel{\\text{浓}H_{2}SO_{4}}{\\rightleftharpoons}} CH_{3}COOC_{2}H_{5} + H_{2}O',
    category: 'organic'
  },
  {
    label: '乙烯与溴加成',
    tex: 'CH_{2}\\!=\\!CH_{2} + Br_{2} \\to CH_{2}Br\\!-\\!CH_{2}Br',
    category: 'organic'
  },
  {
    label: '乙酸与碳酸钠',
    tex: '2CH_{3}COOH + Na_{2}CO_{3} \\to 2CH_{3}COONa + CO_{2}\\uparrow + H_{2}O',
    category: 'organic'
  },
  // 电化学
  {
    label: '电解水',
    tex: '2H_{2}O \\xrightarrow{\\text{通电}} 2H_{2}\\uparrow + O_{2}\\uparrow',
    category: 'electrochemistry'
  },
  {
    label: '铜锌原电池',
    tex: 'Zn + Cu^{2+} \\to Zn^{2+} + Cu',
    category: 'electrochemistry'
  },
  {
    label: '氯碱工业',
    tex: '2NaCl + 2H_{2}O \\xrightarrow{\\text{通电}} 2NaOH + H_{2}\\uparrow + Cl_{2}\\uparrow',
    category: 'electrochemistry'
  },
  // 离子反应
  {
    label: 'Ba²⁺+SO₄²⁻沉淀',
    tex: 'Ba^{2+} + SO_{4}^{2-} \\to BaSO_{4}\\downarrow',
    category: 'ion'
  },
  {
    label: '酸碱中和',
    tex: 'H^{+} + OH^{-} \\to H_{2}O',
    category: 'ion'
  },
  {
    label: 'CaCO₃与盐酸',
    tex: 'CaCO_{3} + 2H^{+} \\to Ca^{2+} + CO_{2}\\uparrow + H_{2}O',
    category: 'ion'
  }
]

// 分类名称映射
export const chemicalCategoryMap = {
  all: '全部',
  inorganic: '无机化学',
  organic: '有机化学',
  electrochemistry: '电化学',
  ion: '离子反应'
}
