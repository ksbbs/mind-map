<template>
  <Sidebar ref="sidebar" :title="$t('formulaSidebar.title')">
    <div class="box" :class="{ isDark: isDark }">
      <!-- 模式切换 -->
      <div class="modeSwitch">
        <el-radio-group v-model="inputMode" size="mini">
          <el-radio-button label="visual">{{ $t('formulaSidebar.visualMode') }}</el-radio-button>
          <el-radio-button label="latex">{{ $t('formulaSidebar.latexMode') }}</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 可视化公式编辑区 -->
      <div v-show="inputMode === 'visual'" class="visualEditor">
        <div ref="mathFieldContainer" class="mathFieldWrap"></div>
      </div>

      <!-- LaTeX 文本编辑区 -->
      <div v-show="inputMode === 'latex'" class="formulaInputBox">
        <el-input
          ref="inputRef"
          v-model="formulaText"
          :rows="4"
          resize="none"
          type="textarea"
          :placeholder="$t('formulaSidebar.placeholder')"
          @keydown.native.stop
        />
      </div>

      <!-- 快速符号栏 -->
      <div class="quickSymbols">
        <el-popover
          v-for="sym in quickSymbols"
          :key="sym.label"
          placement="top"
          trigger="hover"
          :content="sym.label"
        >
          <div class="quickBtn" slot="reference" @click="insertSymbol(sym.tex)">
            <span v-if="sym.icon" v-html="sym.icon"></span>
            <span v-else>{{ sym.label }}</span>
          </div>
        </el-popover>
      </div>

      <el-button
        size="small"
        type="primary"
        style="width: 100%;"
        @click="confirm"
      >{{ $t('formulaSidebar.confirm') }}</el-button>

      <!-- 模板标签页 -->
      <el-tabs v-model="activeTab" type="border-card" class="formulaTabs">
        <el-tab-pane :label="$t('formulaSidebar.tab_math')" name="math">
          <div class="formulaList customScrollbar">
            <div class="formulaItem" v-for="(item, index) in mathList" :key="index">
              <div class="overview" v-html="item.overview"></div>
              <div class="text" @click="selectTemplate(item.text)">
                {{ item.text }}
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('formulaSidebar.tab_physics')" name="physics">
          <div class="physicsGroups customScrollbar">
            <div class="groupBlock" v-for="group in physicsGroups" :key="group.name">
              <div class="groupTitle">{{ group.name }}</div>
              <div class="formulaList">
                <div class="formulaItem" v-for="(item, index) in group.items" :key="index">
                  <div class="overview" v-html="item.overview"></div>
                  <div class="text" @click="selectTemplate(item.text)">
                    <div class="textLabel">{{ item.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('formulaSidebar.tab_chemistry')" name="chemistry">
          <div class="chemistryTip">
            {{ $t('formulaSidebar.chemistryTip') }}
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { mapState, mapMutations } from 'vuex'
import { formulaList, physicsFormulaList } from '@/config/constant'
import 'mathlive'

export default {
  components: { Sidebar },
  props: {
    mindMap: { type: Object }
  },
  data() {
    return {
      formulaText: '',
      mathList: [],
      physicsList: [],
      activeTab: 'math',
      inputMode: 'visual',
      mathField: null,
      quickSymbols: [
        { label: '分数', tex: '\\frac{}{}', icon: '<sup>a</sup>/<sub>b</sub>' },
        { label: '根号', tex: '\\sqrt{}', icon: '√' },
        { label: 'n次根', tex: '\\sqrt[n]{}', icon: '<sup>n</sup>√' },
        { label: '上标', tex: '^{}', icon: 'x<sup>n</sup>' },
        { label: '下标', tex: '_{}', icon: 'x<sub>n</sub>' },
        { label: '积分', tex: '\\int_{}^{}', icon: '∫' },
        { label: '求和', tex: '\\sum_{}^{}', icon: 'Σ' },
        { label: '极限', tex: '\\lim_{x \\to \\infty}', icon: 'lim' },
        { label: '矩阵', tex: '\\begin{matrix}a & b \\\\c & d\\end{matrix}', icon: '▦' },
        { label: '方程组', tex: '\\begin{cases}3x+5y+z \\\\7x-2y+4z \\\\-6x+3y+2z\\end{cases}', icon: '{' },
        { label: '±', tex: '\\pm', icon: '±' },
        { label: 'π', tex: '\\pi', icon: 'π' },
        { label: 'θ', tex: '\\theta', icon: 'θ' },
        { label: 'α', tex: '\\alpha', icon: 'α' },
        { label: 'β', tex: '\\beta', icon: 'β' },
        { label: 'Δ', tex: '\\Delta', icon: 'Δ' },
        { label: '→', tex: '\\to', icon: '→' },
        { label: '∞', tex: '\\infty', icon: '∞' },
        { label: '°', tex: '^{\\circ}', icon: '°' },
        { label: '·', tex: '\\cdot', icon: '·' }
      ]
    }
  },
  computed: {
    ...mapState({
      activeSidebar: state => state.activeSidebar,
      isDark: state => state.localConfig.isDark,
      localConfig: state => state.localConfig
    }),
    physicsGroups() {
      const groups = {}
      this.physicsList.forEach(item => {
        if (!groups[item.group]) groups[item.group] = { name: item.group, items: [] }
        groups[item.group].items.push(item)
      })
      return Object.values(groups)
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'formulaSidebar') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    },
    inputMode(val) {
      if (val === 'visual') {
        this.$nextTick(() => this.initMathField())
      }
    }
  },
  created() {
    this.$bus.$on('node_active', this.handleNodeActive)
  },
  beforeDestroy() {
    this.$bus.$off('node_active', this.handleNodeActive)
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    init() {
      if (!window.katex) return
      const katexConfig = this.mindMap.formula.getKatexConfig()
      this.mathList = formulaList.map(item => ({
        overview: window.katex.renderToString(item, katexConfig),
        text: item
      }))
      this.physicsList = physicsFormulaList.map(item => ({
        overview: window.katex.renderToString(item.tex, katexConfig),
        text: item.tex,
        label: item.label,
        group: item.group
      }))
      this.$nextTick(() => {
        if (this.inputMode === 'visual') {
          this.initMathField()
        }
      })
    },

    initMathField() {
      if (this.mathField) return
      const container = this.$refs.mathFieldContainer
      if (!container) return
      const mf = document.createElement('math-field')
      mf.setAttribute('virtual-keyboard-mode', 'onfocus')
      mf.style.width = '100%'
      mf.style.minHeight = '60px'
      mf.style.fontSize = '16px'
      mf.style.padding = '8px'
      mf.style.border = '1px solid #dcdfe6'
      mf.style.borderRadius = '4px'
      mf.style.backgroundColor = this.isDark ? 'transparent' : '#fff'
      mf.style.color = this.isDark ? '#fff' : '#333'
      mf.addEventListener('input', () => {
        this.formulaText = mf.value || ''
      })
      container.innerHTML = ''
      container.appendChild(mf)
      this.mathField = mf
    },

    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
      if (this.activeNodes.length <= 0 && this.activeSidebar === 'formulaSidebar') {
        this.setActiveSidebar(null)
      }
    },

    // 选择一个模板（可视化模式下设置 math-field 的值）
    selectTemplate(tex) {
      if (this.inputMode === 'visual' && this.mathField) {
        this.mathField.setValue(tex)
        this.formulaText = tex
      } else {
        this.formulaText = tex
      }
    },

    // 插入符号
    insertSymbol(tex) {
      if (this.inputMode === 'visual' && this.mathField) {
        this.mathField.insert(tex)
        this.formulaText = this.mathField.value || ''
      } else {
        const el = this.$refs.inputRef
        if (el) {
          const textarea = el.$el ? el.$el.querySelector('textarea') : null
          if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const before = this.formulaText.substring(0, start)
            const after = this.formulaText.substring(end)
            this.formulaText = before + tex + after
            this.$nextTick(() => {
              textarea.setSelectionRange(start + tex.length, start + tex.length)
              textarea.focus()
            })
          } else {
            this.formulaText += tex
          }
        } else {
          this.formulaText += tex
        }
      }
    },

    confirm() {
      if (!this.localConfig.openNodeRichText) {
        return this.$message.warning(this.$t('formulaSidebar.tip'))
      }
      let str = this.formulaText.trim()
      if (this.inputMode === 'visual' && this.mathField) {
        str = (this.mathField.value || '').trim()
      }
      if (!str) return
      this.mindMap.execCommand('INSERT_FORMULA', str)
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.isDark {
    .title, .groupTitle { color: #fff; }
    .formulaList {
      .formulaItem {
        .overview, .text { color: #fff; }
        .text { background-color: #363b3f; }
      }
    }
    .chemistryTip { color: #aaa; }
    /deep/ .el-textarea__inner {
      background-color: transparent;
      color: #fff;
    }
    /deep/ .el-tabs__item { color: #ccc; }
  }

  .modeSwitch {
    flex-shrink: 0;
    margin-bottom: 6px;
    display: flex;
    justify-content: center;
  }

  .visualEditor {
    flex-shrink: 0;
    .mathFieldWrap {
      /deep/ math-field {
        --primary: #409eff;
        --smart-fence-color: #409eff;
        --caret-color: #409eff;
      }
    }
  }

  .formulaInputBox {
    flex-shrink: 0;
  }

  .quickSymbols {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 6px 0;
    flex-shrink: 0;
    .quickBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 24px;
      padding: 0 4px;
      font-size: 13px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      cursor: pointer;
      background-color: #fafafa;
      transition: all 0.15s;
      &:hover {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
      }
    }
  }

  .formulaTabs {
    flex: 1;
    overflow: hidden;
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    /deep/ .el-tabs__content {
      flex: 1;
      overflow: hidden;
      padding: 0;
    }
    /deep/ .el-tab-pane {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }

  .formulaList {
    flex: 1;
    overflow-y: auto;
    .formulaItem {
      position: relative;
      display: flex;
      overflow: hidden;
      align-items: center;
      border: 1px solid #dcdfe6;
      border-bottom: none;
      &:last-of-type { border-bottom: 1px solid #dcdfe6; }
      .overview, .text {
        width: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      }
      .overview {
        padding: 10px 0;
        border-right: none;
      }
      .text {
        cursor: pointer;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        border-left: 1px solid #dcdfe6;
        background-color: #fafafa;
        flex-direction: column;
        .textLabel {
          font-size: 11px;
          color: #909399;
          margin-bottom: 2px;
        }
      }
    }
  }

  .physicsGroups {
    flex: 1;
    overflow-y: auto;
    .groupBlock {
      margin-bottom: 8px;
      .groupTitle {
        font-size: 14px;
        font-weight: 600;
        color: #409eff;
        padding: 4px 0;
        border-bottom: 1px solid #ebeef5;
        margin-bottom: 6px;
      }
    }
  }

  .chemistryTip {
    padding: 40px 0;
    text-align: center;
    color: #909399;
    font-size: 14px;
  }
}
</style>
